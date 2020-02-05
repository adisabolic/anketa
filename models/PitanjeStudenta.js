"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose");

var pitanjeStudentaSchema = new Schema(
    {
        predavanje: {
            type: Schema.Types.ObjectId,
            ref: "Predavanje",
            required: true
        },
        pitanje: {
            type: String,
            required: true
        },
        odobravanja: {
            type: Number,
            default: 0
        },
        studenti_odobrili: [{
            type: Schema.Types.ObjectId,
            ref: "Student",
        }],
        zavrseno: {
            type: Boolean,
            default: false
        },
        odgovor: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("pitanjeStudenta", pitanjeStudentaSchema);
