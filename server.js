const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});

process.on('unhandledRejection', err => {
  console.log(`Unhandled Rejection: ${err.name}, ${err.message}`);
  console.log(err);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.name}, ${err.message}`);
  console.log(err);

  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connection successful`);
  });

const port = process.env.PORT || 8080;

//Every 24 hours, Heroku will send this signal to our application.
//Handling this allow all outstanding request to finish execution before shutting down.
//Heroku will issue process.exit for us
//Note that manual restarts will trigger this signal as well.
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully ¯_(ツ)_/¯¯_(ツ)_/¯');
  app.close(() => {
    console.log('Process terminated 👌👌👌');
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
