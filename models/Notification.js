const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    fromUser: {
      _id: String,
      username: String
    },
    toUser: [{
      _id: String,
      isSeen: { // người dùng đã xem thông báo hay chưa
        type: Boolean,
        default: false
      },
      status: { // người dùng phân loại thông báo. 0: mặc định, 1: đã xóa
        type: Number,
        default: 0
      }
    }],
    content: { // nội dung thông báo
      type: String,
      require: true
    },
    level: { // cấp độ thông báo 1-5
      type: Number,
      require: true
    },
    createdAt: { // thời gian tạo thông báo
      type: Date,
      default: Date.now
    },
    ref: { // đối tượng thông báo nói đến
      _id: String, 
      _type: Number, 
      /*loại đối tượng : 
      1: drone,
      2: payload, 
      3: User,
      4: Image/ video,
      5: sự cố,
      6: đối tượng giám sát,
      7: Báo cáo thống kê
      8: Miền giám sát
      9: công việc xử lý sự cố
      10: flight hub
      */
      _link: String
    }
  }

)

module.exports = mongoose.model("notifications", NotificationSchema);