"use strict";

const mongoose = require("mongoose"),
    Pitanje = require("./pitanje"),
    { Schema } = require("mongoose");

var OdgovorStudentaSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student"
        },
        pitanje: {
            type: Schema.Types.ObjectId,
            ref: "Pitanje",
            required: true
        },
        tekst_odgovora: { // za tip 3 - tekstualno pitanje i tip 0 - da/ne pitanje
            type: String
        },
        odgovori: [Number] // indeks odgovora za tipove 1 i 2
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OdgovorStudenta", OdgovorStudentaSchema);
