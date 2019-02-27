const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Tipo inválido. Los tipo válidos son ' + tiposValidos.join(', ')
                }
            });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensiones permitidas
    let extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Extension inválida. Las extensiones válidas son ' + extensionesValidas.join(', '),
                    ext: extension
                }
            });
    };

    //Asigno nombre de archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            // En este punto la imagen está cargada
            imagenUsuario(id, res, nombreArchivo);
        } else {
            // En este punto la imagen está cargada
            imagenProducto(id, res, nombreArchivo);
        }


    });
});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        //borro la imagen anterior si existe
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }


        //borro la imagen anterior si existe
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    //Si hay una imagen anterior la borro
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;