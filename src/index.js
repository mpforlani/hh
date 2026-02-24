require(`dotenv`).config()
const express = require("express");
const multer = require(`multer`)
const path = require("path")
const uuid = require(`uuid`).v4
const session = require("express-session");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const config = require("./config");
const flash = require('connect-flash');

//const MONGO_URL = `mongodb://127.0.0.1:27017/sbc`
//const MONGO_URL = `mongodb://127.0.0.1:27017/${process.env.DATABASE}`
//const MONGO_URL = `mongodb://${process.env.USERADMIN}:${process.env.USERPWD}@${process.env.SERVER}/${process.env.DB_DATABASE}?authSource=admin`
const MONGO_URL = `mongodb://${process.env.USERADMIN}:${process.env.USERPWD}@${process.env.SERVER}/sbc?authSource=admin`

const app = express();
require('./dbConfig');
require('./modelo/lib/passportConfig');

//Settings
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// Middleware
//app.use(cookieParser());
/*app.use(cookieSession({
    secret: "secret",
}))*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'modelo/front')));
app.use(express.static(path.join(__dirname, '/front')));


const storage = multer.diskStorage({
    destination: path.join(__dirname, 'front/uploads'),
    filename: (req, file, cb, filename) => {

        cb(null, uuid() + path.extname(file.originalname));
    }
})


app.use(multer({ storage }).fields([
    { name: `adjunto`, maxCount: 5 },
    { name: `adjuntoColeccion`, maxCount: 20 }
]))

app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: "secret",
        // Should we resave our session variables if nothing has changes which we dont
        resave: false,
        // Save empty value if there is no vaue which we do not want to do
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URL
        })
    })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.use(require('./modelo/controladores/inicio'));
app.use(require('./modelo/controladores/home'));
app.use(require('./modelo/controladores/market'));
//app.use(require('./modelo/controladores/writeFile'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});