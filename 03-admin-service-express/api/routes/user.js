const router = require('express').Router();
var bodyParser = require('body-parser');
const userController = require('../controllers/user');

const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', ( req, res, next ) => {

    userController.get(req, res)
    .then( res => {
        console.log('Respuesta al metodo GET de Usuario');
        res.status(200).json({
            ok: true,
            data: res.data
        })
    })
    .catch( err => {
        console.log('Error: user.get -> ', err);
    })
});

router.post('/add', urlencodedParser, ( req, res, next ) => {
    userController.add( req, res )
        .then( res => {
            console.log('Response: ', res);
        })
        .catch( err => console.log('Error: user.add -> ', err ) )
        .finally( console.log('Process finish! ') )
});
module.exports = router;