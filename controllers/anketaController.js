"use strict";

const Predavanje = require("../models/predavanje"),
    Pitanje = require("../models/pitanje"),
    OdgovorStudenta = require("../models/OdgovorStudenta"),
    Notify = require('app-notify'),
    cfg = {},
    notify = new Notify(cfg);

module.exports = {
    provjeriSifru: (req, res, next) => {
        var sifra = req.params.sifra;
        if(!req.user) {
            req.flash("error", `Molimo da se prijavite prije pristupa ovoj ruti!`);
            res.redirect("/login");
        }
        else {
            Predavanje.findOne({sifra_pristupa: sifra}).then((anketa) => {
                if(!anketa) {
                    req.flash("error", `Anketa sa unesenom šifrom ne postoji!`);
                    if(req.user.predavac)
                        res.redirect("/predavac");
                    else
                        res.redirect("/student");
                }
                else if(!anketa.aktivnaAnketa) {
                    req.flash("error", `Anketa sa unesenom šifrom nije trenutno aktivna!`);
                    if(req.user.predavac)
                        res.redirect("/predavac");
                    else
                        res.redirect("/student");
                }
                else
                    next();
            }).catch(error => {
                console.log(`Greška pri prikazu ankete: ${error.message}`);
                req.flash("error", `Greška pri prikazu ankete za dati predmet`);
                if(req.user.predavac)
                    res.redirect("/predavac");
                else
                    res.redirect("/student");
            });
        }
    },
    pristupiAnketi: (req, res, next) => {
        var sifra = req.params.sifra;
        var preostalo = true;
        Predavanje.findOne({sifra_pristupa: sifra}).then((p) => {
            return p;
        }).then((p) => {
            Pitanje.find({predavanje: p._id, redni_broj: {$gte: p.trenutno_pitanje}}).sort({redni_broj: 1}).limit(2).then((pit) => {
                if(pit.length === 1)
                    preostalo = false;
                return pit[0];
            }).then((pitanje) => {
                let id_studenta = null, odgovorio = null;
                if(req.user.predavac) {
                    res.render("anketa/index", {
                        sifra: sifra,
                        trenutnoPitanje: pitanje,
                        id_predavanja: p._id,
                        title: "Anketa za" + " - " + p.naziv,
                        odgovori: pitanje.odgovori,
                        predavac: req.user.predavac,
                        redni_broj: pitanje.redni_broj,
                        preostalo: preostalo,
                        id_studenta: id_studenta,
                        id_pitanja: pitanje._id,
                        odgovorio: odgovorio
                    });
                }
                else {
                    id_studenta = req.user._id;
                    OdgovorStudenta.findOne({student: id_studenta, pitanje: pitanje._id}).then(o => {
                        if (o)
                            odgovorio = true;
                        else
                            odgovorio = false;
                    }).then(() => {
                        res.render("anketa/index", {
                            sifra: sifra,
                            trenutnoPitanje: pitanje,
                            id_predavanja: p._id,
                            title: "Anketa za" + " - " + p.naziv,
                            odgovori: pitanje.odgovori,
                            predavac: req.user.predavac,
                            redni_broj: pitanje.redni_broj,
                            preostalo: preostalo,
                            id_studenta: id_studenta,
                            id_pitanja: pitanje._id,
                            odgovorio: odgovorio
                        })
                    })
                }
            }).catch(error => {
                console.log(`Greška pri prikazu pitanja: ${error.message}`);
                req.flash("error", `Greška pri prikazu pitanja za dato predavanje`);
                if (req.user.predavac)
                    res.locals.redirect = "/predavac";
                else
                    res.locals.redirect = "/student";
                next();
            });
        });
    },
    pokreniAnketu: (req, res, next) => {
        let idPredavanja = req.body.id;
        let anonimna = req.body.anonimna;
        Predavanje.findById(idPredavanja).then((p) => {
            p.anonimnaAnketa = anonimna;
            p.aktivnaAnketa = true;
            p.save();
            res.send(p.sifra_pristupa);
        }).catch(error => {
            console.log(`Greška pri pokretanju ankete: ${error.message}`);
            req.flash("error", `Greška pri pokretanju ankete za dato predavanje. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
    },
    pokreniAnketuMail: (req, res, next) => {
        let idPredavanja = req.body.id;
        let anonimna = req.body.anonimna;
        Predavanje.findById(idPredavanja).then((p) => {
            p.anonimnaAnketa = anonimna;
            p.aktivnaAnketa = true;
            p.save();
        }).then(() => {
            const cfg = {};

//setup smtp server
            cfg.smtp = {
                host: xxx,
                user: user,
                pass: pass,
                port: port
            };

//setup email headers
            cfg.email = {
                to: 'ermin_bc@yahoo.com',
                from: 'adisa.bolic@gmail.com'
            };

            const Notify = require('app-notify');
            const notify = new Notify(cfg);

//send an email
            notify.email.send({
                subject: 'Pocela je anketa sa sifrom' + sifra,
                message: 'Pocela je anketa sa sifrom' + sifra,
            })
                .then(function(data){
                    console.log(data);
                })
                .catch(function(err){
                    console.error(err);
                });
            res.send(p.sifra_pristupa);
        })
            .catch(error => {
            console.log(`Greška pri pokretanju ankete: ${error.message}`);
            req.flash("error", `Greška pri pokretanju ankete za dato predavanje. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
    },
    zatvoriAnketu: (req, res, next) => {
        let idPredavanja = req.body.id;

        Predavanje.findById(idPredavanja).then((p) => {
            p.aktivnaAnketa = false;
            p.trenutno_pitanje = 1;
            p.save();
            res.sendStatus(200);
        }).catch(error => {
            console.log(`Greška pri zatvaranju ankete: ${error.message}`);
            req.flash("error", `Greška pri zatvaranju ankete. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
    },
    iducePitanje: (req, res, next) => {
        let idPredavanja = req.body.id;
        let rb = req.body.rb;
        let sifra;
        Predavanje.findById(idPredavanja).then((p) => {
            p.trenutno_pitanje = rb;
            p.save();
            sifra = p.sifra_pristupa;
            res.send(sifra);
        }).catch(error => {
            console.log(`Greška pri prelasku na iduće pitanje: ${error.message}`);
            req.flash("error", `Greška pri prelasku na iduće pitanje. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
    },
    provjeriStudenta: (req, res, next) => {
        if(!req.user) {
            res.redirect("/login");
            req.flash("error", `Molimo da se prijavite prije pristupa ovoj ruti!`);
        }
        else if(req.user.predavac) {
            res.redirect("/predavac");
            req.flash("error", `Ne može predavač odgovarati na pitanja!`);
        }
        else {
            OdgovorStudenta.findOne({student: req.body.id_studenta, pitanje: req.body.id_pitanja}).then(o => {
                if(o) {
                    req.flash("error", `Možete samo jednom odgovoriti na dato pitanje!`);
                    res.redirect("back");
                }
                else {
                    next();
                }
            }).catch(error => {
                console.log(`Greška pri traženju odgovora: ${error.message}`);
                req.flash("error", `Greška pri odgovaranju na pitanje. Molimo pokušajte ponovo!`);
                res.redirect("back");
                res.sendStatus(200);
            });
        }
    },
    dodajOdgovor: (req, res, next) => {
        let odgovori;
        let sifra = req.body.sifra;
        //console.log("Odogovori", JSON.parse(req.body.odgovori));
        var noviOdg = new OdgovorStudenta({
            tekst_odgovora : req.body.tekst,
            odgovori : JSON.parse(req.body.odgovori),
            student : req.body.id_studenta,
            pitanje : req.body.id_pitanja
        });
        OdgovorStudenta.create(noviOdg).catch(error => {
            console.log(`Greška pri dodavanju odgovora: ${error.message}`);
            req.flash("error", `Greška pri odgovaranju na pitanje. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
        res.locals.redirect = "/anketa/" + sifra + "/rezultati";
        console.log("/anketa/" + sifra + "/rezultati");
        next();
    },
    pokaziRezultate: (req, res, next) => {
        let sifra = req.params.sifra;
        var preostalo = true;
        //console.log("prikazujem rez");
        Predavanje.findOne({sifra_pristupa: sifra}).then(p => {
            //console.log(p.trenutno_pitanje);
            return p;
        }).then((p) => {
            Pitanje.find({
                predavanje: p._id,
                redni_broj: {$gte: p.trenutno_pitanje}
            }).sort({redni_broj: 1}).limit(2).then((pit) => {
                if (pit.length === 1)
                    preostalo = false;
                return pit[0];
            }).then((pit) => {
                OdgovorStudenta.find().populate("pitanje").populate("student").then((o) => {
                    //console.log(o);
                    res.render("anketa/rezultati", {
                        sifra: sifra,
                        id_predavanja: p._id,
                        sviOdgovori: o,
                        anonimna: p.anonimnaAnketa,
                        title: "Rezultati ankete za" + " - " + p.naziv,
                        predavac: req.user.predavac,
                        preostalo: preostalo,
                        trenutni_rb: p.trenutno_pitanje
                    });
                })
            })
        }).catch(error => {
            console.log(`Greška pri prikazu rezultata: ${error.message}`);
            req.flash("error", `Greška pri prikazu rezultata. Molimo pokušajte ponovo!`);
            res.locals.redirect = "back";
            next();
        });
    }
};