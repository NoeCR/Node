/* eslint-disable switch-colon-spacing */
'use strict';
const fs = require ('fs');
const path = require ('path');
const wrap = require ('express-async-wrap');
const model = {
  user: require ('../models/user'),
};

module.exports.get = wrap (async (req, res) => {
  try {
    const data = await model.user.getUser();

    return Promise.resolve(data)
  }
  catch (ex) {
    return Promise.reject (ex);
  }
});


// ----------------------------------------------------------------------------
// getUserById
// ----------------------------------------------------------------------------
module.exports.getUserById = wrap (async (req, res) => {
  try {
    let UserId = req.params.id;
    const data = await model.user.getUserById(UserId);
    res.status (200).send (data.res);
  }
  catch (ex) {
    return Promise.reject(ex);
  }
});


// ----------------------------------------------------------------------------
// getUsersByEmail
// ----------------------------------------------------------------------------
module.exports.getUsersByEmail = wrap (async (req, res) => {
  try {
    let email = req.body.email;
    const data = await model.user.getUserByEmail( email );
    return Promise.resolve(data.res);
  }
  catch (ex) {
    return Promise.reject(ex);
  }
});

// ----------------------------------------------------------------------------
// add
// ----------------------------------------------------------------------------
module.exports.add = wrap (async (req, res) => {
  try {
    const data = await model.user.addUser ( req.body );

    return Promise.resolve (data);
  }
  catch (ex) {
    return Promise.reject(ex);
  }
});

// ----------------------------------------------------------------------------
// put
// ----------------------------------------------------------------------------
module.exports.put = wrap (async (req, res) => {
  try {
    // Obtener el id de usuario a actualizar

    const data = await model.user.updateUser ( req.body );

    return Promise.resolve (data);
  }
  catch (ex) {
    console.error('Error: user.add.controller -> ', ex)

  }
});
// ----------------------------------------------------------------------------
// delete
// ----------------------------------------------------------------------------
module.exports.delete = wrap (async (req, res) => {
  try {
    const result = await model.user.deleteUser ( req.body.id );
    if (result)
    return Promise.resolve ( true );

    res.send(400, 'User not found');
  }
  catch (ex) {
    res.send(500, `Error: controllers.user.delete: \n ${ex}`);
  }
});

module.exports.getJsonSchema = wrap (async (req, res) => {
  try {
    const name = `../models/jsonschema/Userfilter.json`;
    const schema = JSON.parse (fs.readFileSync (path.join (__dirname, name), 'utf-8'));

    res.status (200).send (schema);
  }
  catch (ex) {
    res.boom (ex);

    Logger.instance().error (ex, { c: 'controller.User.getJsonSchema' });
  }
});