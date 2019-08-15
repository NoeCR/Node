'use strict';

const crypto = require('../helpers/crypto');
const wrap = require ('express-async-wrap');
const _ = require ('lodash');
const jwt = require('jsonwebtoken');
global.config = require(`../../api/config/${process.env.NODE_ENV}`);

module.exports.AuthenticateUser = wrap (async (user, password) => {
    try{
        const result = await crypto.comparePasswords( password, user.password )
            .then( res => {
                return res;
            })
            .catch( err => {
                return Promise.reject(err);
            })
    
        if ( result ) {
            const token = await module.exports.createToken(user);
            // console.log('TOKEN\n', token);
            // const hasToken = crypto.simpleHash( token );
            // console.log('HAS TOKEN\n', hasToken);
            // const recoveryToken = crypto.verifyHash(hasToken);
            // console.log('VERIFY TOKEN\n', recoveryToken);
            return Promise.resolve( token );
        } else {
            return Promise.resolve( null );
        }
    }catch(ex) {
        return Promise.reject(ex);
    }
});

module.exports.createToken = wrap (async ( data ) => {
    try{
        const values = _.pick(data, ['id', 'name', 'email', 'role']);
        const TOKEN = await jwt.sign(values, global.config.secrets, { expiresIn: 14400 });
        return Promise.resolve(TOKEN);
    }catch(ex) {
        return Promise.reject(ex);
    }
});
module.exports.verifyToken = wrap (async ( token ) => { 
    try{
        const response = await jwt.verify( token, global.config.secrets, ( err, decoded ) =>{
            if( err ) {
                return Promise.resolve({
                    ok: false,
                    message: 'Invalid Token'
                });
            }
            
            return Promise.resolve({
                ok: true,
                message: 'Token valid',
                data: decoded
            });
            
        })
        return response;
    }catch( ex ){
        return Promise.reject(ex);
    }
});