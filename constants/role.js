const roleType = {
  ADMIN:{
    code: 0,
    text: 'Admin',
    role: 'ADMIN'
  },
  MANAGER:{
    code: 1,
    text: 'Người quản lý',
    role: 'MANAGER'
  },
  SUPERVISOR:{
    code: 2,
    text: 'Người giám sát',
    role: 'SUPERVISOR'
  },
  DRONE_STAFF: {
    code: 3,
    text: 'Nhân viên drone',
    role: 'DRONE_STAFF'
  },
  INCIDENT_STAFF: {
    code: 4,
    text: 'Nhân viên sự cố',
    role: 'INCIDENT_STAFF'
  },
  ALL: {
    code: 5,
    text: 'Nhân viên',
    role: ['ADMIN','MANAGER', 'SUPERVISOR', 'DRONE_STAFF', 'INCIDENT_STAFF']
  }
}


function findRole(roleCode) {
  let role;
  for (let x in roleType) {
    if (roleType[x].code == roleCode) {
      role = roleType[x];
      break;
    }
  }
  return (role) ? role : null;
}
// console.log(findRole(3))
function checkRoleName(name, roleTypeName) {
  if (Array.isArray(roleTypeName.role)) {
    return roleTypeName.role.includes(name) ? true : false;
  }
  else return (roleTypeName.role == name) ? true : false;
}
// console.log(checkRoleName('DD', roleType.ADMIN))
// console.log(checkRoleName('GG', roleType.ALL))
module.exports = {roleType, findRole, checkRoleName};