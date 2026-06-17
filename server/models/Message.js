const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    text: String,
    image: String,

    delivered: { type: Boolean, default: false },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
