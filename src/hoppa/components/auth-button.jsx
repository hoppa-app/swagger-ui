import React from "react"
import PropTypes from "prop-types"

export default class HoppaAuthButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    isAuthorized: PropTypes.bool,
    showPopup: PropTypes.bool,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { isAuthorized, showPopup, onClick, getComponent } = this.props

    //must be moved out of button component
    const HoppaAuthModal = getComponent("HoppaAuthModal", true)

    var buttonStyle;
    var color;
    if(isAuthorized) {
      buttonStyle = {
        width: "100%"
      }
      color = "#ff9800";
    } else {
      buttonStyle = {
        width: "100%"
      }
      color = "#4caf50";
    }

    return (
      <div>
        { showPopup && <HoppaAuthModal /> }  
          <button 
            type="button"
            className="md-button md-theme-default" 
            onClick={onClick} 
            style={buttonStyle}
            ref={(el) => {
              if (el) {
                el.style.setProperty('background-color', color, 'important');
              }
            }}>
            <div className="md-ripple">
              <div className="md-button-content">
                <i className="md-icon md-icon-font md-theme-default">{ isAuthorized ? "lock" : "lock_open"}</i> { isAuthorized ? "Unauthorize" : "Authorize"}
              </div>
            </div>
          </button>
      </div> 
    )
  }
}