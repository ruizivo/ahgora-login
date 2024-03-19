//import { app, os, updater } from "@neutralinojs/lib"
import AhgoraService from "./ahgoraService"
import StorageService from "./storageService";

const AppService = {
  baterPonto: function () {
    return new Promise((resolve, reject) => {
      AhgoraService.baterPonto().then(
        (result) => {
          console.log("Ponto batido con sucesso!")
          console.log(result);
          localStorage.setItem("ponto", JSON.stringify(result))
          resolve(result)
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },
  espelhoPonto: function(year, month){
    return new Promise((resolve, reject) => {
      AhgoraService.espelhoPonto(year,month).then(
        (result) => {
            console.log("espelho de ponto:")
            localStorage.setItem("mirror", JSON.stringify(result))
            resolve(result)

            
            var obj = {
              [year+'-'+month]: {
                dias: result.dias,
                total: result.meses[year+'-'+month]
              },
            }
            StorageService.saveHistory(obj)

          },
          (error) => {
            console.log(error)
            reject(false)
          }
        )
    })
  },
  getProfileImg: function() {
    AhgoraService.getProfileImg()
  }
};

export default AppService;
