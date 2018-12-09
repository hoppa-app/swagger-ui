import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"


export default class HoppaOperationsContent extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: ""
  }

  static propTypes = {
    tagObj: ImPropTypes.map.isRequired,
    tag: PropTypes.string.isRequired,

    children: PropTypes.element,

    getComponent: PropTypes.func.isRequired
  }

  render() {
    const {
      tag,
      tagObj,
      children,
      getComponent,
    } = this.props

    const Markdown = getComponent("Markdown")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)

    let tagLowerCase = tag.toLowerCase();

    const handleDisplay = {
      display: "none"
    }

    if(this.props.current == tagLowerCase) {
      return (
        <div className="md-tab" id={ "tab-content-" + tagLowerCase }>
          <Markdown source={tagDescription} /><br />
          {children}
        </div>
      )
    } else {
      return (
        <div className="md-tab" id={ "tab-content-" + tagLowerCase } style={handleDisplay}>
          <Markdown source={tagDescription} /><br />
          {children}
        </div>
      )
    }
  }
}
