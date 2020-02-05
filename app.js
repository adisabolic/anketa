"use strict";

const express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    fileUpload = require('express-fileupload'),
    Student = require("./models/student"),
    Predavac = require("./models/predavac"),
    Pitanje = require("./models/pitanje"),
    OdgovorStudenta = require("./models/OdgovorStudenta"),
    Predavanje = require("./models/predavanje"),
    Predmet = require("./models/predavanje"),
    socketController = require("./controllers/socketController"),
    router = require("./routes/index"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator"),
    connectFlash = require("connect-flash");


mongoose.Promise = global.Promise;
mongoose.connect(
    "mongodb+srv://admin:admin@cluster0-jjjis.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useFindAndModify: false }
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
//app.set("token", process.env.TOKEN || "recipeT0k3n");

app.use(express.static("public"));
app.use(layouts);
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(fileUpload());

app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(
    expressSession({
        secret: "secret_passcode",
        cookie: {
            maxAge: 4000000
        },
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(connectFlash());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});
app.use(expressValidator());

app.use("/", router);

const server = app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost: ${app.get("port")}`);
}),
    io = require("socket.io")(server);
require("./controllers/socketController")(io);
