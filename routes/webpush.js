const crypto = require("crypto");
const webpush = require("web-push");
const Subscription = require('../models/Subscription');

const vapidKeys = {
  privateKey: "yRIfSrXJbEtRJusQpDr-jnnsAPL5sI59EgX2rXTSkN4",
  publicKey: "BL-eBn1GmJUsvUaBuiretJuPyWuyiJqyazFBHEcZchR6EKGdVQE2axsaBD-oPj_Y_Q7upi5GuChjHiLfDJbQquY"
};

webpush.setVapidDetails("mailto:example@yourdomain.org", vapidKeys.publicKey, vapidKeys.privateKey);

const createHash = (input) => {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

const handlePushNotificationSubscription = (req, res) => {
  console.log("someone calling subcribe request")
  const projectTypes = ['DE_DIEU', 'CAY_TRONG', 'CHAY_RUNG', 'LUOI_DIEN']
  const { subscription, project_type, userID } = req.body;
  console.log(`projectType: ${project_type}  -- userID: ${userID}`)
  const subHash = createHash(JSON.stringify({subscription, userID}));
  Subscription.findOne({
    hash: subHash
  }, (err, sub) => {
    if (err) res.status(500).json({
      "code": 500,
      "message": err
    })
    if (sub) return res.status(401).json({ code: 401, message: "Endpoint already exists in DB"})
    else if (!projectTypes.includes(project_type)) return res.status(400).json({ code: 400, message: "Your project type is not valid ('DE_DIEU', 'CAY_TRONG', 'CHAY_RUNG', 'LUOI_DIEN')"})
    else {
      const newSub = new Subscription({
        project_type: project_type,
        userID: userID,
        hash: subHash,
        endpoint: subscription.endpoint,
        subscription: subscription
      })
      newSub.save().then(result => {
        res.status(201).json({
          code: 201,
          subscriptionId: subHash,
          message: "subcribed push notification successfully"
        })
      }).catch(err => {
          console.log(err);
          res.status(500).send({
              code: 500,
              message: "Can not subcribe push notification",
              error: err
          });
      });
    }
  })
}

const sendPushNotification = async(project_type, payload, userID) => {
    console.log("someone calling push notification request")

    if (userID) {
      await Subscription.find({ userID: userID }, async(err, clients) => {
        try {
          clients.map( async(client) => {
            pushNotification(client, payload)
          });
        } catch (error) {
          console.log(err);
          throw err;
        }
      })
    }else {
      await Subscription.find({ project_type: project_type }, (err, clients) => {
        try {
          clients.map( async(client) => {
            pushNotification(client, payload)
          });
        } catch (error) {
          console.log(err);
          throw err;
        }
        
      })
    }
}
  
const pushNotification = (client, payload) => {
  webpush.sendNotification(
    client.subscription,
    JSON.stringify({
      payload
    })
  )
  .catch(err => {
    throw err;
  });
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
