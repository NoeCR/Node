'use strict';

const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require ('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require ('yamljs');
const app = require('express')();
const helmet = require ('helmet');
const version = require ('./package.json').version;

module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};


app.use (helmet());

// app.use ('/doc', SwaggerUi.serve, (req, res) => {
//   const swaggerDoc = YAML.load ('./api/swagger/swagger.yaml');
//   swaggerDoc.host = req.get('host');
//   swaggerDoc.schemes = [ req.protocol ];
//   swaggerDoc.info.version = version;
//   SwaggerUi.setup (swaggerDoc) (req, res);
// });


// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'REST API for my App', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'This is the REST API for my product', // short description of the app
  },
  host: 'localhost:8080', // the host or url of the app
  basePath: '/api', // the basepath of your endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./api/swagger/*.yaml'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// use swagger-Ui-express for your app documentation endpoint
app.use('/doc', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));


  const port = process.env.PORT || 8080;
  app.listen(port);
// SwaggerExpress.create(config, function(err, swaggerExpress) {
//   if (err) { throw err; }

  
//   // install middleware
//   swaggerExpress.register(app);
  
//   const port = process.env.PORT || 8080;
//   app.listen(port);

//   const host = swaggerExpress.runner.swagger.host

//   console.log('Web server listening at: %s', host );
//   console.log('Browse your REST API at %s%s', host, '/doc');
// });
