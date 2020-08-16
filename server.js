const express = require('express');
require("dotenv").config();
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require('bcrypt');
const session = require('express-session');
//const flash = require('express-flash');
const passport = require('passport');
const PORT = process.env.PORT || 4000;

app.use(express.json()); //we use it to access body of http post request
app.use(express.static("./public"));

const initalizePassport = require("./passportConfig");
initalizePassport(passport);

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback', passport.authenticate('google')
);


app.get('/', (req, res) => {
    res.json({ succes: true});
});

app.get('/welcome', (req, res) => {
    console.log("WELCOME");
    res.json({ succes: true});
});

app.post('/api/register', async (req, res) => {
    let { name, email, password} = req.body;

    console.log({
         name, email, password
    });

    let errors = [];

    if( !name || !email || !password){
        errors.push({message: "Please enter fields"});
    }

    if( errors.length > 0) {
        res.json({ succes: false });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(`hashed pass ==>${hashedPassword}`);

        pool.query(
            `SELECT * FROM users WHERE email = $1`, 
            [email], 
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log("++++++++++++++");
                console.log(results.rows);

                if(results.rows.length > 0) {
                    errors.push({message: "Email already registered"});
                    res.json({ succes: false });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                        [name, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err
                            }
                            console.log(results.rows);
                            res.json({ 
                                success: true,
                                id: results.rows[0].id
                            });
                        }
                    )
                }
            }
        )
    }
});

app.post(
    "/api/login",
    passport.authenticate("local"),
    function(req, res) {
        res.json({success: true})
    }
);

app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/welcome');
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});