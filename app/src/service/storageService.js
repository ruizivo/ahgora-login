const StorageService = {

    save: function (obj) {

        
        window.Neutralino.storage.getData("db").then((result) => {
            //console.log(`Data: ${result}`);


        });


    },
    load: function () {
        window.Neutralino.storage.getData("db").then((result) => {
            //console.log(`Data: ${result}`);
        });
    }
}

export default StorageService;
