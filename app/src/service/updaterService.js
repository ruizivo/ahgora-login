const UpdaterService = {

    getUrlManifest: function () {

      return new Promise((resolve, reject) => {
        let comand = `curl POST https://api.github.com/repos/ruizivo/ahgora-login/releases`;
        window.Neutralino.os.execCommand(comand).then((result) => {
            let repo = JSON.parse(result.stdOut);
            if (repo != null) {
              let url = 'https://github.com/ruizivo/ahgora-login/releases/download/%name%/manifest.json';
              url = url.replace('%name%',repo[0].name);
              resolve(url);
            } else {
              reject(null);
            }
          });
        });
    },
    checkUpdate: function(){
      try {
          window.Neutralino.updater.checkForUpdates("https://ruizivo.github.io/ahgora-login/manifest.json").then( manifest => {
            console.log(manifest)
            // eslint-disable-next-line no-undef
            if(NL_APPVERSION !== '0.0.0' && manifest.version !== NL_APPVERSION) {
              console.log('entrou na atualização')
              window.Neutralino.os.showNotification('Nova Versão encontrada', 'atualizando...', 'INFO');
              let comand = `curl https://ruizivo.github.io/ahgora-login/resources.neu --output resources.neu`;
              window.Neutralino.os.execCommand(comand).then(async (result) => { 
                setTimeout(function(){
                  window.Neutralino.app.restartProcess();
                }, 2000);
              });
              //await window.Neutralino.updater.install();
              //await window.Neutralino.app.restartProcess();
              
            }

          });
        //})
      }
      catch(err) {
        console.log(err)
      }
    }
    
}

export default UpdaterService;
