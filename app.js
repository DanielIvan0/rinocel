// Initializing modules
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const fs = require('fs');

global.utils = {};

const log = error => {
    if (process.env.NODE_ENV !== 'production') console.dir(error);
    else fs.writeFile('./logs.txt', Object.toString(error));
}

global.utils.log = log;

// Middleware's setup
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Error handler
app.use((err, req, res, next) => {
    const { code = 500, message } = err;
    
    log(err)
    res.status(code).json({
        code,
        message,
        ok: false,
    });
});

// Creating server
app.listen(port, () => console.log(`Server up and running on port ${port}`));