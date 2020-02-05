"use strict";

const router = require("express").Router(),
    homeController = require("../controllers/homeController");

router.get("/", homeController.index, homeController.redirectView);
router.get("/login", homeController.showLogin, homeController.redirectView);
router.get("/logout", homeController.logout, homeController.redirectView);
module.exports = router;
