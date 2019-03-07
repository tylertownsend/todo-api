var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users',  async (req, res) => {
  try {
   const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });
  try {
    const doc = await todo.save();
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos', async (req, res)=> {
  try {
    const todos = await Todo.find({});
    res.send({todos});
  } catch(e) {
    res.status(500).send(e);
  }
});

app.get('/todos/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Todo.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(500).send(e);
  }
});



app.listen(port, ()=> {
  console.log(`Started onport ${port}`);
});

module.exports = {app};