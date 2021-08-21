const pool = require('../config/database');
const { DateTime } = require("luxon");

// Date and Time
const now = DateTime.now();
const change = {...DateTime.DATETIME_MED,weekday: 'long'};
const dt = now.toLocaleString(change);

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
    const dateOrdered = `${dt}`;

    // Checkbox
    const extra = req.body.extra ? req.body.extra.toString() : null;

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