const actionType = {
  INCIDENT_DETECTED: {
    code: 0,
    content_text: 'phát hiện sự cố',
    action_text: 'xác nhận',
  },
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

module.exports = {actionType, findAction};