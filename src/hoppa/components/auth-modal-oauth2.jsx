import React from "react"
import PropTypes from "prop-types"
import oauth2Authorize from "core/oauth2-authorize"

export default class HoppaAuthModalOauth2 extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    getConfigs: PropTypes.any
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorized, authSelectors } = this.props
    let auth = authorized && authorized.get(name)
    let authConfigs = authSelectors.getConfigs() || {}
    let username = auth && auth.get("username") || ""
    let clientId = auth && auth.get("clientId") || authConfigs.clientId || ""
    let clientSecret = auth && auth.get("clientSecret") || authConfigs.clientSecret || ""
    let passwordType = auth && auth.get("passwordType") || "basic"

    this.state = {
      appName: authConfigs.appName,
      name: name,
      schema: schema,
      scopes: [],
      clientId: clientId,
      clientSecret: clientSecret,
      username: username,
      password: "",
      passwordType: passwordType
    }
  }

  close = (e) => {
    e.preventDefault()
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  authorize =() => {
    let { authActions, errActions, getConfigs, authSelectors } = this.props
    let configs = getConfigs()
    let authConfigs = authSelectors.getConfigs()

    errActions.clear({authId: name,type: "auth", source: "auth"})
    oauth2Authorize({auth: this.state, authActions, errActions, configs, authConfigs })
  }

  onScopeChange =(e) => {
    let { target } = e
    let { checked } = target
    let scope = target.dataset.value

    if ( checked && this.state.scopes.indexOf(scope) === -1 ) {
      let newScopes = this.state.scopes.concat([scope])
      this.setState({ scopes: newScopes })
    } else if ( !checked && this.state.scopes.indexOf(scope) > -1) {
      this.setState({ scopes: this.state.scopes.filter((val) => val !== scope) })
    }
  }

  onInputChange =(e) => {
    let { target : { dataset : { name }, value } } = e
    let state = {
      [name]: value
    }

    this.setState(state)
  }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props

    errActions.clear({authId: name, type: "auth", source: "auth"})
    authActions.logout([ name ])
  }

  render() {
    let {
      schema, getComponent, authSelectors, errSelectors, name, specSelectors
    } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Button = getComponent("Button")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )

    const { isOAS3 } = specSelectors

    // Auth type consts
    const IMPLICIT = "implicit"
    const PASSWORD = "password"
    const ACCESS_CODE = isOAS3() ? "authorizationCode" : "accessCode"
    const APPLICATION = isOAS3() ? "clientCredentials" : "application"

    let flow = schema.get("flow")
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let isValid = !errors.filter( err => err.get("source") === "validation").size
    let description = schema.get("description")

    var color;
    if(isAuthorized) {
      color = "#f44336"
    } else {
      color = "#4caf50"
    }

    return (
      <div className="md-layout-item md-size-100">
        { ( flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || flow === PASSWORD ) && ( !isAuthorized || isAuthorized && this.state.clientId) && 
          <div className="md-field md-has-placeholder md-theme-default md-focused">
            <label htmlFor="client_id">Client Id</label>
            {
              isAuthorized ? <input 
                type="text"
                id="client_id" 
                className="md-input md-disabled" 
                disabled 
                value={ this.state.clientId } />
              : <input
                type="text" 
                id="client_id" 
                className="md-input" 
                required
                value={ this.state.clientId }
                data-name="clientId"
                onChange={ this.onInputChange }/>
            }
          </div>
        }
        {
          ( ( flow === APPLICATION || flow === ACCESS_CODE || flow === PASSWORD) &&
          <div className="md-field md-has-placeholder md-theme-default md-focused">
            <label htmlFor="client_secret">Client Secret</label>
            {
              isAuthorized ? <input
                type="text"
                id="client_secret"
                className="md-imput md-disabled"
                disabled
                value="******" />
              : <input 
                type="text"
                id="client_secret"
                className="md-input" 
                value={ this.state.clientSecret }
                data-name="clientSecret"
                onChange={ this.onInputChange }/>
            }
          </div>
        )}
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
        <br />
        <div className="modal-footer">
          { isValid &&
            ( isAuthorized ?
              <button 
                type="button" 
                className="md-button md-theme-default"
                onClick={ this.logout }
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('background-color', color, 'important');
                  }
                }}>
                <div className="md-ripple">
                  <div className="md-button-content">
                    Unauthorize
                  </div>
                </div>
              </button>
            :
              <button 
                type="button"
                className="md-button md-theme-default" 
                onClick={ this.authorize }
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('background-color', color, 'important');
                  }
                }}>
                <div className="md-ripple">
                  <div className="md-button-content">
                    Authorize
                  </div>
                </div>
              </button>
            )
          }
        </div>
      </div>
    )
  }
}
