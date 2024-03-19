import StorageService from "./storageService";

import { filesystem, os, storage } from "@neutralinojs/lib"

const AhgoraService = {
  // testes
  // os.showMessageBox('Welcome', 'Hello Neutralinojs');
  // os.showNotification('Oops :/', 'Something went wrong', 'ERROR');
   

  login: function (user) {
    return new Promise((resolve, reject) => {
      const credential = new URLSearchParams({
        empresa: user.company,
        matricula: user.username, 
        senha: user.password, 
      });

      let comand = `curl -d "${credential}" -X POST https://www.ahgora.com.br/externo/login -i` ;
      //console.log(comand)
      os.execCommand(comand).then((result) => {

        var n = result.stdOut.match(/{(?:[^{}]*|(R))*}|PHPSESSID=\w*;/g) 

        var phpSession = n[0]
        var response = n[1]

        let userDetails = JSON.parse(response);
        if (userDetails.r === "success") {      
          StorageService.saveCredentials(user)

          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          localStorage.setItem("credential", JSON.stringify(user));
          localStorage.setItem("phpSession", JSON.stringify(phpSession));

          let comand = `curl https://www.ahgora.com.br/batidaonline/defaultComputer?c=${user.company}`;
          os.execCommand(comand).then((result) => {
            localStorage.setItem("identity", result.stdOut);
          })


          resolve(userDetails);
        } else {
          reject(userDetails);
        }
      });
    });
  },
  getProfileImg: function () {
    let jwt = JSON.parse(localStorage.getItem("userDetails")).jwt;
    let phpSession = JSON.parse(localStorage.getItem("phpSession"))
    const header = `cookie: qwert-external=${jwt}; ${phpSession}`;
      
    let comand = `curl -H "${header}" https://www.ahgora.com.br/externo/get_image --output .storage/profile.jpg`;
    //console.log(comand)
    os.execCommand(comand).then(() => {

      filesystem.readBinaryFile('.storage/profile.jpg').then( x => {
        var base64String = btoa(String.fromCharCode(...new Uint8Array(x)));
        localStorage.setItem("profileImg", JSON.stringify(base64String));

      })

    })
  },
  espelhoPonto: function (year, month) {
    return new Promise((resolve, reject) => {
      let jwt = JSON.parse(localStorage.getItem("userDetails")).jwt;

      const header = `cookie: qwert-external=${jwt}`;
      let comand = `curl -H "${header}" -X GET https://www.ahgora.com.br/api-espelho/apuracao/${year}-${month}`;

      os.execCommand(comand).then((result) => {
        let mirror = JSON.parse(result.stdOut);
        if (mirror.error) {
          reject(mirror);
        } else {
          resolve(mirror);
        }
      });
    });
  },
  baterPonto: function () {
    return new Promise((resolve) => {

      let user = JSON.parse(localStorage.getItem("credential"));
      const identity = JSON.parse(localStorage.getItem("identity"));
      const credential = new URLSearchParams({
        identity: identity.identity,
        account: user.username,
        password: user.password,
        origin: "pw2",
      });

      let comand = `curl -d "${credential}" -X POST http://www.ahgora.com.br/batidaonline/verifyIdentification`;
      
      os.execCommand(comand).then((result) => {
        let ponto = JSON.parse(result.stdOut);
        if (ponto.result) {
          resolve(ponto);
        } else {
          resolve(null);
        }
      });

    });
  },
};

export default AhgoraService;
