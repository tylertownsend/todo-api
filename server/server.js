var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var connectionUrl = 'mongodb://localhost:27017/TodoApp';
mongoose.connect(url);