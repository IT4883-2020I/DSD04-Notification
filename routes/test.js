const express = require('express');
const mongoose = require('mongoose');
const Ntf = require('../models/Notification');
const router = express.Router();
let NtfData = require('../data/data');
router.get("/", async (req, res) => {
  try {
    await Ntf.deleteMany();
    let Ntfs= await Ntf.insertMany(NtfData);
    return res.json(Ntfs);
  } catch (error) {
    res.json({error: error.message});
    throw error;
  }
})

module.exports = router;