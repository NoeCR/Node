'use strict';

const bcrypt = require ('bcryptjs');
const crypto = require ('crypto');
const assert = require ('assert');


// ----------------------------------------------------------------------------
// hashPassword
// ----------------------------------------------------------------------------
module.exports.hashPassword = async password => {
  try {
    return Promise.resolve (await bcrypt.hash (password, 10));
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// comparePasswords
// ----------------------------------------------------------------------------
module.exports.comparePasswords = async (pwd, hash) => {
  try {
    return Promise.resolve (await bcrypt.compareSync (pwd, hash));
  }
  catch (ex) {
    return Promise.reject (ex);
  }
};

// ----------------------------------------------------------------------------
// simpleHash
// ----------------------------------------------------------------------------
module.exports.simpleHash = value => {
  const sha1 = crypto.createHash ('sha1');
  sha1.update (value);
  return sha1.digest ('hex');
};

// ----------------------------------------------------------------------------
// Veriry simpleHash
// ----------------------------------------------------------------------------
module.exports.verifyHash = value => {
  const sha1 = crypto.verify ('sha1', value);
  sha1.update (value);
  return sha1.digest ('hex');
};

// ----------------------------------------------------------------------------
// randomHexString
// ----------------------------------------------------------------------------
module.exports.randomHexString = size => {
  return crypto.randomBytes (Math.ceil (size / 2)).toString('hex').substr (0, size);
};

// ----------------------------------------------------------------------------
// Aes128
// ----------------------------------------------------------------------------
module.exports.Aes128 = class {
  // --------------------------------------------------------------------------
  // encrypt
  // --------------------------------------------------------------------------
  static encrypt (data, key) {
    const iv = crypto.randomBytes (16);

    const cipher = crypto.createCipheriv ('aes-128-cbc', module.exports.Aes128.key (key), iv);

    const enc = cipher.update (data, 'utf8', 'binary') + cipher.final ('binary');

    return `0:${Buffer.from (enc, 'binary').toString ('base64')}:${Buffer.from (iv, 'binary').toString ('base64')}`;
  }

  // --------------------------------------------------------------------------
  // decrypt
  // --------------------------------------------------------------------------
  static decrypt (data, key) {
    const [ version, encData, iv ] = data.split (':');

    assert (version, '0');

    const decipher = crypto.createDecipheriv (
      'aes-128-cbc',
      module.exports.Aes128.key (key),
      Buffer.from (iv, 'base64')
    );

    const binData = Buffer.from (encData, 'base64').toString ('binary');

    return decipher.update (binData, 'binary', 'utf8') + decipher.final ('utf8');
  }

  // --------------------------------------------------------------------------
  // key
  // --------------------------------------------------------------------------
  static key (key) {
    if (key.length < 16)
      key += key;

    return Buffer.from (key.substr (0, 16));
  }
};