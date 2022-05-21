import { React, useState} from "react";
import Clock from "../clock/clock";
import Sidebar from "../sidebar/sidebar";

import "./config.css";


function Config() {

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

  const ToDoList = () => {

    const [tasks, setTasks] = useState([{
        text: "Like",
        isCompleted: false
      },{
        text: "Comment",
        isCompleted: false
      },{
        text: "Subscribe",
        isCompleted: false
      }]);
  
    const addTask = text => setTasks([...tasks, { text }]);
  
    const toggleTask = index => {
      const newTasks = [...tasks];
      newTasks[index].isCompleted = !newTasks[index].isCompleted;
      setTasks(newTasks);
    };
  
    const removeTask = index => {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    };
  
    return (
      <div className="todo-list">
        {tasks.map((task, index) => (
          <div className="todo">
            <span onClick={() => toggleTask(index)} className={task.isCompleted ? "todo-text todo-completed" : "todo-text"}>
              {task.text}
            </span>
            <button onClick={() => removeTask(index)}><i class="bi bi-trash"></i></button>
          </div>
        ))}
        <AddTaskForm addTask={addTask} />
      </div>
    );
  }



  return (
    <div className="home">
      <Sidebar />
      <h1>tela config</h1>
      <Clock/>
      <ToDoList />
    </div>
  );
}

export default Config;
