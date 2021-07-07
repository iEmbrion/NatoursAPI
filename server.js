const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});
const app = require('./app');
// console.log(process.env);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
