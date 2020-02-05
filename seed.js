"use strict";

const mongoose = require("mongoose"),
    Student = require("./models/student"),
    Predavac = require("./models/predavac");

mongoose.connect("mongodb+srv://admin:admin@cluster0-jjjis.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connection;

var studenti = [
    {
        ime: "Adisa",
        prezime: "Bolic",
        email: "adisa.bolic@gmail.com",
        password: "adisabolic",
        predavac: false
    },
    {
        ime: "Amina",
        prezime: "Sinanovic",
        email: "sinanovica1@gmail.com",
        password: "aminasinanovic",
        predavac: false
    },
    {
        ime: "Ermin",
        prezime: "Pijuk",
        email: "ermin_bc@yahoo.com",
        password: "erminpijuk",
        predavac: false
    }
];

var predavaci = [
    {
        ime: "Elmedin",
        prezime: "Selmanovic",
        email: "elmedin.selmanovic@gmail.com",
        password: "elmedinselmanovic",
        predavac: true
    },
    {
        ime: "Sead",
        prezime: "Delalic",
        email: "sead.delalic@gmail.com",
        password: "seaddelalic",
        predavac: true
    }
];

let registerStudent = s => {
    Student.register(
        {
            ime: s.ime,
            prezime: s.prezime,
            email: s.email,
            predavac: s.predavac
        },
        s.password,
        (error, student) => {
            if(error)
                console.log(error.message);
            else
                console.log(`Student kreiran: ${student.punoIme}`);
        }
    );
};

let registerPredavac = p => {
    Predavac.register(
        {
            ime: p.ime,
            prezime: p.prezime,
            email: p.email,
            predavac: p.predavac
        },
        p.password,
        (error, predavac) => {
            if(error)
                console.log(error.message);
            else
                console.log(`Predavac kreiran: ${predavac.punoIme}`);
        }
    );
};

Student.deleteMany({}).then(() => {
    studenti.forEach(s => {
        registerStudent(s);
    });
});

Predavac.deleteMany({}).then(() => {
    predavaci.forEach(p => {
        registerPredavac(p);
    });
});


