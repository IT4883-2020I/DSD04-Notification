const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    fromUser: {
      _id: {
        type: String,
        required: true
      }
    },
    toUser: [{
      _id: {
        type: String,
        required: true
      },
      isSeen: { // người dùng đã xem thông báo hay chưa
        type: Boolean,
        default: false
      },
      status: { // người dùng phân loại thông báo. 0: mặc định, 1: đã xóa
        type: Number,
        default: 0
      },
      check: {
        type: Boolean, // đánh giá xem gửi thông báo có đúng không
        default: false
      },
      action: [{ 
        actionCode: {
          type: Number
        },
        isDone: {
          type: Boolean,
          default: false
        }
      }]
    }],
    content: { // nội dung thông báo
      type: String,
      required: true
    },
    level: { // cấp độ thông báo 1-5
      type: Number,
      required: true
    },
    createdAt: { // thời gian tạo thông báo
      type: Date,
      default: Date.now
    },
    ref: { // đối tượng thông báo nói đến
      _id: {
        type: String,
        required: true
      }, 
      _type: {
        type: Number,
        required: true
      }, 
      /*loại đối tượng : 
      1: drone,
      2: payload, 
      3: User,
      4: Image/ video,
      5: đối tượng giám sát,
      6: Báo cáo thống kê,
      7: Miền giám sát,
      8: công việc xử lý sự cố,
      9: flight hub,
      10: sự cố lưới điện,
      11: sự cố cây trồng,
      12: sự cố cháy rừng,
      13: sự cố đê điều
      */
      _link: {
        type: String,
        required: true
      }
    },
    project_type:{
      type: String,
    },
    deletedByUser: [{
      _id: {
        type: String
      }
    }]
  }

)

module.exports = mongoose.model("notifications", NotificationSchema);