import { React,useContext  } from "react";
import AppContext from "../../service/appContext";
import "./sidebar.css";
import "../../assets/bootstrap-icons.css";

function Sidebar() {

  const myContext = useContext(AppContext);

  function selectItem(page){
    return myContext.pageSelected === page? true : false;
  }

  function goToLogin(){
    myContext.setPageSelected('login')
  }
  function goToConfig(){
    myContext.setPageSelected('config')
  }


  function goToCalendar(){
    myContext.setPageSelected('home')
  }


  return (
    <div id="mySidebar" class="sidebar">
      {/* <p class="profile">
        <img src={"profile.jpg"} alt="profile"></img>
      </p> */}
      <i onClick={goToCalendar} className={`bi bi-calendar3  ${selectItem("home") ? "activeItem" : ""} `} />
      <i onClick={goToConfig} className={`bi bi-gear-fill  ${selectItem("config") ? "activeItem" : ""} `} />
      <i onClick={goToLogin} class="bi bi-box-arrow-left exit" />
    </div>
  );
}

export default Sidebar;
