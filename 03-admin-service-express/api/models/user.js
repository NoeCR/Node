/* eslint-disable no-unused-vars */
/* eslint-disable switch-colon-spacing */
'use strict';

const fs = require ('fs');
const path = require ('path');
const Ajv = require ('ajv');
const uuid = require ('uuid/v4');
const database = require ('../helpers/database');

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
    // filter = JSON.parse (filter || '{}');

    // if (!validate.filter (filter))
    //   throw console.error (`Invalid JSON format (filter): ${JSON.stringify (validate.filter.errors)}`);


    const select = { __v: 0, _id: 0, status: 0 };
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
// getUserById
// ----------------------------------------------------------------------------
module.exports.getUserById = async ( id ) => {
  try {
    const res = await database.findOne ( 'User', { id: id }, { __v: 0, _id: 0, status: 0 } );
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
      id: uuid ()
    };

    // console.log(database.defineSchema('User'));
    const res = await database.update (database.Names.User, doc, {}, { upsert: true, setDefaultsOnInsert: true });

    return res === 1;
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

module.exports.deleteUser = async id => {
  try {
    return Promise.resolve (await database.delete (database.Names.User, { id: id.trim() }));
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};
