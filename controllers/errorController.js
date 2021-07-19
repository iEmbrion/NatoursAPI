const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name}, please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errorMsgs = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errorMsgs.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTEror = () =>
  new AppError(`Invalid token. Please login again...`, 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //Rendered Website
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //For API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Handling unknown errors
    } else {
      console.error(`ERROR: (╯°□°）╯︵ ┻━┻ ${err}`);
      return res.status(500).json({
        status: `error`,
        message: err.message,
      });
    }
  } else {
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Swomthing went wrong!',
        msg: err.message,
      });
      //Handling unknown errors
    } else {
      console.error(`ERROR: (╯°□°）╯︵ ┻━┻ ${err}`);
      return res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: `Please try again later.`,
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTEror(error);
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(
        () => new AppError('Your token has expired! Please log in again!', 401)
      );
    }

    sendErrorProd(error, req, res);
  }
};
