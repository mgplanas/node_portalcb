// =========================
// PUERTO
// =========================
process.env.PORT = process.env.PORT || 3000;

// =========================
// Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';


// =========================
// Vencimiento del token
// =========================
// 60 seg * 60 min * 24 hs * 30 dias
process.env.CADUCIDAD_TOKEN = '48h';
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =========================
// SECRET SIGNATURE TOKEN
// =========================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-de-desarrollo';


// =========================
// Base de Datos
// =========================
let urlDB;
if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/portaldb';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;


// ==============================================================
// LDAP AUTH
// ==============================================================
process.env.USERNAME_FIELD = 'username';
process.env.PASSWORD_FIELD = 'password';

// SERVER
process.env.SERVER_URL = process.env.SERVER_URL || 'ldap://srv-int-dc.arsat.com.ar:389';
process.env.SERVER_BIND_DN = process.env.SERVER_BIND_DN || "otrs";
process.env.SERVER_BIND_CREDENTIALS = process.env.SERVER_CREDENTIALS || "loncall840";
process.env.SERVER_SEARCH_BASE = 'DC=arsat,DC=com,DC=ar';
process.env.SERVER_SEARCH_FILTER = '(sAMAccountName={{username}})';