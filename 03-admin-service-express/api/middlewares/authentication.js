'use strict';
const auth = require('../controllers/auth');

exports.tokenVerify = async ( req, res, next ) => {
    const token = req.query.token;
    const isValid = await auth.verifyToken( token );
    if( !isValid.ok )
        return res.status(401).send(isValid);

    req.user = isValid.data;
    
    next();
}