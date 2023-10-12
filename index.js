const express = require('express');
const routerApi = require('./routes');
const logger = require('./utils/logger');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  unknownEndpoint,
} = require('./middlewares/error.handler.js');
const requestLogger = require('./middlewares/logger.request');

const app = express();
const port = 4000;

app.use(express.json());
app.use(requestLogger);

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port, () => {
  logger.info('Server is running at port: ' + port);
});
