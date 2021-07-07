const express = require('express'); //Framework to simplify coding
const morgan = require('morgan'); //Use for logging

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) Middleware stack (3rd party / self-defined)

//Automactically logs request details to console (E.g. GET /api/v1/tours 200 2.253 ms - 8618)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Adds body to req object
app.use(express.json());

//Our own middle ware
//Note that 3rd party middlewares like express.json() returns the very same callback used below (req,res,next => ....)
app.use((req, res, next) => {
  console.log('Hello from the middleware!! 😊😊😊');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch(`/api/v1/tours/:id`, updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) Routes
//Mounting routers on a route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
