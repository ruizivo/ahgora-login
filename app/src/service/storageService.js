/* eslint-disable no-undef */
const StorageService = {

    save: function (obj) {


        Neutralino.storage.getData("db").then((result) => {
            //console.log(`Data: ${result}`);


        });


    },
    load: function () {
        Neutralino.storage.getData("db").then((result) => {
            //console.log(`Data: ${result}`);
        });
    }
}

export default StorageService;
