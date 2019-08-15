const router = require('express').Router();
const userController = require('../controllers/user');


// ============================================================
// Obtener usuarios
// ============================================================
router.get('/', ( req, res, next ) => {

    userController.get(req, res)
    .then( response => {
        const  data = Object.assign({}, response, { userToken: req.user } );
        console.log(data);
        res.status(200).send( data )
    })
    .catch( err => {
        res.status(500).send({
            ok: false,
            message: 'Error in database.user.get ',
            errors: err
        })
    })
});
// ============================================================
// Crear nuevo usuario
// ============================================================
router.post('/add', ( req, res, next ) => {
    userController.add( req, res )
        .then( response => {
            res.status(200).send({
                user: response
            });            
        })
        .catch( err => {
            res.status(400).json({
                ok: false,
                message: 'Error in database.user.add: ',
                errors: err
            })
        })
        .finally( console.log('Process finish! ') )
});
// ============================================================
// Actualiza un usuario
// ============================================================
router.put('/update', ( req, res, next ) => {
    userController.put(req, res)
        .then( response => {
            res.status(200).send({
                ok: true,
                message: 'User update successfully!'
            });
        })
        .catch( err => {
            res.status(500).json({
                ok: false,
                message: 'Error in database.user.put: ',
                errors: err
            })
        })
});
// ============================================================
// Elimina un usuario
// ============================================================
router.delete('/delete', ( req, res, next ) => {
    userController.delete( req, res )
        .then( response => {
            res.status(200).send({
                ok: true,
                message: 'User delete successfully'
            });            
        })
        .catch( err => {
            res.status(500).json({
                ok: false,
                message: 'Error in routes.user.delete',
                errors: err
            })
        })
});
module.exports = router;