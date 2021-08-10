const mysql = require('mysql');

// Get date and time
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

let futureDate = new Date();

const year = futureDate.getFullYear();
const hours = futureDate.getHours();
const minutes = futureDate.getMinutes();

let month = futureDate.getMonth();
month = months[month];

const date = futureDate.getDate();
const weekday = weekdays[futureDate.getDay()];


// Connection pool
const pool = mysql.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


// View pizza menu
exports.main = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        // Use the connection
        connection.query('call menu()', (err, rows) => {
            //When done release connection
            connection.release();

            if (!err) {
                res.render('home', { rows: rows[0] });
            } else {
                console.log(err);
            }

        });

    });

};

// Search
exports.find = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        let searchTerm = req.body.search;
        // Use the connection
        connection.query('call find(?)', ['%' + searchTerm + '%'], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('home', { rows: rows[0] });
            } else {
                console.log('Error: ' + err);
            }
        });
    });
};

// Get info for ordering
exports.edit = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        // Use the connection
        connection.query('call editInfo(?)', [req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('order', { rows: rows[0] });
            } else {
                console.log('Error: ' + err);
            }

        });
    });
};


// Add order to database
exports.order = (req, res) => {

    const { first_name, last_name, email, phone, address, title, price, quantity, comments } = req.body;
    const total = price * quantity;
    const dateOrdered = `${weekday}, ${date} ${month} ${year} ${hours}:${minutes}`;

    // Checkbox
    let extra = req.body.extra;
    if (extra === undefined) {
        extra = null;
    } else {
        extra = extra.toString();
    }

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call addOrder(?,?,?,?,?,?,?,?,?,?,?,?)', [first_name, last_name, email, phone, address, title, price, quantity, total, dateOrdered, extra, comments], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('order', { alert: ` ${title} has been ordered` });
            } else {
                console.log('Error: ' + err);
            }
        });
    });
};