import { React, Component, useState, useEffect} from "react";
import AlarmClock from "../alarm-clock/alarm-clock";
import Sidebar from "../sidebar/sidebar";
import Clock from "../clock/clock";
import StorageService from "../../service/storageService";

import "./config.css";

const AddTaskForm = ({ addTask }) => {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    value && addTask(value)
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="time"
        value={value}
        placeholder="Enter a title for this task…"
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit"><i class="bi bi-plus-square"></i></button>
    </form>
  );
}

const AlarmList = (props) => {

  const [alarms, setAlarms] = useState(props.alarms);

  const addTask = text => {
    const alarm = [...alarms, text ]
    setAlarms(alarm)
    props.onAdd(alarm)
  };

  // const toggleTask = index => {
  //   const newTasks = [...tasks];
  //   newTasks[index].isCompleted = !newTasks[index].isCompleted;
  //   setTasks(newTasks);
  // };

  const removeTask = index => {
    const newTasks = [...alarms];
    newTasks.splice(index, 1);
    setAlarms(newTasks);
  };

  return (
    <div className="todo-list">
      <AddTaskForm addTask={addTask} />
      {alarms.map((task, index) => (
        <div className="todo">
          <span>
            {task}
          </span>
          <button onClick={() => removeTask(index)}><i class="bi bi-trash"></i></button>
        </div>
      ))}
    </div>
  );
}

class Config extends Component {
  constructor() {
    super();
    
    this.state = {
      alarms: [],
      enabled: true,
    };


    this.loadAlarmsFromDb() 
    this.updateAlarms = this.updateAlarms.bind(this)
  }

  loadAlarmsFromDb() {
    StorageService.loadConfig().then((config) => {
      this.setState({
        alarms: config.alarms,
      });
    });
  }

  componentWillUnmount(){
    this.save()
  }

  save(){
    console.log(this.state.alarms)
    StorageService.saveConfig(this.state);
  }

  updateAlarms(alarms){
    this.setState({
      alarms: alarms
    })
  }

  render() {
  return (
    <div className="home">
      <Sidebar />
      <h1>tela config</h1>
      <Clock />
      <AlarmList alarms={this.state.alarms} onAdd={this.updateAlarms}/>
    </div>
  );
  }
}

export default Config;
