const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Connection pool
const pool = mysql.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


exports.users = (req, res) => {
    const usr = req.session.userN;
    res.render('users', { usr });
}

exports.register = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        const { username, password, cpassword } = req.body;

        // Use the connection
        connection.query('call register(?)', [username], async (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                if (rows[0].length > 0) {
                    res.render('users', { alert: ` User already exists.` });
                }
                else if (password !== cpassword) {
                    res.render('users', { alert: ` Password doesn't match.` });
                } else {
                    let hashedPassword = await bcrypt.hash(password, 8);
                    // Use the connection
                    connection.query('call registerInsert(?,?)', [username, hashedPassword], (err, rows) => {

                        if (!err) {
                            const usr = req.session.userN;
                            res.render('users', { usr, alert: ` User successfully created` });
                        } else {
                            console.log('Error: ' + err);
                        }
                    });
                }
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.admin = (req, res) => {
    res.render('admin');
};

exports.login = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).render('admin');
        }

        // Use the connection
        connection.query('call viewLogin(?)', [username], async (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                console.log(await bcrypt.compare(password, rows[0][0].password));
                if (!rows[0] || !(await bcrypt.compare(password, rows[0][0].password))) {
                    res.status(401).render('admin', { alert: `Wrong username or password.` });
                } else {
                    const id = rows[0][0].id;
                    const username = rows[0][0].username;
                    var session = req.session;
                    session.userid = id;
                    session.userN = username;
                    res.status(200).redirect('/hero');
                }
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.adminRegisterView = (req, res) => {
    // Connect to DB
    pool.getConnection(async (err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call adminRegView()', async (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                if (rows[0][0] === undefined) {
                    res.render('register');
                } else {
                    res.redirect('/admin');
                }
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.adminRegister = (req, res) => {
    // Connect to DB
    pool.getConnection(async (err, connection) => {
        if (err) { throw err; } //Not connected

        const { username, password, cpassword } = req.body;

        // Use the connection
        connection.query('call adminRegister(?)', [username], async (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                if (rows[0].length > 0) {
                    res.render('register', { alert: ` User already exists.` });
                }
                else if (password !== cpassword) {
                    res.render('register', { alert: ` Password doesn't match.` });
                } else {
                    let hashedPassword = await bcrypt.hash(password, 8);
                    // Use the connection
                    connection.query('call addAdmin(?,?)', [username, hashedPassword], (err, rows) => {

                        if (!err) {
                            res.redirect('/admin');
                        } else {
                            console.log('Error: ' + err);
                        }

                    });
                }
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/admin");
    });
}

exports.hero = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call hero();', (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                const usr = req.session.userN;
                res.render('hero', { rows: rows[0], usr });
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.vieworder = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call viewOrder(?);', [req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                const usr = req.session.userN;
                res.render('view-order', { rows: rows[0], usr });
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.delete = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call deleteOrder(?)', [req.params.id], (err, rows) => {

            if (!err) {
                let removedUser = encodeURIComponent('User successfully removed');
                res.redirect('/hero?removed=' + removedUser);
            } else {
                console.log('Error: ' + err);
            }
        });
    });
}

exports.warehouse = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        // Use the connection
        connection.query('call menu();', (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                const usr = req.session.userN;
                res.render('warehouse', { rows: rows[0], usr });
            } else {
                console.log('Error: ' + err);
            }

        });
    });
};

exports.deleteProduct = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call deleteMenu(?);', [req.params.id], (err, rows) => {

            if (!err) {
                let removedUser = encodeURIComponent('Product successfully removed');
                res.redirect('/product?removed=' + removedUser);
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.viewproduct = (req, res) => {
    const usr = req.session.userN;
    res.render('add-product', { usr });
}

exports.addproduct = (req, res) => {
    const { title, price, info } = req.body;

    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files uploaded');
    }

    sampleFile = req.files.img;
    uploadPath = 'public/images/' + sampleFile.name;
    const image = '/images/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        pool.getConnection((err, connection) => {
            if (err) { throw err; } //Not connected

            // Use the connection
            connection.query('call addProduct(?,?,?,?)', [title, price, image, info], (err, rows) => {
                // When done with the connection , release it
                connection.release();

                if (!err) {
                    res.render('add-product');
                } else {
                    console.log('Error: ' + err);
                }

            });
        });
    })
}

exports.viewedit = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected

        // Use the connection
        connection.query('call editInfo(?);', [req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                const usr = req.session.userN;
                res.render('edit-product', { rows: rows[0], usr });
            } else {
                console.log('Error: ' + err);
            }

        });
    });
}

exports.update = (req, res) => {
    const { title, price, info } = req.body;
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files uploaded');
    }

    sampleFile = req.files.img;
    uploadPath = 'public/images/' + sampleFile.name;
    const image = '/images/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        pool.getConnection((err, connection) => {
            if (err) { throw err; } //Not connected

            // Use the connection
            connection.query('call updateMenu(?,?,?,?,?);', [title, price, image, info, req.params.id], (err, rows) => {
                // When done with the connection , release it
                connection.release();

                if (!err) {
                    // Connect to DB
                    pool.getConnection((err, connection) => {
                        if (err) { throw err; } //Not connected

                        // Use the connection
                        connection.query('call editInfo(?);', [req.params.id], (err, rows) => {
                            // When done with the connection , release it
                            connection.release();

                            if (!err) {
                                const usr = req.session.userN;
                                res.render('edit-product', { rows: rows[0], usr, alert: `${title} has been updated` });
                            } else {
                                console.log('Error: ' + err);
                            }
                        });
                    });
                } else {
                    console.log('Error: ' + err);
                }
            });
        });
    })
}