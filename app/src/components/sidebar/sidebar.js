import { React,useContext  } from "react";
import AppContext from "../../service/appContext";
import "./sidebar.css";
import "../../assets/bootstrap-icons.css";
import { os } from "@neutralinojs/lib"
import AppService from "../../service/appService";

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

  // eslint-disable-next-line no-unused-vars
  async function teste(){
    // await os.showMessageBox('Hello', 'Welcome')

    // let button = await os
    //             .showMessageBox('Confirm',
    //                             'Are you sure you want to quit?',
    //                             'YES_NO', 'QUESTION')
    // if(button === 'YES') {
    //   await os.showNotification('Hello world', 'It works! Have a nice day')
    // }

    // show()
    // await os.showMessageBox('Hora de bater o ponto', 'Não esquece de bater o seu ponto!!!').then(x => {
    //     console.log(x)
    // });
    AppService.getProfileImg()
  }

  // eslint-disable-next-line no-unused-vars
  async function show() {
    try {
        await window.hide();
        await os.showNotification('Hora de bater o ponto', 'Não esquece de bater o seu ponto!!!',"INFO")
      } catch (error) {
        console.error('Error displaying notification:', error)
      }
  }

  function goToCalendar(){
    myContext.setPageSelected('home')
  }


  return (
    <div id="mySidebar" className="sidebar">
      {/* { <p class="profile">
        <img src={".storage/profile.jpg"} alt="profile"></img>
      </p> } */}
      <i onClick={goToCalendar} className={`bi bi-calendar3  ${selectItem("home") ? "activeItem" : ""} `} aria-hidden="true" role="button"/>
      <i onClick={goToConfig} className={`bi bi-gear-fill  ${selectItem("config") ? "activeItem" : ""} `} aria-hidden="true" role="button"/>

      {/* <i onClick={teste} className={`bi bi-gear-fill  ${selectItem("teste") ? "activeItem" : ""} `} aria-hidden="true" role="button"/> */}

      <i onClick={goToLogin} className="bi bi-box-arrow-left exit" aria-hidden="true" role="button"/>
    </div>
  );
}

export default Sidebar;
