"use strict";

const router = require("express").Router(),
    predavacController = require("../controllers/predavacController"),
    homeController = require("../controllers/homeController");

router.post("/login", predavacController.authenticate);
router.get("/", predavacController.provjeraPredavaca, predavacController.show, homeController.redirectView);
router.post("/predmet/dodaj/:naziv", predavacController.provjeraPredavaca, predavacController.dodajPredmet, homeController.redirectView);
router.get("/predmet/:id", predavacController.provjeraPredavaca, predavacController.showPredmet, homeController.redirectView);
router.post("/predavanje/dodaj/:obj", predavacController.provjeraPredavaca, predavacController.dodajPredavanje, homeController.redirectView);
router.get("/predavanje/:id", predavacController.provjeraPredavaca, predavacController.showPredavanje, homeController.redirectView);
router.post("/pitanje/dodaj", predavacController.provjeraPredavaca, predavacController.dodajPitanje, homeController.redirectView);
router.post("/pitanje/dodaj/fajl", predavacController.provjeraPredavaca, predavacController.dodajPitanjeFajl, homeController.redirectView);
router.delete("/pitanje/izbrisi/:id", predavacController.provjeraPredavaca, predavacController.izbrisiPitanje, homeController.redirectView);

module.exports = router;
