/**
 * Created by mats on 30.04.15.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

// MongoDB
mongoose.connect('mongodb://localhost/kramster');

// Express
var app = express();
app.use(express.static(__dirname + '/../client/'));
app.use('/bower_components', express.static(__dirname + '/../bower_components/'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/api', require('./routes/api'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/stats', require('./routes/stats'));

app.use(function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// Start server
app.listen(8000, '127.0.0.1');
console.log('Server is running on port 8000');
