"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose");

var predavanjeSchema = new Schema(
    {
        naziv: {
            type: String,
            required: true,
            trim: true
        },
        sifra_pristupa: {
            type: String,
            required: true,
            unique: true
        },
        predmet: {
            type: Schema.Types.ObjectId,
            ref: "Predmet"
        },
        vrijeme_pocetka: Date,
        aktivnaAnketa: {
            type: Boolean,
            default: false
        },
        anonimnaAnketa: {
            type: Boolean,
            default: false
        },
        trenutno_pitanje: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

predavanjeSchema.pre("save", function (next) {
    let p = this;
    if (p.sifra_pristupa === "generisi") {
        var sifra = "";
        var karakteri = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var duzina = karakteri.length;
        for ( var i = 0; i < 10; i++ ) {
            sifra += karakteri.charAt(Math.floor(Math.random() * duzina));
        }
        p.sifra_pristupa = sifra;
    }
    next();
});

module.exports = mongoose.model("Predavanje", predavanjeSchema);
