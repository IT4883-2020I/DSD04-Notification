const {roleType,findRole} = require('./role');
const actionType = {
  INCIDENT_DETECTED_VERIFY: {
    code: 0,
    content_text: 'phát hiện sự cố',
    action_text: 'xác nhận',
    role: [roleType.ADMIN, roleType.SUPERVISOR],
    requireResponse: true
  },
  INCIDENT_DETECTED_VIEW: {
    code: 1,
    content_text: 'phát hiện sự cố',
    action_text: 'xem',
    role: [roleType.ADMIN, roleType.SUPERVISOR],
    requireResponse: false
  },
  WORK_NEW_VIEW: {
    code: 2,
    content_text: 'thông báo công việc mới',
    action_text: 'xem',
    role: [roleType.ALL],
    requireResponse: false
  },
  WORK_RESULT_REPORTED_VIEW: {
    code: 3,
    content_text: 'báo cáo kết quả công việc',
    action_text: 'xem',
    role: [roleType.ADMIN],
    requireResponse: false
  },
  WORK_RESULT_RESPONSE_VIEW: {
    code: 4,
    content_text: 'thông báo review báo cáo',
    action_text: 'xem',
    role: [roleType.ALL],
    requireResponse: false
  }
}

function findAction(actionCode) {
  let action;
  for (let x in actionType) {
    if (actionType[x].code == actionCode) {
      action = actionType[x];
      break;
    }
  }
  return (action) ? action : null;
}

// console.log(findAction(4))
module.exports = {actionType, findAction};