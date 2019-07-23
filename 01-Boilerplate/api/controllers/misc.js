/* eslint-disable switch-colon-spacing */
'use strict';

// ----------------------------------------------------------------------------
// alive
// ----------------------------------------------------------------------------
module.exports.alive = (req, res) => {
  res.status (200).send ({ version: require ('../../package.json').version });
};