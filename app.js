// Initializing modules
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require('body-parser');
const path = require('path');

// Middleware's setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Error handler
app.use((err, req, res, next) => {
    const { code = 500, message } = err;
    
    console.error(err);
    res.status(code).json({
        code,
        message,
        ok: false,
    });
});

// Creating server
app.listen(port, () => console.log(`Server up and running on port ${port}`));