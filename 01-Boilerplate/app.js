'use strict';

const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require ('swagger-ui-express');
const YAML = require ('yamljs');
const app = require('express')();
const helmet = require ('helmet');
const version = require ('./package.json').version;

module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};


app.use (helmet());

app.use ('/doc', SwaggerUi.serve, (req, res) => {
  const swaggerDoc = YAML.load ('./api/swagger/swagger.yaml');
  swaggerDoc.host = req.get('host');
  swaggerDoc.schemes = [ req.protocol ];
  swaggerDoc.info.version = version;
  SwaggerUi.setup (swaggerDoc) (req, res);
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  
  // install middleware
  swaggerExpress.register(app);
  
  const port = process.env.PORT || 8080;
  app.listen(port);
  console.log(swaggerExpress.runner.swagger.host);
  const host = swaggerExpress.runner.swagger.host

  console.log('Web server listening at: %s', host );
  console.log('Browse your REST API at %s%s', host, '/doc');
  // app.emit('Server up!');
  // const baseUrl = app.get('url').replace(/\/$/, '');
  // console.log('Web server listening at: %s', baseUrl);
  // console.log('Browse your REST API at %s%s', baseUrl, '/doc');
});
