const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const connectionUrl = process.env.MONGODB_URL;
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports = {
  mongoose
};