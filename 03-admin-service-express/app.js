'use strict';
// Requires
const express = require('express');
const database = require('./helpers/database');
global.config = require(`./config/${process.env.NODE_ENV}`);

// Inicializar variables
let app = express();
const port = global.config.port || 3000;

// Database conection
database.connect ( global.config.database.connectionString );
// Rutes
app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/user'));


// Listen request
app.listen(port, () => console.log(`Express server listen http://localhost:${port} \x1b[32monline\x1b[0m`));

