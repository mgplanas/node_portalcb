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
// Base de Datos MYSQL
// =========================
process.env.MYSQL_CON_LIMIT = process.env.MYSQL_CON_LIMIT || 100;
process.env.MYSQL_DATESTRINGS = process.env.MYSQL_DATESTRINGS || 'false';
process.env.MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
process.env.MYSQL_USER = process.env.MYSQL_USER || 'portaldbuser';
process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'portaldbuser123';
process.env.MYSQL_DB = process.env.MYSQL_DB || 'portaldb';


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