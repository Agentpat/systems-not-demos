const mongoose = require('mongoose');

let connection;

async function connectDB(uri) {
  if (connection) return connection;
  mongoose.set('strictQuery', false);
  connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection;
}

module.exports = { connectDB };
