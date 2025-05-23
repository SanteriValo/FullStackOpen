const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const testingRouter = require('./controllers/testing');

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;