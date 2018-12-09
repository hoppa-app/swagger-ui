import React from "react"
import PropTypes from "prop-types"

export default class HoppaAuthModal extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const HoppaAuthModalBody = getComponent("HoppaAuthModalBody")

    return (
      <div className="modal-mask">
        <div className="modal-wrapper">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Authorization</h4>
              <button type="button" className="md-button md-simple md-just-icon md-round modal-default-button md-theme-default" onClick={ this.close }>
                <div className="md-ripple">
                  <div className="md-button-content">
                    <i className="md-icon md-icon-font md-theme-default">clear</i>
                  </div>
                </div>
              </button>
            </div>
            {
              definitions.valueSeq().map(( definition, key ) => {
                return <HoppaAuthModalBody
                  key={ key }
                  AST={AST}
                  definitions={ definition }
                  getComponent={ getComponent }
                  errSelectors={ errSelectors }
                  authSelectors={ authSelectors }
                  authActions={ authActions }
                  specSelectors={ specSelectors }/>
              })
            }
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
