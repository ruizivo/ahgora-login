import StorageService from "./storageService";

const AhgoraService = {
  // testes
  // window.Neutralino.os.showMessageBox('Welcome', 'Hello Neutralinojs');
  // window.Neutralino.os.showNotification('Oops :/', 'Something went wrong', 'ERROR');

  login: function (user) {
    return new Promise((resolve, reject) => {
      const credential = new URLSearchParams({
        empresa: user.company,
        matricula: user.username,
        senha: user.password,
      });

      const comand = `curl -d "${credential}" -X POST https://www.ahgora.com.br/externo/login`;

      window.Neutralino.os.execCommand(comand).then((result) => {
        const userDetails = JSON.parse(result.stdOut);
        if (userDetails.r === "success") {
          StorageService.saveCredentials(user);

          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          localStorage.setItem("credential", JSON.stringify(user));

          const comand = `curl https://www.ahgora.com.br/batidaonline/defaultComputer?c=${user.company}`;
          window.Neutralino.os.execCommand(comand).then((result) => {
            localStorage.setItem("identity", result.stdOut);
          });

          resolve(userDetails);
        } else {
          reject(userDetails);
        }
      });
    });
  },
  getProfileImg: function () {
    const jwt = JSON.parse(localStorage.getItem("userDetails")).jwt;
    const profileImg = JSON.parse(
      localStorage.getItem("userDetails")
    ).employee_id;
    const header = `cookie: qwert-external=${jwt}`;

    const comand = `curl -H "${header}" https://www.ahgora.com.br/externo/get_image/${profileImg} --output profile.jpg`;
    console.log(comand);
    window.Neutralino.os.execCommand(comand);
  },
  espelhoPonto: function (year, month) {
    console.log(new Date(), "espelhoPonto:");
    const today = new Date();
    const mirroDate = new Date(year, parseInt(month) - 1, 1);

    return new Promise((resolve, reject) => {
      const jwt = JSON.parse(localStorage.getItem("userDetails")).jwt;

      const header = `cookie: qwert-external=${jwt}`;
      const comand = `curl -H "${header}" -X GET https://www.ahgora.com.br/api-espelho/apuracao/${year}-${month}`;

      window.Neutralino.os.execCommand(comand).then((result) => {
        const mirror = JSON.parse(result.stdOut);
        console.log(mirror);
        if (mirror.error) {
          reject(mirror);
        } else {
          localStorage.setItem("mirror", JSON.stringify(mirror));
          resolve(mirror);

          const obj = {
            historico: {
              referencia: {
                [year + "-" + month]: {
                  dias: mirror.dias,
                  total: mirror.meses[year + "-" + month],
                },
              },
            },
          };

          if (mirroDate.getMonth() < today.getMonth()) {
            window.Neutralino.storage.setData("history", JSON.stringify(obj));
          }
        }
      });
    });
  },
  baterPonto: function () {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem("credential"));
      const identity = JSON.parse(localStorage.getItem("identity"));
      const credential = new URLSearchParams({
        identity: identity.identity,
        account: user.username,
        password: user.password,
        origin: "pw2",
      });

      const comand = `curl -d "${credential}" -X POST http://www.ahgora.com.br/batidaonline/verifyIdentification`;

      window.Neutralino.os.execCommand(comand).then((result) => {
        const ponto = JSON.parse(result.stdOut);
        console.log(ponto);
        if (ponto.result) {
          localStorage.setItem("ponto", JSON.stringify(ponto));
          resolve(true);
        } else {
          resolve(false);
        }
      });

      // para testes
      // AhgoraService.espelhoPonto("2022","05").then(
      //   (result) => {
      //     resolve(true)
      //   },
      //   (error) => {
      //     reject(false);
      //   }
      // );
    });
  },
};

export default AhgoraService;
