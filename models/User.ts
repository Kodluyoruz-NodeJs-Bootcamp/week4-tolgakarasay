import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
// Define the model
const User = mongoose.model('User', userSchema);
export default User;
