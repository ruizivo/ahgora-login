const AhgoraService = {
  // testes
  // window.Neutralino.os.showMessageBox('Welcome', 'Hello Neutralinojs');
  // window.Neutralino.storage.setData("userDetails", JSON.stringify(user));
  // window.Neutralino.storage.getData("userDetails").then((result) => {
  //   console.log(`Data: ${result}`);
  // });


  login: function (user) {
    // console.log(inputs);
    // // window.Neutralino.os.showMessageBox('Welcome', 'Hello Neutralinojs');
    // window.Neutralino.storage.setData("userDetails", JSON.stringify(inputs));

    // window.Neutralino.storage.getData("userDetails").then((result) => {
    //   console.log(`Data: ${result}`);
    // });


    return new Promise( (resolve, reject) => {

      const credential = new URLSearchParams({
        empresa: "a839277",
        matricula: user.user, //"0170",
        senha: user.pass, // "Hive@147258",
      });
  
      let comand = `curl -d "${credential}" -X POST https://www.ahgora.com.br/externo/login`
  
      window.Neutralino.os.execCommand(comand)
      .then(
        (result) => {
          let userDetails = JSON.parse(result.stdOut)
          if(userDetails.r ==='success'){
            localStorage.setItem('userDetails',JSON.stringify(userDetails))
            resolve(userDetails)
          } else {
            reject(userDetails)
          }
        }
      );
      
     });


  },
  espelhoPonto: function(year, month) {
    let jwt = JSON.parse(localStorage.getItem('userDetails')).jwt

    const header = `cookie: qwert-external=${jwt}`
    let comand = `curl -H "${header}" -X GET https://www.ahgora.com.br/api-espelho/apuracao/${year}-${month}`

    window.Neutralino.os.execCommand(comand)
    .then((result) => {
      let mirror = JSON.parse(result.stdOut)
      console.log(JSON.parse(result.stdOut));
      
      localStorage.setItem('mirror',JSON.stringify(mirror))
    });

  },
  baterPonto: function (user) {
    const credential = new URLSearchParams({
      identity: "ee9401ced1c547eea2aae4655d911e3b",
      account: user.user,
      password: user.pass,
      origin: "pw2"
    });

    let comand = `curl -d "${credential}" -X POST http://www.ahgora.com.br/batidaonline/verifyIdentification`

    window.Neutralino.os.execCommand(comand)
    .then((result) => {
      console.log(JSON.parse(result.stdOut));
    });

  },
};

export default AhgoraService;
