//17.10 organizing your server
//app.js to export the app ready for integration testing

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {v4:uuid} = require('uuid');
const cardRouter = require('./card/card-router');
const listRouter = require('./list/list-router');
const logger = require('./logger');

const app = express();

const morganOption = (process.env.NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//17.10
//authorization middleware that validates that an
//Authorization Header with an API token is present
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`); //error log statement if failure happens
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

//An important note! We've used the card router after we use the validateBearerToken 
//as we want the validation to take place before any routes get handled.
app.use(cardRouter);
app.use(listRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

module.exports = app;