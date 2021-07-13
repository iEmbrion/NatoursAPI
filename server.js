const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

dotenv.config({
  path: './config.env',
});

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

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
