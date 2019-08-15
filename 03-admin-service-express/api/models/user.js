/* eslint-disable no-unused-vars */
/* eslint-disable switch-colon-spacing */
'use strict';

const fs = require ('fs');
const path = require ('path');
const Ajv = require ('ajv');
const uuid = require ('uuid/v4');
const database = require ('../helpers/database');
const normalize = require ('normalize-email');
const crypto = require('../helpers/crypto');

const ajv = new Ajv();
const loadJsonSchema = file => JSON.parse (fs.readFileSync (path.join (__dirname, `./jsonschema/${file}`), 'utf-8'));
const validate = {
  filter: ajv.compile (loadJsonSchema ('userfilter.json')),
};

// ----------------------------------------------------------------------------
// getUser
// ----------------------------------------------------------------------------
module.exports.getUser = async (filter, options={}) => {
  try {

    const select = { __v: 0, _id: 0, status: 0, password: 0 };
    for (let k of options.exclude || [])
      select[k] = 0;

    const res = await database.paginate (database.Names.User, null, { select } );

    return Promise.resolve ({ total: res.total, data: res.docs });
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// getUserByEmail
// ----------------------------------------------------------------------------
module.exports.getUserByEmail = async ( email ) => {
  try {
    const res = await database.findOne ( database.Names.User, { email }, { __v: 0, _id: 0, status: 0, rol: 0 } );
    if (res.length === 0 )
      return Promise.resolve (null);

    return Promise.resolve ({ res });
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// addUser
// ----------------------------------------------------------------------------
module.exports.addUser = async data => {
  try {
    
    const doc = {
      ...data,
      email: normalize (data.email),
      password: await crypto.hashPassword( data.password ),
      id: uuid ()
    };
    // const res = await database.update (database.Names.User, doc, {}, { upsert: true, setDefaultsOnInsert: true });
    const res = await database.insert (database.Names.User, doc );

    return Promise.resolve(res);
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// updateUser
// ----------------------------------------------------------------------------
module.exports.updateUser = async data => {
  try {
    
    const id = data.id;
    delete data.id;

    const doc = {
      ...data,
    };
    // const res = await database.update (database.Names.User, doc, {}, { upsert: true, setDefaultsOnInsert: true });
    const res = await database.update (
        database.Names.User, 
        { id }, 
        doc, 
        { upsert: true, setDefaultsOnInsert: true });

    return res === 1;
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};
// ----------------------------------------------------------------------------
// deleteUser
// ----------------------------------------------------------------------------
module.exports.deleteUser = async id => {
  try {
    return Promise.resolve (await database.delete (database.Names.User, { id: id.trim() }));
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};
