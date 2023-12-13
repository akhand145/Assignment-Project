const app = require('express')();
app.use('/user', require('./user'));

module.exports = app;
