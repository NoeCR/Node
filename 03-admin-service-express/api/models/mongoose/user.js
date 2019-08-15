'use strict';

const mongoose = require ('mongoose');
const mongoosePaginate = require ('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['AMIN_ROLE', 'USER_ROLE'],
    MESSAGE: '{VALUE} o es un rol permitido'
};
const userSchema = new mongoose.Schema ({
    id: { type: String, index: true, unique: true, trim: true },
    name: { type: String, required: [ true, 'El nombre es necesario' ] },
    email: { type: String, unique: true, required: [ true, 'El correo es necesario' ] },
    password: { type: String, required: [ true, 'La contraseña es necesaria' ] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    status: { type: String, default: 'enabled' }
});

userSchema.plugin (mongoosePaginate);
userSchema.plugin (uniqueValidator, {message: '{PATH} debe ser único'});

mongoose.model ('User', userSchema);
// modules.exports = mongoose.model ('User', userSchema);
