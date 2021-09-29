require('dotenv').config();
const mongoose = require('mongoose');

exports.connect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mlx2e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
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
