const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimiter = require('./middleware/rateLimiter');
const helmet = require('helmet');
const logger = require('./middleware/logger')
const cloudflare = require('cloudflare-express');

const dotenv = require('dotenv');
dotenv.config();

const redis = require('redis');
const redisClient = redis.createClient({host: process.env.REDISHOST,port: 6379});
const redisStore = require('connect-redis')(session);

//route list
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const topRouter = require('./routes/top');
const highestRouter = require('./routes/highest');
const adminRouter = require('./routes/admin');
const devRouter = require('./routes/dev');
//

require('./models/ingame'); //setup ingame db

const app = express();
app.use(helmet());
app.use(rateLimiter);
app.use(cloudflare.restore());

//setup mongo
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURI, {
  auth: {
      user: process.env.MONGOUSER,
      password: process.env.MONGOPASS
  },
  useNewUrlParser: true 
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
///


app.use(express.json({ limit: '300kb' })); //limit json body

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup session
app.use(session({
  secret:process.env.SECRET,
  key: 'redisStore', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  },
  store: new redisStore({ host: process.env.REDISHOST, port: 6379, client: redisClient, ttl: 86400 }),
}));

var winston = require('./middleware/logger');
const morgan = require("morgan");
app.use(morgan(':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" - :response-time ms', { stream: winston.stream }));

function requireHTTPS(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//load routes
app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/highest', highestRouter);
app.use('/top', topRouter);
app.use('/admin', adminRouter);
app.use('/dev', devRouter);

app.use(function(req, res, next) {
  res.status(404).redirect('/')
});

app.use(function(err, req, res, next) {
  logger.info("test")
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

