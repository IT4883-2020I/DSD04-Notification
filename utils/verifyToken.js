var axios = require('axios');
const { resType, callRes } = require('./response');

const verifyToken = (req, res, next) => {
  if (!req.headers["api-token"] || !req.headers["project-type"]) {
    return callRes(res, resType.BAD_REQUEST, 'thiếu api-token hoặc project-type');
  } else {
    var data = '';
    var config = {
      method: 'get',
      url: 'https://distributed.de-lalcool.com/api/verify-token',
      headers: {
        'api-token': req.headers["api-token"],
        'project-type': req.headers["project-type"]
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.status == 200) {
          req.user = response.data.result;
          next();
        } else {
          return callRes(res, resType.BAD_REQUEST, 'USER ERROR: '+ response.data.message);
        }
      })
      .catch(function (error) {
        return callRes(res, resType.UNKNOWN_ERROR, error);
      });
  }
}
module.exports = verifyToken;