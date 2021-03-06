var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require("method-override");
var session = require("express-session");

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz-2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// AUTOLOGOUT basándose en el tiempo de inactividad
app.use(function(req, res, next) {
	if (req.session.user) {
		if (Date.now() - req.session.user.ultAct > 10000) {
			delete req.session.user;
			res.send("<html><head><script>alert('Su sesión ha caducado')</script><meta http-equiv='refresh' content='0; url='/'></head></html>");
		} else {
			req.session.user.ultAct = Date.now();
		}
	}
	next();
});

// Helpers dinámicos
app.use(function(req, res, next) {
	// guarda path en session.redir para despues de login
	if(!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
