'use strict';
const _ = require('lodash');
// ----------------------------------------------------------------------------
// Filter data of user returned after create
// ----------------------------------------------------------------------------
module.exports.filterUserData = ( data ) => {
    const includes = [ 'id', 'name', 'email'];
    return _.pick( data, includes );
}