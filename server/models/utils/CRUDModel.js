const Audit = require('./auditFieldsUtil');

let CRUDModel = {
    tableName: '',
    columns: [],
    auditFieds: ['created', 'createdBy', 'modified', 'modifiedBy', 'deleted', 'deletedBy'],

    genericQuery: () => {
        var query = 'select ?? from ?? where deleted is null ';
        return query;
    },

    genericQueryById: () => {
        var query = 'select ?? from ?? where id = ? and deleted is null ';
        return query;
    },

    genericRawQuery: () => {
        var query = 'select ?? from ?? where 1=1 ';
        return query;
    },

    genericRawQueryById: () => {
        var query = 'select ?? from ?? where id = ? ';
        return query;
    },

    getAll: (withAuditFields, callback) => {
        var self = this;
        var columns = [].concat(self.columns);
        if (!callback) {
            callback = withAuditFields;
        } else if (withAuditFields) {
            columns = columns.concat(self.auditFieds);
        }

        self.connection.query(self.genericQuery(), [columns, self.tableName], function(err, result) {
            return callback(err, result);
        });
    },

    get: (id, withAuditFields, callback) => {
        var self = this;
        var columns = [].concat(self.columns);
        if (!callback) {
            callback = withAuditFields;
        } else if (withAuditFields) {
            columns = columns.concat(self.auditFieds);
        }
        self.connection.query(self.genericQueryById(), [columns, self.tableName, id], function(err, result) {
            return callback(err, result[0]);
        });
    },

    getRaw: (id, withAuditFields, callback) => {
        var self = this;
        var columns = [].concat(self.columns);
        if (!callback) {
            callback = withAuditFields;
        } else if (withAuditFields) {
            columns = columns.concat(self.auditFieds);
        }

        self.connection.query(self.genericRawQueryById(), [columns, self.tableName, id], function(err, result) {
            return callback(err, result[0]);
        });
    },

    getAllRaw: (withAuditFields, callback) => {
        var self = this;
        var columns = [].concat(self.columns);
        if (!callback) {
            callback = withAuditFields;
        } else if (withAuditFields) {
            columns = columns.concat(self.auditFieds);
        }

        self.connection.query(self.genericRawQuery(), [columns, self.tableName], function(err, result) {
            return callback(err, result);
        });
    },

    create: (newData, userId, callback) => {
        var self = this;
        self.connection.query('insert into ?? set ?', [self.tableName, Audit.insert(newData, userId)], function(err, result) {
            return callback(err, (result ? result.insertId : null));
        });
    },

    update: (id, updatedData, userId, callback) => {
        var self = this;
        self.connection.query('update ?? set ? where id = ?', [self.tableName, Audit.update(updatedData, userId), id], function(err, result) {
            return callback(err, (result ? result.affectedRows : null));
        });
    },

    del: (id, userId, callback) => {
        var self = this;
        if (!id) return callback(null, 0);

        self.connection.query('update ?? set ? where id = ?', [self.tableName, Audit.delete(id, userId), id], function(err, result) {
            return callback(err, (result ? result.affectedRows : null));
        });
    }

}

module.exports = CRUDModel;