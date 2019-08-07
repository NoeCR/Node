'use strict';

const fs = require ('fs');
const Ajv = require ('ajv');
const uuid = require ('uuid/v4');
const database = require ('../helpers/database');

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
        id: uuid (),
      };
  
      const res = await database.insert ( doc );
  
      return res === 1;
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
      const res = await database.findOne ( id );
      if (res.length === 0 )
        return Promise.resolve (null);
  
      return Promise.resolve ({ res });
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};

// ----------------------------------------------------------------------------
// get Users
// ----------------------------------------------------------------------------
module.exports.getUsers = async ( filter ) => {
    try {
      if (!validate.filter (filter))
        throw new Error(`Invalid JSON format (filter): ${JSON.stringify (validate.filter.errors)}`);
  

  
    console.log('Filtro preparado para enviar al metodo pagiante: ', filter);
      const res = await database.paginate ( );
  
      return Promise.resolve ({ total: res.total, data: res.docs });
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};
 
// ----------------------------------------------------------------------------
// Delete user
// ----------------------------------------------------------------------------
module.exports.deleteUser = async id => {
    try {
      return Promise.resolve (await database.delete ( { id: id.trim() } ));
    }
    catch (ex) {
      return Promise.reject (ex);
    }
};