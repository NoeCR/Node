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

    res.status (200).send (data);
  }
  catch (ex) {
    res.status(400).json({
        ok: false,
        message: 'controllers.user.get'
    })
  }
});


// ----------------------------------------------------------------------------
// getUserById
// ----------------------------------------------------------------------------
module.exports.getUserById = wrap (async (req, res) => {
  try {
    let UserId = req.swagger.params.id.value;
    const data = await model.user.getUserById(UserId);
    res.status (200).send (data.res);
  }
  catch (ex) {
    res.boom (ex);

    Logger.instance().error (ex, { c: 'controllers.User.getUserById' });
  }
});


// ----------------------------------------------------------------------------
// getUsersByCategory
// ----------------------------------------------------------------------------
module.exports.getUsersByCategory = wrap (async (req, res) => {
  try {
    let categoryId = req.swagger.params.id.value;
    const data = await model.User.getUsersByCategory(categoryId,
      {
        ...(req.swagger.params.exclude.value && { exclude: req.swagger.params.exclude.value }),
        ...(req.swagger.params.offset.value && { offset: req.swagger.params.offset.value }),
        ...(req.swagger.params.limit.value && { limit: req.swagger.params.limit.value }),
        ...(req.swagger.params.sort.value && { sort: JSON.parse(req.swagger.params.sort.value) })

      },
    );
    const userPref = {};
    for (let i = 0; i < data.data.length; i++) {
      if (!userPref[data.data[i].userId]) {
        const preferences = await model.preferences.getPreferences(JSON.stringify({ userId: data.data[i].userId }));
        if (preferences.data)
          userPref[data.data[i].userId] = preferences.data[0];
      }
      data.data[i].userPreferences = userPref[data.data[i].userId] || {};
    }
    res.status (200).send (data);
  }
  catch (ex) {
    res.boom (ex);

    Logger.instance().error (ex, { c: 'controllers.User.getUserByCategory' });
  }
});

// ----------------------------------------------------------------------------
// add
// ----------------------------------------------------------------------------
module.exports.add = wrap (async (req, res) => {
  try {
    console.log( req.body );
    const success = await model.user.addUser ( req.body );
    res.status (200).send ({ success });
  }
  catch (ex) {
    console.error('Error: user.add.controller -> ', ex)

  }
});

module.exports.delete = wrap (async (req, res) => {
  try {
    const result = await model.User.deleteUser (req.swagger.params.id.value);

    if (result)
      return res.status (200).send ({ result: true });

    res.boom (boom.notFound ('User not found'));
  }
  catch (ex) {
    res.boom (ex);

    Logger.instance().error (ex, { c: 'controllers.User.delete' });
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