const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require('underscore');
const fieldsArr = ['username', 'nombre', 'apellido', 'email', 'legajo', 'img', 'gerencia', 'grupo', 'contacto', 'cargo'];
const fields = fieldsArr.join(' ');

const router = express.Router();

//con middleware de verificacion de token
router.get('/', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ "audit.deleted": { $exists: false } }, fields)
        .populate('gerencia', 'nombre sigla')
        .populate('grupo', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            })
        })

});

// ===========================
//  Buscar Usuario por termino
// ===========================
router.get('/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Usuario.find({ nombre: regex }, fields)
        .populate('gerencia', 'nombre sigla')
        .populate('grupo', 'nombre')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            })

        })
});
router.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        username: body.username,
        legajo: body.legajo,
        audit: {
            created: Date.now(),
            createdBy: req.usuario._id
        }
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

router.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, fields)
        .populate('gerencia', 'nombre sigla')
        .populate('grupo', 'nombre')
        .exec((err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuarioDB.apellido = body.apellido || usuarioDB.apellido;
            usuarioDB.nombre = body.nombre || usuarioDB.nombre;
            usuarioDB.username = body.username || usuarioDB.username;
            usuarioDB.email = body.email || usuarioDB.email;
            usuarioDB.legajo = body.legajo || usuarioDB.legajo;
            usuarioDB.cargo = body.cargo || usuarioDB.cargo;
            usuarioDB.contacto = body.contacto || usuarioDB.contacto;
            usuarioDB.gerencia = body.gerencia || usuarioDB.gerencia;
            usuarioDB.grupo = body.grupo || usuarioDB.grupo;
            usuarioDB.audit.modifiedBy = req.usuario._id;
            usuarioDB.audit.modified = Date.now();

            usuarioDB.save((err, usuarioGuardado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuario: usuarioGuardado
                });

            });

        });

});
router.delete('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { 'audit.deletedBy': req.usuario._id, 'audit.deleted': Date.now() }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = router;