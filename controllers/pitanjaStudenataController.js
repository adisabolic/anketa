"use strict";

const Student = require("../models/student"),
    PitanjeStudenta = require("../models/PitanjeStudenta"),
    Predavanje = require("../models/predavanje"),
    passport = require("passport");

module.exports = {
    provjera: (req, res, next) => {
        if(!req.user) {
            req.flash("error", `Molimo da se prijavite prije pristupa ovoj ruti!`);
            res.redirect("/login");
        }
        else
            next();
    },
    index: (req, res, next) => {
        Predavanje.find({}).populate("predmet").then(p => {
            res.render("student/svaPredavanja", {
                predavanja: p,
                title: "Pitanja za predavanja"
            })
        }).catch(error => {
            console.log(`Greška pri učitavanju predavanja: ${error.message}`);
            req.flash("error", `Greška pri učitavanju predavanja.`);
            res.locals.redirect = "back";
            next();
        });
    },
    show: (req, res, next) => {
        Predavanje.findById(req.params.id).populate("predmet").then(pred => {
            PitanjeStudenta.find({predavanje: req.params.id, zavrseno: false}).sort({odobravanja: -1}).then(p => {
                var njegovo_predavanje = (req.user._id == pred.predmet.predavac);
                res.render("student/pitanja_za_predavanje", {
                    id_predavanja: req.params.id,
                    pitanja: p,
                    title: "Pitanja za predavanje" + " - " + pred.naziv,
                    predavac: req.user.predavac,
                    njegovo_predavanje: njegovo_predavanje
                });
            })
        }).catch(error => {
            console.log(`Greška pri prikazu pitanja: ${error.message}`);
            req.flash("error", `Greška pri prikazu pitanja.`);
            if(!req.user.predavac)
                res.locals.redirect = "/student";
            else
                res.locals.redirect = "/predavac";
            next();
        });
    },
    dodajPitanje: (req, res, next) => {
        var id_predavanja = req.params.id;
        var pitanje = req.body.pitanje;
        PitanjeStudenta.create({pitanje: pitanje, predavanje: id_predavanja}).then(() => {
            res.sendStatus(200);
        }).catch(error => {
            console.log(`Greška pri dodavanju pitanja: ${error.message}`);
            req.flash("error", `Greška pri dodavanju pitanja.`);
            res.locals.redirect = "/student";
            next();
        });
    },
    odobri: (req, res, next) => {
        var id_predavanja = req.params.id;
        var id_pitanja = req.body.id_pitanja;
        var id_studenta = req.user._id;
        PitanjeStudenta.findById(id_pitanja).then(p => {
            if(p.studenti_odobrili.includes(id_studenta)) {
                req.flash("error", `Već ste odobrili ovo pitanje!`);
                res.locals.redirect = "back";
                next();
            }
            else {
                p.odobravanja += 1;
                p.studenti_odobrili.push(id_studenta);
                p.save();
                res.sendStatus(200);
            }
        }).catch(error => {
            console.log(`Greška pri odobravanju pitanja: ${error.message}`);
            req.flash("error", `Greška pri odobravanju pitanja.`);
            res.locals.redirect = "back";
            next();
        });
    },
    odgovori: (req, res, next) => {
        var id_predavanja = req.params.id;
        var id_pitanja = req.body.id_pitanja;
        var odgovor = req.body.odgovor;
        Predavanje.findById(id_predavanja).populate("predmet").then(p => {
            if(p.predmet.predavac != req.user._id) {
                req.flash("error", "Nemate pristup ovoj ruti!");
                res.locals.rediret = "back";
                next();
            } else {
                PitanjeStudenta.findById(id_pitanja).then(p => {
                    p.odgovor = odgovor;
                    p.save();
                    res.sendStatus(200);
                }).catch(error => {
                    console.log(`Greška pri odgovaranju pitanja: ${error.message}`);
                    req.flash("error", `Greška pri odgovaranju pitanja.`);
                    res.locals.redirect = "back";
                    next();
                });
            }
        });
    },
    zatvori: (req, res, next) => {
        var id_predavanja = req.params.id;
        var id_pitanja = req.body.id_pitanja;
        Predavanje.findById(id_predavanja).populate("predmet").then(p => {
            if(p.predmet.predavac != req.user._id) {
                req.flash("error", "Nemate pristup ovoj ruti!");
                res.locals.rediret = "back";
                next();
            }
        });
        PitanjeStudenta.findById(id_pitanja).then(p => {
            p.zavrseno = true;
            p.save();
            res.sendStatus(200);
        }).catch(error => {
            console.log(`Greška pri zatvaranju pitanja: ${error.message}`);
            req.flash("error", `Greška pri zatvaranju pitanja.`);
            res.locals.redirect = "back";
            next();
        });
    }
};
