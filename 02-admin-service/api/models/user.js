'use strict';

const fs = require ('fs');
const Ajv = require ('ajv');
const path = require ('path');
const uuid = require ('uuid/v4');
const database = require ('../helpers/database');
const name = '/users/';

const ajv = new Ajv();
const loadJsonSchema = file => JSON.parse (fs.readFileSync (path.join (__dirname, `./jsonschema/${file}`), 'utf-8'));
const validate = {
  filter: ajv.compile (loadJsonSchema ('userfilter.json')),
};


// ----------------------------------------------------------------------------
// addNewUser
// ----------------------------------------------------------------------------
module.exports.addUser = async data => {
    try {
      
      const doc = {
        ...data,
        id: uuid ()
      };
      console.log('Entra en el modelo con la data: ', doc);
      const res = await database.insert ( name, doc );
      console.log('Response to database helper', res);
      return Promise.resolve (res);
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};

// ----------------------------------------------------------------------------
// Find user by id
// ----------------------------------------------------------------------------
module.exports.getUserById = async ( id ) => {
    try {
      const res = await database.findOne ( name, id );
      if (res.length === 0 )
        return Promise.resolve (null);
  
      return Promise.resolve ( res );
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};

// ----------------------------------------------------------------------------
// get Users
// ----------------------------------------------------------------------------
module.exports.getUsers = async ( ) => {
  try {
    const res = await database.getAll ( name );
    if (res.length === 0 )
      return Promise.resolve (null);

    return Promise.resolve ( res );
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};
 
// ----------------------------------------------------------------------------
// Update user by ID
// ----------------------------------------------------------------------------
module.exports.updateUserById = async (id, data) => {
  try {
    return Promise.resolve (await database.update ( name, { id: id.trim() }, data ));
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// Delete user by ID
// ----------------------------------------------------------------------------
module.exports.deleteUserById = async id => {
    try {
      return Promise.resolve (await database.delete ( name, { id: id.trim() } ));
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};