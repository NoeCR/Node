'use strict';
// Requires
const express = require('express');
const database = require('./api/helpers/database');
global.config = require(`./api/config/${process.env.NODE_ENV}`);
const path = require ('path');
const version = require ('./package.json').version;
const bodyParser = require('body-parser');

// Inicializar variables
let app = express();
// app.use(express.urlencoded());
const port = global.config.port || 3000;


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Database conection 
database.connect ( global.config.database.connectionString );
database.defineSchema (path.join (__dirname, 'api/models/mongoose'));
// Rutes
app.use('/', require('./api/routes/index'));
app.use('/user', require('./api/routes/user'));


// Listen request
app.listen(port, () => console.log(`Express server listen http://localhost:${port} \x1b[32monline\x1b[0m`));

