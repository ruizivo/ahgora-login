import {  Component, React  } from "react";
import CalendarHive from "../calendar/calendar";
import Sidebar from "../sidebar/sidebar";
import "./home.css";

class Home extends Component {

  render(){
    return (
      <div className="home">
        <Sidebar />
        <CalendarHive />
      </div>
    );
  }
}

export default Home;
