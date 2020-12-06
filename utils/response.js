var resType = {
  OK: {
    statusCode: 200,
    body: {
      code: 1000,
      message: "OK",
      data: null
    }
  },
  UNKNOWN_ERROR: {
    statusCode: 500,
    body: {
      code: 1005,
      message: "UNKNOWN ERROR"
    }
  },
  BAD_REQUEST:{
    statusCode: 400,
    body: {
      code: 1001, 
      message: "BAD REQUEST"
    }
  },
  NOT_FOUND:{
    statusCode: 404,
    body: {
      code: 1002,
      message: "NOT FOUND"
    }
  }
}

function callRes(res, responseErrorName, data = null) {
  if (responseErrorName != resType.OK){
    let x = {
      code: responseErrorName.body.code,
      message: responseErrorName.body.message 
    }
    if (data) x.message += ': ' + data.toString();
    return res.status(responseErrorName.statusCode).json(x);
  }
  else {
    let x = {
      code: responseErrorName.body.code,
      message: responseErrorName.body.message,
      data: data 
    }
    return res.status(responseErrorName.statusCode).json(x);
  }
}

module.exports = {resType, callRes};
