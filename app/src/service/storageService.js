import { storage } from "@neutralinojs/lib"

const StorageService = {

    save: function (obj) {
        storage.setData('db', JSON.stringify(obj));
    },
    load: function () {
        return new Promise((resolve, reject) => {
            storage.getData("db").then(
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
                        storage.getData("userDetails").then((result) => {
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
                    if(result.config === undefined || ( result.config !== undefined && result.config.alarms === undefined)){
                        const alarms = JSON.parse(`{"alarms":["08:00","12:00","13:00","17:00"]}`)
                        this.saveConfig(alarms)
                    }
                    resolve(result.config)
                }, error=> {
                    reject()
                })
        })
    },
    saveHistory: function(history){
        this.load().then(result =>{
            let merged = {...result.history, ...history};
            result.history = this.sortObject(merged);
            this.save(result)
        })
    },
    sortObject: function(obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    },
    loadHistory: function () {
        return new Promise((resolve, reject) => {
            this.load().then(
                result =>{
                    resolve(result.history)
                }, error=> {
                    reject()
                })
        })
    },
}

export default StorageService;
