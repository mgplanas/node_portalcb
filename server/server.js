require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//Conexion a DB
const mongoose = require('mongoose');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//habilitar la arpeta Public
app.use(express.static(path.resolve(__dirname, '../public/')));

// configuración global de rutas
// app.use(require('./routes/index'));
//Routas de la API
let apiRoute = require('./routes/index');
app.use('/', apiRoute);

mongoose.connect(process.env.URL_DB, (err, resp) => {

    if (err) throw err;
    console.log('Conectado a la DB');
});

app.listen(process.env.PORT, () => console.log(`Escuchando en ${process.env.PORT}`));