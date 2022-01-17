// DB CONNECTION
const mongoose = require('mongoose');

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((error) => {
      console.log('Database connection failed !');
      console.error(error);
      process.exit(1);
    });
};
