const StorageService = {

    save: function (obj) {
        window.Neutralino.storage.setData('db', JSON.stringify(obj));
    },
    load: function () {
        return new Promise((resolve, reject) => {
            window.Neutralino.storage.getData("db").then(
                result => {
                //console.log(`Data: ${result}`);
                resolve(JSON.parse(result));
            },
            error => {
                const db= {
                    credential: null
                }
                this.save(db)
                resolve(db);
            })
        })
    },
    saveCredentials: function (credential) {
        this.load().then(result =>{
            result.credential = credential;
            this.save(result)
        })
    },
    loadCredentials: function () {
        return new Promise((resolve, reject) => {
            this.load().then(
                result =>{
                    if(result.credential === null){
                        window.Neutralino.storage.getData("userDetails").then((result) => {
                            this.saveCredentials(JSON.parse(result))
                            resolve(JSON.parse(result))
                        }, error =>{
                            reject()
                        });
                    } else {
                        resolve(result.credential)
                    }
                }, error=> {
                    reject()
                })
        })
    },
    saveConfig: function(config){
        this.load().then(result =>{
            result.config = config;
            this.save(result)
        })
    },
    loadConfig: function () {
        return new Promise((resolve, reject) => {
            this.load().then(
                result =>{
                   resolve(result.config)
                }, error=> {
                    reject()
                })
        })
    },
}

export default StorageService;
