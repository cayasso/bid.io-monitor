/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io');

app.configure(function(){
  app.engine('html', require('ejs').renderFile);
  app.set('port', process.env.PORT || 3002);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set("view options", { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/client')));
  //app.use('/docs', express.static(path.join(__dirname, '/../docs')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

exports.express = express;
exports.app = app;
exports.io = io;
