import {  React  } from "react";
import CalendarHive from "../calendar/calendar";
import Sidebar from "../sidebar/sidebar";
import "./home.css";

function Home() {

  return (
    <div className="home">
      <Sidebar />
      <CalendarHive />
    </div>
  );
}

export default Home;
