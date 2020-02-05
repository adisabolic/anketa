"use strict";

const router = require("express").Router(),
    studentController = require("../controllers/studentController"),
    homeController = require("../controllers/homeController");

router.post("/login", studentController.authenticate);
router.get("/", studentController.provjeraStudenta, studentController.show, homeController.redirectView);
router.get("/odgovori", studentController.provjeraStudenta, studentController.prikaziOdgovore, homeController.redirectView);
module.exports = router;
