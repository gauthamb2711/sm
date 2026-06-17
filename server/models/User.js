const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  following: {
    type: [String],
    default: []
  },
  followers: {
  type: [String],
  default: []
}

});

module.exports = mongoose.model("User", UserSchema);
