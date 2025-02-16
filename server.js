const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//require cors to use fs writer
const cors = require("cors");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// TODO Requiring our models for syncing
// const {
//     User,
//     Achievement,
//     Comment,
//     Group,
//     Character,
//     Item,
//     Inventory,
// } = require("./models");

// Sets up sessions cookies
const sess = {
    secret: "process.env.SESSION_SECRET",
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

// necessary for express to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//cors
app.use(cors());

// Static directory
app.use(express.static('public'))


// initializes the main.handlebars file for all calls in the frontEndController.js file
const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(allRoutes);

// shows all active sessions
app.get("/sessions", (req, res) => {
    res.json(req.session);
});

// syncs our data base
sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});
