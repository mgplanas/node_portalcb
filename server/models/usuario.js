const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    username: { type: String, required: [true, 'El usuario es necesario'], unique: true },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    cargo: { type: String },
    gerencia: { type: Schema.Types.ObjectId, ref: 'Gerencia' },
    grupo: { type: Schema.Types.ObjectId, ref: 'Grupo' },
    email: { type: String, required: [true, 'El correo es necesario'] },
    legajo: { type: Number },
    contacto: { type: String },
    img: { type: String, required: false },
    audit: {
        created: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        modified: { type: Date },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        deleted: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El correo debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);