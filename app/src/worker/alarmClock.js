// eslint-disable-next-line no-unused-vars
import StorageService from "../service/storageService";
import { os } from "@neutralinojs/lib"

let clock;
let currentTime;
let alarms;

export function init(){
    clock = setInterval(() => setCurrentTime(), 1000);
}

async function loadAlarmsFromDb() {
  const config = await StorageService.loadConfig();
  alarms = config.alarms;
}

function setCurrentTime() {
  currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
  checkAlarmClock()
}

function checkAlarmClock() {
  loadAlarmsFromDb();
  alarms?.forEach((alarm) => {
    if (currentTime === alarm + ":00") {
      show()    
    }
  });
}

async function show() {
  try {
      await os.showMessageBox('Hora de bater o ponto', 'Não esquece de bater o seu ponto!!!');
      await os.showNotification('Hora de bater o ponto', 'Não esquece de bater o seu ponto!!!',"INFO")
    } catch (error) {
      console.error('Error displaying notification:', error)
    }
}
