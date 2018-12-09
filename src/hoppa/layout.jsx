import React from "react"
import PropTypes from "prop-types"

export default class HopppaLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let {specSelectors, getComponent} = this.props

    let SvgAssets = getComponent("SvgAssets")
    let VersionPragmaFilter = getComponent("VersionPragmaFilter")
    let HoppaOperations = getComponent("HoppaOperations", true)
    let Errors = getComponent("errors", true)

    const FilterContainer = getComponent("FilterContainer", true)
    let isSwagger2 = specSelectors.isSwagger2()
    let isOAS3 = specSelectors.isOAS3()

    const isSpecEmpty = !specSelectors.specStr()

    if(isSpecEmpty) {
      let loadingMessage
      let isLoading = specSelectors.loadingStatus() === "loading"
      if(isLoading) {
        loadingMessage = <div className="loading"></div>
      } else {
        loadingMessage = <h4>No API definition provided.</h4>
      }

      return <div className="swagger-ui">
        <div className="loading-container">
          {loadingMessage}
        </div>
      </div>
    }

    return (

        <div>
          <SvgAssets />
          <VersionPragmaFilter isSwagger2={isSwagger2} isOAS3={isOAS3} alsoShow={<Errors/>}>
            <Errors/>
            <FilterContainer/>
            <HoppaOperations/>      
          </VersionPragmaFilter>
        </div>
      )
  }
}
