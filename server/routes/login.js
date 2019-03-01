const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');
const LdapStrategy = require('passport-ldapauth');
const Usuario = require('../models/usuario');

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

let router = express.Router();

passport.use(new LdapStrategy(OPTS));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(passport.initialize());

router.post('/', function(req, res, next) {

    let body = req.body;

    passport.authenticate('ldapauth', (err, user, info) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Verifico si el correo existe;
        Usuario.findOne({ username: body.username }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '(Usuario) o contraseña incorrectos'
                    }
                });
            }

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                usuario: usuarioDB,
                token,
                info
            });
        });
    })(req, res, next);
});

module.exports = router;