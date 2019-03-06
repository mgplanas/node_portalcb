// ==============================================================
// ROUTE DEFITION FOR GRUPOS
// API:\grupos
// ==============================================================
const express = require('express');

// Middleware de autenticacion
const { verificaToken } = require('../middlewares/autenticacion');

let router = express.Router()
let Grupo = require('../models/grupo');
const fields = 'nombre descripcion gerencia';

// ===========================
// Obtener todos los grupos
// ===========================
router.get('/', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Grupo.find({ "audit.deleted": { $exists: false } }, fields)
        .populate('gerencia', '_id nombre sigla')
        .skip(desde)
        .limit(limite)
        .exec((err, grupos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                grupos
            });
        })
});

// ===========================
// Obtener un grupo por ID
// ===========================
router.get('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Grupo.findById(id, fields)
        .populate('gerencia', '_id nombre sigla')
        .exec((err, grupoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!grupoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                grupo: grupoDB
            });

        });

});

// ===========================
//  Buscar Grupos por termino
// ===========================
router.get('/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Grupo.find({ nombre: regex }, fields)
        .populate('gerencia', '_id nombre sigla')
        .exec((err, grupos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                grupos
            })

        })
});

// ===========================
// Crear una nuevo grupo
// fields: nombre, descripcion
// ===========================
router.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let grupo = new Grupo({
        nombre: body.nombre,
        descripcion: body.descripcion,
        gerencia: body.gerencia,
        audit: {
            created: Date.now(),
            createdBy: req.usuario._id
        }
    });

    grupo.save((err, grupoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            grupo: grupoDB
        });

    });

});
// ===========================
//  Actualizar un Grupo
// ===========================
router.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Grupo.findById(id, (err, grupoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!grupoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        grupoDB.nombre = body.nombre || grupoDB.nombre;
        grupoDB.descripcion = body.descripcion || grupoDB.descripcion;
        grupoDB.gerencia = body.gerencia || grupoDB.gerencia;
        grupoDB.audit.modified = Date.now();
        grupoDB.audit.modifiedBy = req.usuario._id;


        grupoDB.save((err, grupoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                grupo: grupoGuardado
            });

        });

    });

});

// ===========================
//  Eliminar un grupo
// ===========================
router.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Grupo.findById(id, (err, grupoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!grupoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        grupoDB.audit.deleted = Date.now();
        grupoDB.audit.deletedBy = req.usuario._id;

        grupoDB.save((err, grupoDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                grupo: grupoDeleted,
                mensaje: 'Grupo eliminado'
            });

        })

    })
});

module.exports = router;