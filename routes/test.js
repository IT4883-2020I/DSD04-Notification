const express = require('express');
const mongoose = require('mongoose');
const Ntf = require('../models/Notification');
const router = express.Router();
let data = {
  "fromUser": {
    "_id": "yAOQusDmE8VcovhCtboma",
    "username": "admin X"
  },
  "toUser": [
    {
      "_id": "fzwzbyAMPMFSPOE1prEio",
      "isSeen": true
    },
    {
      "_id": "aYlWyGIl8zqBaLj7B8CNr",
      "isSeen": true
    }
  ],
  "content": "sự cố drone A thay đổi",
  "level": 5,
  // "createdAt": "2020-11-21T02:31:05.535Z",
  "status": 1,
  "incident": {
    "_id": "uOslxUF_Cmq15JHTYc2oqIJu_N",
    "_type": 2
  },
  "link": "http://test.com/uOslxUF_Cmq15JHTYc2oqIJu_N"
}
router.get("/", async (req, res) => {
  try {
    let newNtf = new Ntf(data);
    newNtf = await newNtf.save();
    let Ntfs = await Ntf.find();
    return res.json(Ntfs);
  } catch (error) {
    res.json({error: error.message});
    throw error;
  }
})

module.exports = router;