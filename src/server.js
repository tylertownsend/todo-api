const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/usersRouter');
const taskRouter = require('./routers/tasksRouter');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = app;