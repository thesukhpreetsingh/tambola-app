require('dotenv').config()
var createError = require('http-errors');
var express = require('express');

var http = require('http');

var path = require('path');

var bodyParser      =   require("body-parser");

var mongoose        =   require('mongoose');
var session         =   require('express-session');
var MongoStore = require('connect-mongo')

var logger = require('morgan');

var indexRouter = require('./routes/index');
var ticketRouter = require('./routes/tickets');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true, parameterLimit:5000}));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.databaseURL,{useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("App.js mongoose.connect error",error));
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	console.log("App is connected to DB", db.name)
});
mongoose.Promise = global.Promise;

app.use(session({
    secret: 'safas32dda3kuf5f',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      // mongoUrl:"mongodb://localhost:27017/tambola",
      ttl: 1 * 6 * 60 * 60,  //ttl: 14 * 24 * 60 * 60, //days * hours * minutes * seconds
      autoRemove: 'native' // Default
    })
}));

app.use('/', indexRouter);
app.use("/ticket",ticketRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app);

var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server running on port ' + port);
});