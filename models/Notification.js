const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    
    fromUser: {
      _id: String,
      username: String
    },
    toUser: [{
      _id: String,
      isSeen: {
        type: Boolean,
        default: false
      }
    }],
    content: {
      type: String,
      require: true
    },
    level: {
      type: Number,
      require: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number
    },
    incident: {
      _id: String,
      _type: Number
    },
    link: String
  }

)

module.exports = mongoose.model("notifications", NotificationSchema);