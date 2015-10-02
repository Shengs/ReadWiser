'use strict';

var app = require('./index');
var http = require('http');

var express = require('express');
var kraken = require('kraken-js');
var db = require('./lib/db');
var flash = require('connect-flash');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        db.config(config.get('databaseConfig'));
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));

// Setup Flash
app.use(flash());
app.use(function (req,res,next) {
    res.locals.messages = require('express-messages')(req,res);
    next();
});

app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});

// Setup Server
var server;
/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

