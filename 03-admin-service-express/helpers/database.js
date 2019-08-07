'use strict';

const mongoose = require ('mongoose');

// ----------------------------------------------------------------------------
// connect
// ----------------------------------------------------------------------------
module.exports.connect = ( uri ) => {
  return new Promise ((resolve, reject) => {
    mongoose.connect (uri, { useNewUrlParser: true });
    mongoose.set ('useCreateIndex', true);

    mongoose.connection.on ('connected', function () {
        console.log('Conection establish');
        resolve();
    });

    mongoose.connection.on ('error', err => {
      reject (err);
    });

    mongoose.connection.on ('disconnected', function () {
      console.warn ('Lost mongoose connection', { c: 'database.connect' });
    });
  });
};

// ----------------------------------------------------------------------------
// close
// ----------------------------------------------------------------------------
module.exports.close = () => {
  return new Promise ((resolve) => {
    mongoose.connection.close (resolve);
  });
};

// ----------------------------------------------------------------------------
// insert
// ----------------------------------------------------------------------------
module.exports.insert = (name, document) => {
  return new Promise ((resolve, reject) => {
    mongoose.model (name).create (document, (err, data) => {
      if (err) {
        if ((err.code === 11000) || (err.code === 11001))
          return reject (boom.conflict ('Duplicated key'));

        return reject (err);
      }

      resolve (data);
    });
  });
};

// ----------------------------------------------------------------------------
// find
// ----------------------------------------------------------------------------
module.exports.find = (name, filter, projection, options) => {
  return new Promise ((resolve, reject) => {
    mongoose.model (name).find (filter, projection, options, (err, data) => {
      if (err)
        return reject (err);

      resolve (data);
    });
  });
};

// ----------------------------------------------------------------------------
// paginate
// ----------------------------------------------------------------------------
module.exports.paginate = (name, query, opts) => {
  return new Promise ((resolve, reject) => {
    mongoose.model (name).paginate (query, opts, (err, data) => {
      if (err)
        return reject (err);

      resolve (data);
    });
  });
};

// ----------------------------------------------------------------------------
// delete
// ----------------------------------------------------------------------------
module.exports.delete = (name, filter) => {
  return new Promise ((resolve, reject) => {
    mongoose.model (name).deleteMany (filter, (err, data) => {
      if (err)
        return reject (err);

      resolve (data.n);
    });
  });
};

// ----------------------------------------------------------------------------
// update
// ----------------------------------------------------------------------------
module.exports.update = (name, condition, update, opts) => {
  return new Promise ((resolve, reject) => {
    mongoose.model (name).updateMany (condition, update, opts || {}, (err, numAffected) => {
      if (err) {
        if ((err.code === 11000) || (err.code === 11001))
          return reject (boom.conflict ('Duplicated key'));

        return reject (err);
      }

      resolve (numAffected.n);
    });
  });
};


// ----------------------------------------------------------------------------
// defineSchema
// ----------------------------------------------------------------------------
module.exports.defineSchema = fileName => {
  module.exports.Names = require (fileName).Names;
};