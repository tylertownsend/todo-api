const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/usersRouter');
const taskRouter = require('./routers/tasksRouter');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;