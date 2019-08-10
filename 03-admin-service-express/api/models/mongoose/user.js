'use strict';

const mongoose = require ('mongoose');
const mongoosePaginate = require ('mongoose-paginate');

const userSchema = new mongoose.Schema ({
    id: { type: String, index: true, unique: true, trim: true },
    name: { type: String, required: [ true, 'El nombre es necesario' ] },
    email: { type: String, unique: true, required: [ true, 'El correo es necesario' ] },
    password: { type: String, required: [ true, 'La contraseña es necesaria' ] },
    img: { type: String, required: false },
    rol: { type: String, required: true, default: 'USER_ROLE' },
    status: { type: String, default: 'enabled' }
});

userSchema.plugin (mongoosePaginate);

mongoose.model ('User', userSchema);
// modules.exports = mongoose.model ('User', userSchema);
