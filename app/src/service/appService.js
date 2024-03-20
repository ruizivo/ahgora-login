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
          this.atualizaPonto().then(resultePonto => {
            console.log("atualizado")
          })
        },
        (error) => {
          console.log(error)
          reject(error)
        }
      )
    })
  },
  batidaNaoComputada: function() {

  },
  espelhoPonto: function(year, month, force=false){
    return new Promise((resolve, reject) => {
      if (force){
        this.espelhoPontoAhgora(year,month).then( 
          result => {
            this.espelhoPontoHistory(year,month).then(result => {
              resolve(result)
            })
          },
          error => {
            reject(false)
          }
        )
      } else {
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
      }
    })
  },
  espelhoPontoAhgora: function (year,month) {
    return new Promise((resolve, reject) => {
      AhgoraService.espelhoPonto(year,month).then(
        (result) => {
            //console.log(new Date().toLocaleTimeString(), "espelhoPonto web")
            localStorage.setItem("mirror", JSON.stringify(result))
            var obj = {
              [year+'-'+month]: {
                dias: result.dias,
                total: result.meses[year+'-'+month]
              },
            }
            StorageService.saveHistory(obj)
            result.isLocal = false
            resolve(result)
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
          if(history[year+'-'+month]){
            history[year+'-'+month].isLocal = true

            let batida = JSON.parse(localStorage.getItem("ponto"))
            
            if(batida && batida.day === getDateString(new Date())){
              console.log(batida)
              console.log(history[year+'-'+month].dias[batida.day])
              
              let batidasHistorico = history[year+'-'+month]?.dias[batida.day]?.batidas.filter(obj => obj.tipo === 'ORIGINAL').length;

              if (batidasHistorico < batida.batidas_dia.length) {
                let horaBatida = batida.batidas_dia[batida.batidas_dia.length -1]
                var obj = {
                  hora: `${horaBatida.substring(0, 2)}:${horaBatida.substring(2, 4)}`,
                  tipo : "registrado"
                }

                history[year+'-'+month]?.dias[batida.day]?.batidas.splice(batida.batidas_dia.length-1, 1, obj);
              }
            }

            resolve(history[year+'-'+month])
          }
          else
            reject()
        })

        function getDateString(date){
          let year = date.getFullYear()
          let month = (date.getMonth()+1).toString().padStart(2, "0")
          let day = date.getDate().toString().padStart(2, "0")
         
          return year+'-'+month+'-'+day
        }
    })

  },
  getProfileImg: function() {
    AhgoraService.getProfileImg()
  }
};

export default AppService;
