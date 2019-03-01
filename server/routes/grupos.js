// ==============================================================
// ROUTE DEFITION FOR GRUPOS
// API:\grupos
// ==============================================================
const express = require('express');

// Middleware de autenticacion
const { verificaToken } = require('../middlewares/autenticacion');
// Pool de coneccion Mysql
let connection = require('../db/mysql');

let router = express.Router()

// Referencia al Modelo
let GrupoModel = require('../models/gruposModel');


// ===========================
//  Obtener grupos
// ===========================
router.get('/', verificaToken, (req, res) => {

    // Tomo una nueva conexion a DB
    connection.acquire((err, con) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        let Grupo = new GrupoModel(con);
        Grupo.CRUD.getAll((err, grupos) => {
            con.release();

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
        });
    });
});

// ===========================
// Obtener un grupo por ID
// ===========================
router.get('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // Tomo una nueva conexion a DB
    connection.acquire((err, con) => {

        if (err) return res.status(500).json({ ok: false, err });

        let Grupo = new GrupoModel(con);
        Grupo.CRUD.get(id, (err, grupo) => {
            con.release();

            if (err) return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                grupo
            });
        });
    });
});
// ===========================
// Crear un nuevo grupo
// fields: nombre
// ===========================
router.post('/', verificaToken, (req, res) => {

    let body = req.body;

    connection.acquire((err, con) => {
        if (err) return res.status(500).json({ ok: false, err });

        let Grupo = new GrupoModel(con);

        //Creo la transacción
        con.beginTransaction(function(err) {
            if (err) return res.status(500).json({ ok: false, err });

            // TODO: req.usuario.id
            Grupo.CRUD.create(body.grupo, 1, (err, id) => {
                if (err) {
                    //Si hubo error rollback y retorno el error
                    con.rollback(function() { con.release(); });
                    return res.status(500).json({ ok: false, err });
                }

                //Realizo el comit de la base
                con.commit(function(err) {
                    if (err) {
                        //Si hubo un error en el commit hago el rollback
                        con.rollback(function() { con.release(); });
                        return res.status(500).json({ ok: false, err });
                    }
                    //libero la conexion del pool
                    con.release();

                    //Si todo salioi bien devuelvo la respuesta
                    res.status(201).json({
                        ok: true,
                        id
                    });
                });
            });
        });
    });

});
// ===========================
//  Actualizar un grupo
// ===========================
router.put('/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    connection.acquire((err, con) => {
        if (err) return res.status(500).json({ ok: false, err });

        let Grupo = new GrupoModel(con);

        //Creo la transacción
        con.beginTransaction(function(err) {
            if (err) return res.status(500).json({ ok: false, err });

            // TODO: req.usuario.id
            Grupo.CRUD.update(id, body.grupo, 1, (err, affectedRows) => {
                if (err) {
                    //Si hubo error rollback y retorno el error
                    con.rollback(function() { con.release(); });
                    return res.status(500).json({ ok: false, err });
                }

                //Realizo el comit de la base
                con.commit(function(err) {
                    if (err) {
                        //Si hubo un error en el commit hago el rollback
                        con.rollback(function() { con.release(); });
                        return res.status(500).json({ ok: false, err });
                    }
                    //libero la conexion del pool
                    con.release();

                    //Si todo salioi bien devuelvo la respuesta
                    res.status(200).json({
                        ok: true,
                        affectedRows
                    });
                });
            });
        });
    });
});

// ===========================
//  Eliminar un grupo
// ===========================
router.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    connection.acquire((err, con) => {
        if (err) return res.status(500).json({ ok: false, err });

        let Grupo = new GrupoModel(con);

        //Creo la transacción
        con.beginTransaction(function(err) {
            if (err) return res.status(500).json({ ok: false, err });

            // TODO: req.usuario.id
            Grupo.CRUD.del(id, 1, (err, affectedRows) => {
                if (err) {
                    //Si hubo error rollback y retorno el error
                    con.rollback(function() { con.release(); });
                    return res.status(500).json({ ok: false, err });
                }

                //Realizo el comit de la base
                con.commit(function(err) {
                    if (err) {
                        //Si hubo un error en el commit hago el rollback
                        con.rollback(function() { con.release(); });
                        return res.status(500).json({ ok: false, err });
                    }
                    //libero la conexion del pool
                    con.release();

                    //Si todo salioi bien devuelvo la respuesta
                    res.status(200).json({
                        ok: true,
                        affectedRows
                    });
                });
            });
        });
    });
});

module.exports = router;