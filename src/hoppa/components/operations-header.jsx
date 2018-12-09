import React from "react"
import PropTypes from "prop-types"

export default class HoppaOperationsHeader extends React.Component {

  static defaultProps = {
    tag: "",
  }

  static propTypes = {
    tag: PropTypes.string.isRequired
  }

  selectTab = (tagLowerCase) => {
    this.props.hanldleTab(tagLowerCase)
  }

  render() {
    const {
      tag,
    } = this.props

    let tagLowerCase = tag.toLowerCase();
    return (
      <button id={ "tab-button-" + tagLowerCase } type="button" className={this.props.current == tagLowerCase ? "md-button md-theme-default md-active" : "md-button md-theme-default"} onClick={ () => this.selectTab(tagLowerCase) }>
        <div className="md-ripple">
          <div className="md-button-content">
            {tag}
          </div>
        </div>
      </button>
    )
  }
}
