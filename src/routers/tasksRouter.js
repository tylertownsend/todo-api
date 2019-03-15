const express = require('express');

const Task = require('../models/task');

const taskRouter = new express.Router();

taskRouter.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    const doc = await task.save();
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get('/tasks', async (req, res)=> {
  try {
    const tasks = await Task.find({});
    res.send({tasks});
  } catch(e) {
    res.status(500).send(e);
  }
});

taskRouter.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(500).send(e);
  }
});

taskRouter.patch('/tasks/:id', async (req, res) => {
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

taskRouter.delete('/tasks/:id', async (req, res) =>{
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = taskRouter;