'use strict';

const uuid = require ('uuid/v4');
const normalize = require ('normalize-email');
const wrap = require ('express-async-wrap');
const model = { user: require ('../models/user.js') };
// const crypto = require ('../helpers/crypto.js');


// ----------------------------------------------------------------------------
// addNewUser
// id: string -> required and autogenerated by uuid
// name: string -> required
// email: string -> unique and required
// password: string -> required and encrypted
// img: string -> optional
// role: -> required and this default value should be exist in a list (enum)
// google: boolean -> optional
// status: string -> enabled : disabled
// createdat: Date -> required -> take the date when the user is registered
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// add
// ----------------------------------------------------------------------------
module.exports.add = wrap (async (req, res) => {
  try {
    console.log(req.swagger.params.data.value);
    const success = await model.user.addUser (req.swagger.params.data.value);

    res.status (200).send ( success );
  }
  catch (ex) {
    res.status(400).json({
      ok: false,
      message: 'Error in controllers.user.add',
      ex
    })
  }
});


// ----------------------------------------------------------------------------
// get
// ----------------------------------------------------------------------------
module.exports.get =  wrap (async (req, res) => {
  try{
    const response = await model.user.getUsers();
    res.status (200).send ({
      data: response
    });
  }
  catch(ex) {
    res.status(400).json({
      ok: false,
      message: 'Error in controllers.user.get',
      ex
    })
  }
});
// ----------------------------------------------------------------------------
// getUserById
// ----------------------------------------------------------------------------
module.exports.getUserById = wrap (async (req, res) => {
  try{
    const response = await model.user.getUserById( req.swagger.params.id.value );
    res.status (200).send ({
      data: response
    });
  }
  catch(ex) {
    res.status(400).json({
      ok: false,
      message: 'Error in controllers.user.getUserById',
      ex
    })
  }
});
// ----------------------------------------------------------------------------
// update
// ----------------------------------------------------------------------------
module.exports.update = wrap (async (req, res) => {
  try{
    const response = await model.user.updateUserById( req.swagger.params.id.value, req.swagger.params.data.value );
    console.log('Response: ', response);
    res.status (200).send ( response );
  }
  catch(ex) {
    res.status(400).json({
      ok: false,
      message: 'Error in controllers.user.delete',
      ex
    })
  }
});
// ----------------------------------------------------------------------------
// delete
// ----------------------------------------------------------------------------
module.exports.delete = wrap (async (req, res) => {
  try{
  const response = await model.user.deleteUserById( req.swagger.params.id.value );
  console.log('Response: ', response);
  res.status (200).send ({
    ok: true,
    message: 'User deleted succesfuly'
  });
  }
  catch(ex) {
    res.status(400).json({
      ok: false,
      message: 'Error in controllers.user.delete',
      ex
    })
  }
});