"use_strict";

module.exports = io => {
    io.on("connection", client => {

        //console.log("Klijent se konektovao!");
        /*client.on("disconnect", () => {
            //console.log("Klijent se diskonektovao!");

        });*/
        // ZA PITANJA STUDENATA

        client.on("soba", soba => {
            client.join(soba); // treba usere rasporediti po sobama radi komunikacije na istoj anketi
        });

        client.on("pitanjeStudenta", () => {
            io.sockets.emit('pitanjeStudenta');
        });

        client.on("odobravanje", () => {
            io.sockets.emit('odobravanje');
        });

        client.on("odgovor", () => {
            io.sockets.emit('odgovor');
        });
        client.on("zatvori", () => {
            io.sockets.emit('zatvori');
        });

        // ZA REZULTATE
        client.on("odgovoriAnketu", () => {
            io.sockets.emit('odgovoriAnketu');
        });
        client.on("promjenaRez", () => {
            io.sockets.emit('promjenaRez');
        });



    });
};
