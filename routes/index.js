"use strict";

const router = require("express").Router(),
    studentRoutes = require("./studentRoutes"),
    profesorRoutes = require("./predavacRoutes"),
    anketaRoutes = require("./anketaRoutes"),
    pitanjaStudenataRoutes = require("./pitanjaStudenataRoutes"),
    homeRoutes = require("./homeRoutes"),
    errorRoutes = require("./errorRoutes");

router.use("/student", studentRoutes);
router.use("/predavac", profesorRoutes);
router.use("/anketa", anketaRoutes);
router.use("/pitanjaStudenata", pitanjaStudenataRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
