"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose"),
    Predavac = require("./predavac.js");

var studentSchema = new Schema(
    {
        naziv: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        predavac: {type: Schema.Types.ObjectId, ref: "Predavac"}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Predmet", studentSchema);
