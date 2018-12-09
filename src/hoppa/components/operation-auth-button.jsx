import React from "react"
import PropTypes from "prop-types"

export default class HoppaOperationAuthButton extends React.Component {
    static propTypes = {
      isAuthorized: PropTypes.bool.isRequired,
      onClick: PropTypes.func
    }

  onClick =(e) => {
    e.stopPropagation()
    let { onClick } = this.props

    if(onClick) {
      onClick()
    }
  }

  render() {
    let { isAuthorized } = this.props

    return (
      <button type="button" className={isAuthorized ? "md-button md-success md-simple md-just-icon md-theme-default" : "md-button md-default md-simple md-just-icon md-theme-default"} onClick={this.onClick}>
        <div className="md-ripple">
          <div className="md-button-content">
            <i className="md-icon md-icon-font md-theme-default">{ isAuthorized ? "lock" : "lock_open"}</i>
          </div>
        </div>
      </button>
    )
  }
}
