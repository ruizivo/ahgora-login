import { React, Component, useState} from "react";

import Sidebar from "../sidebar/sidebar";
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
      <button type="submit"><i class="bi bi-plus-square" /></button>
    </form>
  );
}

const AlarmList = (props) => {

  const addTask = text => {
    const alarm = [...props.alarms, text ]

    props.onAdd(alarm)
  };

  const removeTask = index => {
    const alarm = [...props.alarms];
    alarm.splice(index, 1);
    props.onAdd(alarm)
  };

  return (
    <div className="todo-list">
      <AddTaskForm addTask={addTask} />
      {props.alarms?.map((task, index) => (
        <div className="todo" key={index}>
          <span>
            {task}
          </span>
          <button type="button" onClick={removeTask(index)}><i className="bi bi-trash" /></button>
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

    this.updateAlarms = this.updateAlarms.bind(this)
  }

  async loadAlarmsFromDb() {
    const config = await StorageService.loadConfig()
    this.setState({
      alarms: config.alarms,
    });
  }

  componentDidMount() {
    this.loadAlarmsFromDb() 
  }

  componentWillUnmount(){
  }

  save(alarms){
    const config = {
      alarms: alarms,
    }

    StorageService.saveConfig(config);
  }

  updateAlarms(alarms){
    this.setState({
      alarms: alarms
    })
    this.save(alarms)
  }

  render() {
  return (
    <div className="home">
      <Sidebar />
      <h1>Lembretes: </h1>
      <AlarmList alarms={this.state?.alarms} onAdd={this.updateAlarms}/>
    </div>
  );
  }
}

export default Config;
