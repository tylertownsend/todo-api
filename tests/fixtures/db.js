const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56What!!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, 'myprivatekey')
  }]
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}