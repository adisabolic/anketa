const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    Student = require("../models/student"),
    Predavac = require("../models/predavac");

module.exports = function(passport) {
    passport.use('studentLocal', new LocalStrategy({usernameField: 'email'}, Student.authenticate()));
    passport.use('predavacLocal', new LocalStrategy({usernameField: 'email'}, Predavac.authenticate()));

    passport.serializeUser(function (userObject, done) {
        if(userObject.prototype instanceof Student) {
            Student.serializeUser();
            done(null, userObject);
        }
        else {
            Predavac.serializeUser();
            done(null, userObject);
        }
    });

    passport.deserializeUser(function (userObject, done) {

        if(userObject.prototype instanceof Student) {
            Student.deserializeUser();
            done(null, userObject);
        }
        else {
            Predavac.deserializeUser();
            done(null, userObject);
        }
    });

};