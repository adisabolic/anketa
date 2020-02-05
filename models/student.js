"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var studentSchema = new Schema(
    {
        ime: {
            type: String,
            required: true,
            trim: true
        },
        prezime: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        predavac: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

studentSchema.virtual("punoIme").get(function() {
    return `${this.ime} ${this.prezime}`;
});

studentSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("Student", studentSchema);
