const { default: mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const AccountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
    required: true
  },
  Balance: {
    type: Number,
    required: true
  }
});

const Accounts = mongoose.model('Accounts', AccountsSchema);

module.exports = { User, Accounts };