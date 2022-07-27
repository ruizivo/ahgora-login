import StorageService from '../service/storageService'

// eslint-disable-next-line no-unused-vars
let clock
let currentTime
let alarms

export function init () {
  clock = setInterval(() => setCurrentTime(), 1000)
}

async function loadAlarmsFromDb () {
  const config = await StorageService.loadConfig()
  alarms = config.alarms
}

function setCurrentTime () {
  currentTime = new Date().toLocaleTimeString('en-US', { hour12: false })
  checkAlarmClock()
}

function checkAlarmClock () {
  loadAlarmsFromDb()
  alarms?.forEach((alarm) => {
    if (currentTime === alarm + ':00') {
      window.Neutralino.os.showNotification(
        'Hora de bater o ponto',
        'Não esquece de bater o seu ponto!!!',
        'INFO'
      )
    }
  })
}
