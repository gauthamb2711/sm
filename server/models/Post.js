const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  text: String,
  userEmail: String,
  likes: { type: Number, default: 0 },
  image: String,
  video: String,
  comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

 // ✅ REAL ANALYTICS
  views: { type: Number, default: 0 },
  viewedBy: { type: [String], default: [] } // UNIQUE USERS

},
  { timestamps: true }
);



module.exports = mongoose.model("Post", PostSchema);
