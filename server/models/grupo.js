const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let grupoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del grupo es necesario'] },
    descripcion: { type: String },
    audit: {
        created: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        modified: { type: Date },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        deleted: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    }
});

module.exports = mongoose.model('Grupo', grupoSchema);