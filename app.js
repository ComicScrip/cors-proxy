const express = require('express');
const cors = require('cors');
var proxy = require('express-http-proxy');

const { inTestEnv, PORT } = require('./env');

const app = express();

// pre-route middlewares
app.use(cors());

app.use(express.json());
app.use(
  '/proxy',
  proxy((req) => {
    console.log(JSON.stringify(req.url, null, 2));
    return req.url;
  })
);

// post-route middlewares
app.set('x-powered-by', false);

// server setup
const server = app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

// process setup
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});

module.exports = server;
