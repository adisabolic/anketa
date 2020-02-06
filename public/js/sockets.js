const socket = io();

$("#dodajPitanje").on("click", () => {
    socket.emit("pitanjeStudenta");
    return false;
});
$("#odobri").on("click", () => {
    socket.emit("odobravanje");
    return false;
});
$("#odgovori").on("click", () => {
    socket.emit("odgovor");
});
$("#zatvori").on("click", () => {
    socket.emit("zatvori");
});
$("#odgovoriAnketu").on("click", () => {
    socket.emit("odgovoriAnketu");
    return false;
});
$("#rezultatiSvi").on("change", () => {
    socket.emit("promjenaRez");
    return false;
});
socket.on('pitanjeStudenta', function () {
    location.reload();
});
socket.on('odobravanje', function () {
    location.reload();
});
socket.on('odgovor', function () {
    setTimeout(() => {location.reload();}, 500 );
});
socket.on('zatvori', function () {
    location.reload();
});
socket.on('odgovoriAnketu', function () {
    location.reload();
});
socket.on('promjenaRez', function () {
    location.reload();
});
