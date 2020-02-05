"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose");

var pitanjeSchema = new Schema(
    {
        tip: { // 0 - DA/NE, 1 - visestruko sa 1 izborom, 2 - visestruko sa vise izbora, 3 - tekstualno
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        tekst: {
            type: String,
            required: true,
            trim: true
        },
        trajanje: {
            type: Number,
            default: 15
        },
        predavanje: {
            type: Schema.Types.ObjectId,
            ref: "Predavanje",
            required: true
        },
        odgovori: [String],
        redni_broj: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pitanje", pitanjeSchema);
