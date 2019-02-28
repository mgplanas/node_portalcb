const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');
const LdapStrategy = require('passport-ldapauth');

let OPTS = {
    usernameField: process.env.USERNAME_FIELD,
    passwordField: process.env.PASSWORD_FIELD,
    server: {
        url: process.env.SERVER_URL,
        bindDn: process.env.SERVER_BIND_DN,
        bindCredentials: process.env.SERVER_BIND_CREDENTIALS,
        searchBase: process.env.SERVER_SEARCH_BASE,
        searchFilter: process.env.SERVER_SEARCH_FILTER
    }
};

var app = express();

passport.use(new LdapStrategy(OPTS));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.post('/login', function(req, res, next) {

    passport.authenticate('ldapauth', (err, user, info) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        let token = jwt.sign({
            usuario: user.cn
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: user,
            token,
            info
        });
    })(req, res, next);
});

module.exports = app;