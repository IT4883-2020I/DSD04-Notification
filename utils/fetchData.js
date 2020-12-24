var axios = require('axios');


function fetch0(project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=ADMIN,status=ACTIVE',
    headers: {
      'project-type': project_type,
      'token': token
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
function fetch1(project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=MANAGER,status=ACTIVE',
    headers: {
      'project-type': project_type,
      'token': token
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
function fetch2(project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=SUPERVISOR,status=ACTIVE',
    headers: {
      'project-type': project_type,
      'token': token
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
function fetch3(project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=DRONE_STAFF,status=ACTIVE',
    headers: {
      'project-type': project_type,
      'token': token
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

function fetch4(project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user?page_id=0&page_size=200&filters=role=INCIDENT_STAFF,status=ACTIVE',
    headers: {
      'project-type': project_type,
      'token': token
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

async function fetchIDs(project_type, token){
  let ids = {
    ADMIN: [],
    MANAGER: [],
    SUPERVISOR: [],
    DRONE_STAFF: [],
    INCIDENT_STAFF: []
  };
  let data0 = await fetch0(project_type, token);
  let data1 = await fetch1(project_type, token);
  let data2 = await fetch2(project_type, token);
  let data3 = await fetch3(project_type, token);
  let data4 =  await fetch4(project_type, token);
  data0.forEach(e => ids.ADMIN.push(e.id));
  data1.forEach(e => ids.MANAGER.push(e.id));
  data2.forEach(e => ids.SUPERVISOR.push(e.id));
  data3.forEach(e => ids.DRONE_STAFF.push(e.id));
  data4.forEach(e => ids.INCIDENT_STAFF.push(e.id));
  return(ids);
}


function getUserById(id, project_type, token) {
  var config = {
    method: 'get',
    url: 'https://distributed.de-lalcool.com/api/user/'+id,
    headers: { 
      'project-type': project_type,
      'token': token
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


const getIncidentById = (id, project_type, token) => {
  var data = '';

  var config = {
    method: 'get',
    url: 'https://it4483.cf/api/incidents/' +id,
    headers: { 
      'accept': 'application/json', 
      'api-token': token, 
      'project-type': project_type
    },
    data : data
  };
  
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}

const getWorkById = (id, project_type, token) => {
  
  return new Promise(function(resolve, reject) {
    axios(config)
    .then(function (response) {
      let datas = response.data;
      resolve(datas);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}
// test 
fetchIDs('CHAY_RUNG','1fa6b94047ba20d998b44ff1a2c78bba').then(ids => console.log(ids))
// getUserById(14, 'CHAY_RUNG','1fa6b94047ba20d998b44ff1a2c78bba').then(data => console.log(data))
// getIncidentById('5fba51d124d3b13a6075a09e','CHAY_RUNG','1fa6b94047ba20d998b44ff1a2c78bba')
//   .then (x => console.log(x))
//   .catch (err => console.log (err))
module.exports = {fetchIDs, getUserById, getIncidentById}