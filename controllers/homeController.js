"use strict";
const Student = require("../models/student"),
    Predavac = require("../models/predavac");
module.exports = {
    index: (req, res, next) => {
        if(req.user) {
            if(req.user.predavac === false) {
                res.locals.redirect = "/student";
                console.log("STUDENT je logovan. Idem na njegovu stranicu.");
            }

            else if (req.user.predavac === true) {
                res.locals.redirect = "/predavac";
                console.log("PREDAVAC je logovan. Idem na njegovu stranicu.");
            }
            else {
                res.locals.redirect = "/error";
            }
        }
        else {
            res.locals.redirect = "/login";
        }

        next();
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
    showLogin: (req, res, next) => {
        if(req.user) {
            if(req.user.predavac === false) {
                res.locals.redirect = "/student";
                console.log("STUDENT je vec logovan");
            }

            else if (req.user.predavac === true) {
                res.locals.redirect = "/predavac";
                console.log("PREDAVAC je vec logovan");
            }
            else {
                res.locals.redirect = "/error";
            }
            next();
        }
        res.render("login", {
            title: "Login page",
        });
    },
    logout: (req, res, next) => {
        if(req.user) {
            req.logout();
            req.flash("success", "You have been logged out!");
        }
        res.locals.redirect = "/";
        next();
    }
};
