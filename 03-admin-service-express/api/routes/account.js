'use strict';
const router = require('express').Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
// ============================================================
// Login de usuarios
// ============================================================
router.post('/login', ( req, res, next ) => {

    userController.getUsersByEmail(req, res)
        .then( result => {
            authController.AuthenticateUser( result, req.body.password)
                .then( resp => {
                    if ( resp ) {
                        res.status(200).send({
                            ok: true,
                            message: 'User logued successfully',
                            token: resp
                        }) 
                    }else {
                        res.send(401, 'Unauthorized')
                    }
                })
                .catch( err => {
                        res.status(401).send({
                            ok: false,
                            message: 'Error. account.login User unauthorized\n' + err 
                        }) 
                    }
                )
        })
        .catch( ex => {
            res.status(400).send({
                ok: false,
                message: 'Error. account.login\nUser not found' 
            })        
        })
   
});

module.exports = router;