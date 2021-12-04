require('dotenv').config();
const mongoose = require('mongoose');

exports.connect = async (test = false) => {
  try {
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    let dbName = test ? process.env.TEST_DB_NAME : process.env.DB_NAME;
    let uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mlx2e.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    await mongoose.connect(uri, options);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB : " + err);
    return false;
  }
  return true;
}

exports.disconnect = (callback) => {
  mongoose.connection.close(callback);
}
