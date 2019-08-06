'use strict';

var SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require ('swagger-ui-express');
const YAML = require ('yamljs');
const express = require ('express');
const cors = require('cors');
const helmet = require('helmet');
const version = require ('./package.json').version;

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
    console.log(`Server listening at http://localhost:${ port }`);
  }
});
