var axios = require('axios');


const verifyToken = (req, res, next) => {
  if (!req.headers["api-token"] || !req.headers["project-type"]) {
    return res.status(400).json({ message: "thiếu api-token hoặc project-type" });
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
          return res.status(response.status).json(response.data);
        }
      })
      .catch(function (error) {
        return res.status(400).json(error);
      });
  }
}
module.exports = verifyToken;