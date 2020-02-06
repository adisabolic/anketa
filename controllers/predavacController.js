"use strict";

const Predavac = require("../models/predavac"),
    Predmet = require("../models/predmet"),
    Pitanje = require("../models/pitanje"),
    fileUpload = require('express-fileupload'),
    excelToJson = require('convert-excel-to-json'),
    Predavanje = require("../models/predavanje"),
    httpStatus = require("http-status-codes"),
    passport = require("passport");
var schedule = require('node-schedule');

module.exports = {
    provjeraPredavaca: (req, res, next) => {
        if(!req.user) {
            res.redirect("/login");
            req.flash("error", `Molimo da se prijavite prije pristupa ovoj ruti!`);
        }
        else if(!req.user.predavac) {
            res.redirect("/student");
            req.flash("error", `Nije vam dozvoljena ova ruta kao studentu!`);
        }
        else
            next();
    },
    authenticate: passport.authenticate("predavacLocal", {
        failureRedirect: "/login",
        failureFlash: "Failed to login. Wrong email or password!",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    show: (req, res, next) => {
        let idPredavac = req.user._id;
        Predmet.find({predavac: idPredavac}).then((p) => {
            res.render("predavac/index", {
                predmeti: p,
                title: "Predavač" + " - " + `${req.user.ime} ${req.user.prezime}`,
            });
        }).catch(error => {
            console.log(`Greška pri prikazu predmeta: ${error.message}`);
            req.flash("error", `Greška pri prikazu predmeta profesora.`);
            res.locals.redirect = "/predavac";
            next();
        });
    },
    dodajPredmet: (req, res, next) => {
        let naziv = req.params.naziv;
        let idProf = req.user._id;
        console.log("Dodajem predmet", naziv, idProf);
        Predmet.create({naziv: naziv, predavac: idProf}).catch(error => {
                console.log(`Greška pri kreiranju predmeta: ${error.message}`);
                req.flash("error", `Greška pri kreiranju predmeta. Pokusajte ponovo!`);
                res.locals.redirect = "/predavac";
                next();
        });
    },
    showPredmet: (req, res, next) => {
        let idPredmet = req.params.id;
        Predmet.findById(idPredmet).then((pr) => {
            return pr.naziv;
        }).then((nazivPredmeta) => {
            Predavanje.find({predmet: idPredmet}).then((p) => {
                res.render("predavac/predmet", {
                    predavanja: p,
                    title: "Predmet" + " - " + nazivPredmeta,
                    id_predmeta: idPredmet
                });
            });
        }).catch(error => {
            console.log(`Greška pri prikazu predavanja: ${error.message}`);
            req.flash("error", `Greška pri prikazu predavanja za dati predmet`);
            res.locals.redirect = "/predavac";
            next();
        });
    },
    dodajPredavanje: (req, res, next) => {
        let podaci = JSON.parse(req.params.obj);
        let idPredmet = podaci.id, naziv = podaci.naziv, sifra = podaci.sifra_pristupa, vrijeme = podaci.vrijeme_pocetka;
        let anonimna = podaci.anonimna;
        if(vrijeme === "") {
            vrijeme = null;
        }
        if(sifra === "")
            sifra = "generisi";

        Predavanje.create({naziv: naziv, sifra_pristupa: sifra, vrijeme_pocetka: vrijeme,
            predmet: idPredmet, anonimnaAnketa: anonimna}).then((p) => {
            if(vrijeme != null) {
                var datum = vrijeme.getSeconds() + " " + vrijeme.getMinutes() + " " + vrijeme.getHours() + " " + vrijeme.getDate() +
                    " " + vrijeme.getMonth() + " " + vrijeme.getDay();
                var j = schedule.scheduleJob(datum, function(){
                    let idPredavanja = p._id;
                        p.anonimnaAnketa = anonimna;
                        p.aktivnaAnketa = true;
                        p.save();
                        //res.send(p.sifra_pristupa);
                    }).catch(error => {
                        console.log(`Greška pri pokretanju ankete: ${error.message}`);
                        req.flash("error", `Greška pri pokretanju ankete za dato predavanje. Molimo pokušajte ponovo!`);
                        res.locals.redirect = "back";
                        next();
                    });
            }
        })
            .catch(error => {
            console.log(`Greška pri kreiranju predavanja: ${error.message}`);
            req.flash("error", `Greška pri kreiranju predavanja. Pokusajte ponovo!`);
            res.redirect('back');
        });
    },
    showPredavanje: (req, res, next) => {
        let idPredavanje = req.params.id;
        Predavanje.findById(idPredavanje).then((pred) => {
            return pred;
        }).then((pred) => {
            Pitanje.find({predavanje: idPredavanje}).then((pit) => {
                res.render("predavac/predavanje", {
                    pitanja: pit,
                    title: "Predavanje" + " - " + pred.naziv,
                    id_predavanja: idPredavanje,
                    sifra: pred.sifra_pristupa,
                    aktivna: pred.aktivnaAnketa
                });
            });
        }).catch(error => {
            console.log(`Greška pri prikazu pitanja: ${error.message}`);
            req.flash("error", `Greška pri prikazu pitanja za dato predavanje`);
            res.locals.redirect = "/predavac";
            next();
        });
    },
    dodajPitanje: (req, res, next) => {
        let rb;
        let podaci = req.body;
        let id=podaci.id, tekst = podaci.tekst, tip = podaci.tip, odgovori = JSON.parse(podaci.odgovori), vrijeme = podaci.vrijeme;
        if(vrijeme === "")
            vrijeme = 15;
        if(tip === 3 || tip === 0)
            odgovori = [];
        Pitanje.find({predavanje: id}).sort({redni_broj: -1}).limit(1).then((pit) => {
            if(pit[0])
                rb = pit[0].redni_broj + 1;
            else
                rb = 1;
            return rb;
        }).then((rb) => {
            Pitanje.create({predavanje: id, tekst: tekst, tip: tip, trajanje: vrijeme, odgovori: odgovori, redni_broj: rb}).catch(error => {
                console.log(`Greška pri kreiranju pitanja: ${error.message}`);
                req.flash("error", `Greška pri kreiranju pitanja. Pokusajte ponovo!`);
                res.redirect('back');
            });
        });
    },
    dodajPitanjeFajl: (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            req.flash("error", `Niste uploadovali fajl!`);
            res.locals.redirect = "back";
            next();
        } else {
            let excelFajl = req.files.excelFajl;
            const pitanja = excelToJson({
                source: excelFajl.data,
                header: {
                    rows: 1
                }
            });
            var redovi = pitanja.Sheet1;
            let podaci = [];
            let prviPut = true;
            for(var i = 0 ; i < redovi.length ; i++) {
                podaci.push([]);
                for (var j in redovi[i]) {
                    if(i === 0 && prviPut) {
                        prviPut = false;
                        continue;
                    }
                    podaci[i].push(redovi[i][j]);
                }
            }
            console.log(podaci);
            let podaciZaDodati = [];
            let rb, tekst, tip, vrijeme, odgovori, p;
            let id = redovi[0].A;

            Pitanje.find({predavanje: id}).sort({redni_broj: -1}).limit(1).then((pit) => {
                if(pit[0])
                    rb = pit[0].redni_broj + 1;
                else
                    rb = 1;
                return rb;
            }).then((redni) => {
                rb = redni;
                for(var i = 0 ; i < podaci.length ; i++) {
                    tekst = podaci[i][0];
                    tip = podaci[i][1];
                    vrijeme = podaci[i][2];
                    rb = rb + i;
                    if (vrijeme === "")
                        vrijeme = 15;
                    if (tip === 3 || tip === 0)
                        odgovori = [];
                    else {
                        odgovori = podaci[i].slice(3);
                    }
                    podaciZaDodati.push({
                        predavanje: id,
                        tekst: tekst,
                        tip: tip,
                        trajanje: vrijeme,
                        odgovori: odgovori,
                        redni_broj: rb
                    });
                }
                return podaciZaDodati;
            }).then((podaciZaDodati) => {
                Pitanje.insertMany(podaciZaDodati).catch(error => {
                    console.log(`Greška pri unosu pitanja: ${error.message}`);
                    req.flash("error", `Greška pri unosu pitanja. Pokusajte ponovo!`);
                    res.redirect('back');
                })
            }).then(() => {
                res.locals.redirect = "back";
                next();
            }).catch(error => {
                console.log(`Greška pri unosu pitanja: ${error.message}`);
                req.flash("error", `Greška pri unosu pitanja. Pokušajte ponovo!`);
                res.redirect('back');
            });
        }
    },
    izbrisiPitanje: (req, res, next) => {
        let id = req.params.id;
        Pitanje.deleteOne({_id: id}).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(`Greška pri brisanju pitanja: ${error.message}`);
            req.flash("error", `Greška pri brisanju pitanja. Pokušajte ponovo!`);
            res.redirect('back');
        });
    },
    pokaziPitanje: (req, res, next) => {
        var id = req.params.id;
        Pitanje.findById(id).then((pit) => {
            res.render("predavac/pitanje", {
                pitanje: pit,
                title: "Pitanje"
            });
        }).catch(error => {
            console.log(`Greška pri prikazu pitanja: ${error.message}`);
            req.flash("error", `Greška pri prikazu pitanja. Pokušajte ponovo!`);
            res.redirect('back');
        });
    },
    promijeniPitanje: (req, res, next) => {

        let podaci = req.body;
        let id=podaci.id, tekst = podaci.tekst, tip = podaci.tip, odgovori = JSON.parse(podaci.odgovori), vrijeme = podaci.vrijeme;
        if(vrijeme === "")
            vrijeme = 15;
        if(tip === 3 || tip === 0)
            odgovori = [];
        Pitanje.findById(id).then((pit) => {
            pit.tekst = tekst;
            pit.tip = tip;
            pit.odgovori = odgovori;
            pit.trajanje = vrijeme;
            pit.save();
            res.sendStatus(200);
        }).catch(error => {
            console.log(`Greška pri prikazu pitanja: ${error.message}`);
            req.flash("error", `Greška pri prikazu pitanja. Pokušajte ponovo!`);
            res.redirect('back');
        });
    }
};
