const express = require('express');

const Todo = require('../models/todo');

const taskRouter = new express.Router();

taskRouter.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  try {
    const doc = await todo.save();
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get('/todos', async (req, res)=> {
  try {
    const todos = await Todo.find({});
    res.send({todos});
  } catch(e) {
    res.status(500).send(e);
  }
});

taskRouter.get('/todos/:id', async (req, res) => {
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

taskRouter.patch('/todos/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({error:"Invalid update parameter"});
  }

  try {

    const task = await Task.findById(req.params.id);

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.delete('/todos/:id', async (req, res) =>{
  try {
    const task = await Todo.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = taskRouter;