const mongoose = require('mongoose');

const FollowRefSchema = new mongoose.Schema(
  {
    ref: {
      _id: String
    },
    followers: [{
      _id: String
    }]
  }
)

module.exports = mongoose.model("followRefs", FollowRefSchema);