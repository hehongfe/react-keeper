import React from 'react'
import InnerRouter from './InnerRouter'
import HistoryControl, {
  listener as historyControlListener,
  setHistory as historyControlSet
} from './HistoryControl'
import CacheOfLinkControl from './CacheOfLinkControl'
import Logger from './Logger'

export default class Router extends React.Component {
  constructor(...args) {
    super(...args)

    Object.defineProperty(this.props.history, 'location', {
      get: ()=>{
        return this.props.history.getCurrentLocation()
      }
    })

    historyControlSet(this.props.history)
    historyControlListener(this.props.history.getCurrentLocation())

    /** start history listener */
    this.unlisten = this.props.history.listen((location, action)=>{

      historyControlListener(location, action)
      CacheOfLinkControl.onHistoryChanged(location)
      this.forceUpdate()
    })
  }

  getChildContext() {
    return {
      history: this.props.history
    }
  }

  /** react-hot-loader will unmount this component and */
  componentWillReceiveProps(nextProps) {
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    let { ...props } = this.props
    return (
      <InnerRouter
        location={ this.props.history.getCurrentLocation() }
        action={ this.props.history.action }
        { ...props } />
    )
  }
}

Router.childContextTypes = {
  history: React.PropTypes.any
}
