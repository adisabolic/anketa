"use strict";

const Student = require("../models/student"),
    OdgovorStudenta = require("../models/OdgovorStudenta"),
    Predavanje = require("../models/predavanje"),
    Predmet = require("../models/predmet"),
    Pitanje = require("../models/pitanje"),
    passport = require("passport");

module.exports = {
    provjeraStudenta: (req, res, next) => {
        if(!req.user) {
            req.flash("error", `Molimo da se prijavite prije pristupa ovoj ruti!`);
            res.redirect("/login");
        }
        else if(req.user.predavac) {
            req.flash("error", `Nije vam dozvoljena ova ruta kao predavaču!`);
            res.redirect("/predavac");
        }
        else
            next();
    },
    authenticate: passport.authenticate("studentLocal", {
        failureRedirect: "/login",
        failureFlash: "Failed to login. Wrong email or password!",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    show: (req, res, next) => {
        res.render("student/index", {
            title: "Student" + " - " + `${req.user.ime} ${req.user.prezime}`,
        });
    },
    prikaziOdgovore: (req, res, next) => {
        var id = req.user._id;

        OdgovorStudenta.find({student: id}).populate("pitanje").then((o) => {
            console.log(o);
            return o;
        }).then((o) => {
            o.forEach((odg) => {
                odg.odgStudenta = odg.odgovori;
                odg.pitanje_odgovori = odg.pitanje.odgovori;
            });
            return o;
        }).then((o) => {
            res.render("student/historija_odgovora", {
                sviOdgovori: o,
                title: "Historija odgovora"
            });
        }).catch(error => {
            console.log(`Greska pri prikazu historije odgovora: ${error.message}`);
            req.flash("error", `Greška pri prikazu historije odgovora.`);
            res.locals.redirect = "/student";
            next();
        });
    }
};
