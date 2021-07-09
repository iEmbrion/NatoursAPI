const express = require('express'); //Framework to simplify coding
const morgan = require('morgan'); //Use for logging

const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) Middleware stack

//Automactically logs request details to console (E.g. GET /api/v1/tours 200 2.253 ms - 8618)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Adds body to req object
app.use(express.json());

//Our own middle ware
//Note that 3rd party middlewares like express.json() returns the very same callback used below (req,res,next => ....)

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes
//Mounting routers on a route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  //if a param is passed into next(), express will treat it as an error object and automactically skip all the other middlewares and send it to the global error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//4) Error handling middleware
app.use(globalErrHandler);

module.exports = app;
