require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//Conexion a DB
const connection = require('./db/mysql');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//habilitar la arpeta Public
app.use(express.static(path.resolve(__dirname, '../public/')));

// configuración global de rutas
app.use(require('./routes/index'));

//Inicializo la Base de Datos
connection.init();
console.log(`Conexión a la DB ${process.env.MYSQL_DB} existosa`);

app.listen(process.env.PORT, () => console.log(`Escuchando en ${process.env.PORT}`));