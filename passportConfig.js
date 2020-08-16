const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const keys = require('./config/keys');

function initialize(passport) {
    // LOCAL STRATEGY
    const authenticateLocalUser = (email, password, done) => {
        pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch){
                            return done(null, user);
                        } else {
                            return done(null, false, {message: "Password is incorrect"});
                        }
                    });
                } else {
                    return done(null, false, {message: "Email is not registered"});
                }
            }
        )
    }

    const localStrategyParams = {
        usernameField: "email",
        passwordField: "password"
    };

    const localStrategy = new LocalStrategy(localStrategyParams, authenticateLocalUser);
    passport.use(localStrategy);

    // GOOGLE STRATEGY
    const authenticateGoogleUser = (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        console.log(profile);
    
        pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];                    
                    return done(null, user);
                } else {
                    pool.query(
                        `INSERT INTO users (email, name, password)
                        VALUES ($1, $2, 'ololo')
                        RETURNING *`,
                        [email, name],
                        (err, results) => {
                            if (err) {
                                throw err
                            }
                            //console.log(results.rows);
                            const user = results.rows[0]; 
                            console.log("user", user);
                            return done(null, user);
                        }
                    )
                }
            }
        )
        
    };

    const googleStrategyParams = {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    };
    
    const googleStrategy = new GoogleStrategy(googleStrategyParams, authenticateGoogleUser);
    
    passport.use(googleStrategy);

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            console.log(`ID is ${results.rows[0].id}`);
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;