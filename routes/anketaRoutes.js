"use strict";

const router = require("express").Router(),
    anketaController = require("../controllers/anketaController"),
    predavacController = require("../controllers/predavacController"),
    homeController = require("../controllers/homeController");
router.get("/:sifra/rezultati", anketaController.provjeriSifru, anketaController.pokaziRezultate, homeController.redirectView);
router.get("/:sifra", anketaController.provjeriSifru, anketaController.pristupiAnketi, homeController.redirectView);
router.post("/pokreni", predavacController.provjeraPredavaca, anketaController.pokreniAnketu, homeController.redirectView);
router.post("/zatvori", predavacController.provjeraPredavaca, anketaController.zatvoriAnketu, homeController.redirectView);
router.post("/iducePitanje", predavacController.provjeraPredavaca, anketaController.iducePitanje, homeController.redirectView);
router.post("/dodajOdgovorStudenta", anketaController.provjeriStudenta, anketaController.dodajOdgovor, homeController.redirectView);
module.exports = router;
