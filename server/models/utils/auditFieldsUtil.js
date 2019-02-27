/**
 * AUDIT FIELD UTIL
 * Módulo para setear los campos de auditoría antes de UPDATE/INSERT/DEL
 *  created 
 *  createdBy
 *  modified 
 *  modifiedBy 
 *  deleted 
 *  deletedBy 
 */
const moment = require('moment');

let insert = function(data, userId) {
    data.created = moment().format('YYYY-MM-DD hh:mm:ss');
    data.createdBy = userId;
    return data;
}

let update = function(data, userId) {
    data.modified = moment().format('YYYY-MM-DD hh:mm:ss');
    data.modifiedBy = userId;
    return data;
}

let del = function(id, userId) {
    var data = {};
    data.deleted = moment().format('YYYY-MM-DD hh:mm:ss');
    data.deletedBy = userId;
    return data;
}

module.exports = {
    insert: insert,
    update: update,
    delete: del
}