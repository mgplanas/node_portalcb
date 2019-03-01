const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let gerenciaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de la Gerencia es necesario'] },
    sigla: { type: String },
    audit: {
        created: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        modified: { type: Date },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        deleted: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    }
});

module.exports = mongoose.model('Gerencia', gerenciaSchema);