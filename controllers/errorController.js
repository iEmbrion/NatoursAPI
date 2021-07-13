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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      staus: err.status,
      message: err.message,
    });
    //Handling unknown errors
  } else {
    console.error(`ERROR: (╯°□°）╯︵ ┻━┻ ${err}`);
    res.status(500).json({
      status: `error`,
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
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

    sendErrorProd(error, res);
  }
};
