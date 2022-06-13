import StorageService from "../service/storageService";


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
      console.log("alarme aki!");
      window.Neutralino.os.showNotification(
        "Não esqueça de bater o seu ponto",
        "Descanço merecido, não esquece de bater o ponto",
        "INFO"
      );
    }
  });
}
