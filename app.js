const express = require('express'); //Framework to simplify coding
const morgan = require('morgan'); //Use for logging
const rateLimit = require('express-rate-limit'); //Prevent DDoS
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp'); //http param pollution

const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//1) Middleware stack

//Set security HTTP headers
app.use(helmet());

//Automactically logs request details to console
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Limit requests from same IP addr
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

//Body parser, Adds body to req object and accept max 10kb body
app.use(
  express.json({
    limit: '10kb',
  })
);

//Data Sanitization aganist NoSQL query injection
//Filters all $ signs and dots from req body, string, params
app.use(mongoSanitize());

//Data Sanitization aganist XSS
//Encode html characters into html entities
app.use(xssClean());

//Prevent parameter pollution
//https://stackoverflow.com/questions/30672500/what-is-http-parameter-pollution-attack-in-nodejs-expressjs/30672589
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving static files
app.use(express.static(`${__dirname}/public`));
//Our own middle ware
//Note that 3rd party middlewares like express.json() returns the very same callback used below (req,res,next => ....)

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes
//Mounting routers on a route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  //Handle unhandled route
  //if a param is passed into next(), express will treat it as an error object and automactically skip all the other middlewares and send it to the global error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//4) Error handling middleware
app.use(globalErrHandler);

module.exports = app;
