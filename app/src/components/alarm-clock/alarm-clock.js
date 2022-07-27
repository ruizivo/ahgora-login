import { Component } from 'react'

import StorageService from '../../service/storageService'

class AlarmClock extends Component {
  constructor () {
    super()
    // window.Neutralino.computer.getMemoryInfo();

    this.state = {
      currentTime: '',
      alarms: []
    }
    this.loadAlarmsFromDb()
    this.setAlarmTime = this.setAlarmTime.bind(this)
  }

  async loadAlarmsFromDb () {
    const config = await StorageService.loadConfig()
    this.setState({
      alarms: config.alarms
    })
  }

  setAlarmTime (event) {
    event.preventDefault()
    const inputAlarmTimeModified = event.target.value + ':00'
    this.setState({
      alarms: [...this.state.alarms, inputAlarmTimeModified]
    })
  }

  checkAlarmClock () {
    this.loadAlarmsFromDb()
    this.state.alarms.forEach((alarm) => {
      if (this.state.currentTime === alarm + ':00') {
        console.log('alarme aki!')
        window.Neutralino.os.showNotification(
          'Não esqueça de bater o seu ponto',
          'Descanço merecido, não esquece de bater o ponto',
          'INFO'
        )
      }
    })
  }

  componentDidMount () {
    this.clock = setInterval(() => this.setCurrentTime(), 1000)
    this.interval = setInterval(() => this.checkAlarmClock(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.clock)
    clearInterval(this.interval)
  }

  setCurrentTime () {
    this.setState({
      currentTime: new Date().toLocaleTimeString('en-US', { hour12: false })
    })
  }

  render () {
    // (
    //   <div>
    //     <h2>It is {this.state.currentTime}.</h2>
    //     <form>
    //       <input type="time" onChange={this.setAlarmTime}></input>
    //     </form>
    //   </div>
    // );
  }
}

export default AlarmClock
