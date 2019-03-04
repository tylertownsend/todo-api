var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  
  user.save().then(()=>{
    res.status(201).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.status(201).send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res)=> {
  Todo.find({}).then((todos) => {
    res.send({todos});
  }).catch((e) => {
    res.status(500).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  const _id = req.params.id;
  Todo.findById(_id).then((task) => {
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  }).catch((e) => {
    res.status(500).send(e);
  });
});

app.get('/users', (req, res) => {
  User.find({}).then((todos) => {
    res.send({todos});
  }).catch((e) => {
    res.status(500).send(e);
  });
});

app.get('/users/:id', (req, res) => {
  const _id = req.params.id;
  User.findById(_id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  }).catch((e) => {
    res.status(500).send(e);
  });
});

app.listen(port, ()=> {
  console.log(`Started onport ${port}`);
});

module.exports = {app};