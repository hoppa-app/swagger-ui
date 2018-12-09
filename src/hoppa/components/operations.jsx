import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

const SWAGGER2_OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch"
]

const OAS3_OPERATION_METHODS = SWAGGER2_OPERATION_METHODS.concat(["trace"])


export default class HoppaOperations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: null,
      previous: null,
    };
  }

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired
  };

  hanldleTab = (tag) => {
    this.setState(
      {
        previous: this.state.current,
        current: tag
      }
    );
  };

  render() {
    let {
      specSelectors,
      getComponent,
      layoutSelectors,
      getConfigs,
      fn
    } = this.props

    let taggedOps = specSelectors.taggedOperations()

    const HoppaOperationContainer = getComponent("HoppaOperationContainer", true)
    const HoppaOperationsHeader = getComponent("HoppaOperationsHeader")
    const HoppaOperationsContent = getComponent("HoppaOperationsContent")
    const HoppaAuthContainer = getComponent("HoppaAuthContainer", true)

    let {
      maxDisplayedTags,
    } = getConfigs()

    let filter = layoutSelectors.currentFilter()

    if (filter) {
      if (filter !== true) {
        taggedOps = fn.opsFilter(taggedOps, filter)
      }
    }

    if (!this.state.current){
      this.state.current = taggedOps._list._tail.array[0][0].toLowerCase()
    }

    if (maxDisplayedTags && !isNaN(maxDisplayedTags) && maxDisplayedTags >= 0) {
      taggedOps = taggedOps.slice(0, maxDisplayedTags)
    }

    const minTableHeight = {
      minHeight: "500px"
    }

    return (
        <div className="md-layout-item md-size-100">
          <h3>
            <small>
              Operations
            </small>
          </h3>
          <div className="md-card md-card-nav-tabs md-theme-default no-label">
            <div className="md-card-content">
              <div className="md-tabs md-danger md-alignment-left md-theme-default">
                <div className="md-tabs-navigation md-elevation-0">
                  <HoppaAuthContainer/>
                  {
                    taggedOps.map((tagObj, tag) => {   
                      return (
                        <HoppaOperationsHeader
                            key={"tab-button-" + tag}
                            tag={tag}
                            hanldleTab={this.hanldleTab}
                            current={this.state.current}>
                        </HoppaOperationsHeader>
                      )
                    }).toArray()
                  }
                </div>
              </div>
              <div className="md-content md-tabs-content md-theme-default" style={minTableHeight}>
                <div className="md-tabs-container">
                  {
                    taggedOps.map((tagObj, tag) => {
                      const operations = tagObj.get("operations")
                      return (
                        <HoppaOperationsContent
                          key={"tab-content" + tag}
                          tagObj={tagObj}
                          tag={tag}
                          current={this.state.current}
                          getComponent={getComponent}>
                          {
                            operations.map( op => {
                              const path = op.get("path")
                              const method = op.get("method")
                              const specPath = Im.List(["paths", path, method])


                              // FIXME: (someday) this logic should probably be in a selector,
                              // but doing so would require further opening up
                              // selectors to the plugin system, to allow for dynamic
                              // overriding of low-level selectors that other selectors
                              // rely on. --KS, 12/17
                              const validMethods = specSelectors.isOAS3() ?
                                    OAS3_OPERATION_METHODS : SWAGGER2_OPERATION_METHODS

                              if(validMethods.indexOf(method) === -1) {
                                return null
                              }

                              return <HoppaOperationContainer
                                        key={`${path}-${method}`}
                                        specPath={specPath}
                                        op={op}
                                        path={path}
                                        method={method}
                                        tag={tag}
                                        />
                            }).toArray()
                          }
                        </HoppaOperationsContent>
                      )
                    }).toArray()
                  }
                </div>
              </div>
            </div>
          </div>
          { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
        </div>
    )
  }

}

HoppaOperations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
