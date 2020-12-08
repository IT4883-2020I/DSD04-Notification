var axios = require('axios');

function fetch4() {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=INCIDENT_STAFF,status=ACTIVE',
    headers: {
      'project-type': 'CHAY_RUNG',
      'token': '1fa6b94047ba20d998b44ff1a2c78bba'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })

}
function fetch0() {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=ADMIN,status=ACTIVE',
    headers: {
      'project-type': 'CHAY_RUNG',
      'token': '1fa6b94047ba20d998b44ff1a2c78bba'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
function fetch1() {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=MANAGER,status=ACTIVE',
    headers: {
      'project-type': 'CHAY_RUNG',
      'token': '1fa6b94047ba20d998b44ff1a2c78bba'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
function fetch2() {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=SUPERVISOR,status=ACTIVE',
    headers: {
      'project-type': 'CHAY_RUNG',
      'token': '1fa6b94047ba20d998b44ff1a2c78bba'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
function fetch3() {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=DRONE_STAFF,status=ACTIVE',
    headers: {
      'project-type': 'CHAY_RUNG',
      'token': '1fa6b94047ba20d998b44ff1a2c78bba'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
async function fetchIDs(){
  let ids = {
    ADMIN: [],
    MANAGER: [],
    SUPERVISOR: [],
    DRONE_STAFF: [],
    INCIDENT_STAFF: []
  };
  let data0 = await fetch0();
  let data1 = await fetch1();
  let data2 = await fetch2();
  let data3 = await fetch3();
  let data4 =  await fetch4();
  data0.forEach(e => ids.ADMIN.push(e.id));
  data1.forEach(e => ids.MANAGER.push(e.id));
  data2.forEach(e => ids.SUPERVISOR.push(e.id));
  data3.forEach(e => ids.DRONE_STAFF.push(e.id));
  data4.forEach(e => ids.INCIDENT_STAFF.push(e.id));
  return(ids);
}


function getUserById(id) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user/'+id,
    headers: { 
      'token': '1fa6b94047ba20d998b44ff1a2c78bba', 
      'project-type': 'CHAY_RUNG'
    }
  };
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data.result;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
fetchIDs().then(ids => console.log(ids))
// getUserById(14).then(data => console.log(data))

module.exports = {fetchIDs, getUserById}