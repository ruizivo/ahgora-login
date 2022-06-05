import { Component } from "react";
import StorageService from "../../service/storageService";

class AlarmClock extends Component {
  constructor() {
    super();
    //window.Neutralino.computer.getMemoryInfo();

    this.state = {
      currentTime: "",
      tasks: [],
    };
    this.loadAlarmsFromDb()
    this.setAlarmTime = this.setAlarmTime.bind(this);
  }

  loadAlarmsFromDb() {
    StorageService.loadConfig().then((config) => {
      this.setState({
        tasks: config.alarms,
      });
    });
  }

  setAlarmTime(event) {
    event.preventDefault();
    const inputAlarmTimeModified = event.target.value + ":00";
    this.setState({
      tasks: [...this.state.tasks, inputAlarmTimeModified],
    });
  }

  checkAlarmClock() {
    this.state.tasks.forEach((task) => {
      if (this.state.currentTime === task + ":00") {
        console.log("alarme aki!");
        window.Neutralino.os.showNotification(
          "Não esqueça de bater o seu ponto",
          "Descanço merecido, não esquece de bater o ponto",
          "INFO"
        );
      }
    });
  }

  componentDidMount() {
    this.clock = setInterval(() => this.setCurrentTime(), 1000);
    this.interval = setInterval(() => this.checkAlarmClock(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clock);
    clearInterval(this.interval);
  }

  setCurrentTime() {
    this.setState({
      currentTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
    });
  }

  render() {
    return; //(
    //   <div>
    //     <h2>It is {this.state.currentTime}.</h2>
    //     <form>
    //       <input type="time" onChange={this.setAlarmTime}></input>
    //     </form>
    //   </div>
    //);
  }
}

export default AlarmClock;
