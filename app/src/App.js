import { useState, React, useEffect} from "react";
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';

import Login from "./components/login/login";
import Home from "./components/home/home";
import AppContext from "./service/appContext";
import Loading from "./components/loading/loading";
import UpdateService from './service/updaterService';
import AhgoraService from "./service/ahgoraService";
import Config from "./components/config/config";
import StorageService from "./service/storageService";

import "./App.css";

const createAlarmWorker = createWorkerFactory(() => import('./worker/alarmClock'));

function App() {

  const [pageSelected, setPageSelected] = useState(null);
  const userSettings = {
    pageSelected,
    setPageSelected,
  };
  const alarmClockWorker = useWorker(createAlarmWorker);

  document.addEventListener("contextmenu", function (e){
      e.preventDefault();
  }, false);


  useEffect(() => {
    if(pageSelected == null){
      init();
      (async () => {
        
        alarmClockWorker.init();
        
      })();
    }
  });

  function init() {
    try {
      UpdateService.checkUpdate().then(result => {
        if(result){
          setPageSelected('update');
          UpdateService.performUpdate();
        } else {
          // eslint-disable-next-line no-undef
          StorageService.loadCredentials().then(result => {
            AhgoraService.login(result)
            setPageSelected('home');
          }, error =>{
            setPageSelected('login');
          })
        }
      })
      
      
    } catch (error) {
      setPageSelected('login');
    }
  }


  function ShowPage() {


      if (pageSelected=== 'login') {
        return <Login />
      }  
      if (pageSelected === 'home') {
        return <Home />
      } 
      if (pageSelected === 'config') {
        return <Config />
      } 
      if (pageSelected === 'update') {
        return (
          <div>
          <div className="App">
          <header className="App-header">
          <h1>Atualizando para uma nova versão!</h1>
          <Loading/>
          </header>
          </div>
        </div>
        )
      } 
      if (pageSelected === null) {
        return (
          <div>
            <div className="App">
            <header className="App-header">
              <Loading/>
            </header>
            </div>
          </div>
          );
      }
    
  }
 

  return (
    <AppContext.Provider value={userSettings}>
      <ShowPage />
    </AppContext.Provider >
  );
}

export default App;
