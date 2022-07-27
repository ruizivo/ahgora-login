import { React, Component } from 'react'

import './clock.css'

class Clock extends Component {
  constructor () {
    super()
    this.state = {
      clock: new Date()
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({
        clock: new Date()
      })
    }, 1000)
  }

  render () {
    return <div>{this.state.clock.toLocaleString()}</div>
  }
}

export default Clock
