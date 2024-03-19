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
          this.atualizaPonto().then(result => {
            resolve(result)
          })
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
      this.espelhoPontoHistory(year,month).then(
        result => {
          console.log(new Date().toLocaleTimeString(), "espelhoPonto local")
          resolve(result)
        },
        error => {
          this.espelhoPontoAhgora(year,month).then( 
            result => {
              resolve(result)
            },
            error => {
              reject(false)
            }
          )
        }
      )
    })
  },
  espelhoPontoAhgora: function (year,month) {
    return new Promise((resolve, reject) => {
      AhgoraService.espelhoPonto(year,month).then(
        (result) => {
            //console.log(new Date().toLocaleTimeString(), "espelhoPonto web")
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
  atualizaPonto: function() {
    let today = new Date();
    let ano = today.getFullYear()
    let mes = String(today.getMonth() + 1).padStart(2, "0")

    return new Promise ((resolve, reject) => {
      this.espelhoPontoAhgora(ano,mes).then(
        result => {
          //console.log("atualizaPonto: ponto atualizado")
          resolve(result)
        }, error => {
          //console.log("atualizaPonto: erro")
          reject(error)
        }
        )
    })
    

  },
  espelhoPontoHistory: function(year, month) { 
    return new Promise((resolve, reject) => {
      StorageService.loadHistory().then(
        history => {
          if(history[year+'-'+month])
           resolve(history[year+'-'+month])
          else
            reject()
        })
    })

  },
  getProfileImg: function() {
    AhgoraService.getProfileImg()
  }
};

export default AppService;
