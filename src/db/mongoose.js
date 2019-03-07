var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var connectionUrl = process.env.MONGOLAB_URI ||
                    process.env.MONGOHQ_URL ||
                    'mongodb://localhost:27017/TodoApp';
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports = {
  mongoose
};