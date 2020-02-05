"use strict";

const router = require("express").Router(),
    studentController = require("../controllers/studentController"),
    predavacController = require("../controllers/predavacController"),
    pitanjaStudenataController = require("../controllers/pitanjaStudenataController"),
    homeController = require("../controllers/homeController");

router.get("/", pitanjaStudenataController.provjera, pitanjaStudenataController.index);
router.get("/:id", pitanjaStudenataController.provjera, pitanjaStudenataController.show, homeController.redirectView);
router.post("/:id/dodaj", studentController.provjeraStudenta, pitanjaStudenataController.dodajPitanje, homeController.redirectView);
router.post("/:id/odobri", studentController.provjeraStudenta, pitanjaStudenataController.odobri, homeController.redirectView);

router.post("/:id/odgovori", predavacController.provjeraPredavaca, pitanjaStudenataController.odgovori, homeController.redirectView);
router.post("/:id/zatvori", predavacController.provjeraPredavaca, pitanjaStudenataController.zatvori, homeController.redirectView);

module.exports = router;
