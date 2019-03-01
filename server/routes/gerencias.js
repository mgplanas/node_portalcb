// ==============================================================
// ROUTE DEFITION FOR GERENCIAS
// API:\gerencias
// ==============================================================
const express = require('express');

// Middleware de autenticacion
const { verificaToken } = require('../middlewares/autenticacion');

let router = express.Router()
let Gerencia = require('../models/gerencia');
const fields = 'nombre sigla';

// ===========================
// Obtener todas gerencias
// ===========================
router.get('/', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Gerencia.find({ "audit.deleted": { $exists: false } }, fields)
        .skip(desde)
        .limit(limite)
        .exec((err, gerencias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                gerencias
            });
        })
});

// ===========================
// Obtener una gerencia por ID
// ===========================
router.get('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Gerencia.findById(id, fields)
        .exec((err, gerenciaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!gerenciaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                gerencia: gerenciaDB
            });

        });

});

// ===========================
//  Buscar productos
// ===========================
router.get('/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Gerencia.find({ nombre: regex }, fields)
        .exec((err, gerencias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                gerencias
            })

        })
});

// ===========================
// Crear una nueva gerencia
// fields: nombre, sigla
// ===========================
router.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let gerencia = new Gerencia({
        nombre: body.nombre,
        sigla: body.sigla,
        audit: {
            created: Date.now(),
            createdBy: req.usuario._id
        }
    });

    gerencia.save((err, gerenciaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            gerencia: gerenciaDB
        });

    });

});
// ===========================
//  Actualizar una gerencia
// ===========================
router.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Gerencia.findById(id, (err, gerenciaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!gerenciaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        gerenciaDB.nombre = body.nombre;
        gerenciaDB.sigla = body.sigla;
        gerenciaDB.audit.modified = Date.now();
        gerenciaDB.audit.modifiedBy = req.usuario._id;

        gerenciaDB.save((err, gerenciaGuardada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                gerencia: gerenciaGuardada
            });

        });

    });

});

// ===========================
//  Eliminar una gerencia
// ===========================
router.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Gerencia.findById(id, (err, gerenciaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!gerenciaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        gerenciaDB.audit.deleted = Date.now();
        gerenciaDB.audit.deletedBy = req.usuario._id;

        gerenciaDB.save((err, gerenciaDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                gerencia: gerenciaDeleted,
                mensaje: 'Gerencia borrada'
            });

        })

    })
});

module.exports = router;