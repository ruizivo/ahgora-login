import { app, os, updater } from "@neutralinojs/lib"

const UpdaterService = {

    getUrlManifest: function () {

      return new Promise((resolve, reject) => {
        let comand = `curl POST https://api.github.com/repos/ruizivo/ahgora-login/releases`;
        os.execCommand(comand).then((result) => {
            let repo = JSON.parse(result.stdOut);
            if (repo !== null) {
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
      return new Promise((resolve, reject) => {
        try {
              updater.checkForUpdates("https://ruizivo.github.io/ahgora-login/manifest.json").then( manifest => {
                console.log(manifest)
                // eslint-disable-next-line no-undef
                if(NL_APPVERSION !== '0.0.0' && manifest.version !== NL_APPVERSION) {
                  resolve(true);
                }else {
                  resolve(false);
                }

              });
        }
        catch(err) {
          console.log(err)
          reject(err);
        }
      });
    },
    performUpdate: function() {
      return new Promise((resolve, reject) => {
        try{
          let comand = `curl https://ruizivo.github.io/ahgora-login/resources.neu --output resources.neu`;
          os.execCommand(comand).then(async (result) => { 
            setTimeout(function(){
              app.restartProcess();
            }, 2000);
            resolve(true)
          });
        }
        catch(err) {
          reject(err)
        }
        

      });
    }
    
}

export default UpdaterService;
