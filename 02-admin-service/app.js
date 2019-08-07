'use strict';

var SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require ('swagger-ui-express');
const YAML = require ('yamljs');
const express = require ('express');
const cors = require('cors');
const helmet = require('helmet');
const version = require ('./package.json').version;
global.config = require(`./config/${process.env.NODE_ENV}`);
var firebase = require("firebase");
// Exportar la configuración de la DB para usar databse o firestore
const db = firebase.initializeApp(global.config.fireConfig);


const app = express ();

app.use (helmet());
app.use (cors());

app.use ('/doc', SwaggerUi.serve, (req, res, next) => {
 /*  if (global.context.config.disableDoc) {
    next();
  }
  else { */
    const swaggerDoc = YAML.load ('./api/swagger/swagger.yaml');
    swaggerDoc.host = req.get('host');
    swaggerDoc.schemes = [ req.protocol ];
    swaggerDoc.info.version = version;
    SwaggerUi.setup (swaggerDoc) (req, res);
 // }
});

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/alive']) {
    console.log(`Server listening at http://localhost:${ port }`, ' \x1b[32monline\x1b[0m');
    console.log(`Test API at http://localhost:${ port }/doc`, ' \x1b[32monline\x1b[0m');
  }
});

module.exports = app; // for testing
