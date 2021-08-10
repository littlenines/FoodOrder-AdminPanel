const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars');
const session = require("express-session");
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');

require('dotenv').config();


const app = express();

const port = process.env.PORT || 5000;


// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());
// Static files
app.use(express.static('public'));
// cookie parser middleware
app.use(cookieParser());
// File upload
app.use(fileUpload());
// Session needs to be before routes or it won't work
const twoDay = 2 * 24 * 60 * 60 * 1000;;
app.use(session({
    secret: process.env.SI_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: twoDay },
    resave: false
}));

// Template engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Connection pool
const pool = mysql.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
// Connect to DB
pool.getConnection((err, connection) => { if (err) { throw err; } });

const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port: ${port}`));