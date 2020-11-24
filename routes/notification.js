const express = require('express');
const mongoose = require('mongoose');
const Ntf = require('../models/Notification');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

var axios = require('axios');


// Create new Ntf
router.post('/create_ntf', async (req, res) => {
  try {
    let { fromUser, toUser, content, level, ref} = req.body;
    //res.json({fromUser, toUser, content, level, ref});
    let newNtf = new Ntf(); 
    
    newNtf.fromUser = fromUser;
    newNtf.toUser = toUser;
    newNtf.content = content;
    newNtf.level = level;
    newNtf.ref = ref;
    console.log(newNtf);
    await newNtf.save();
    res.status(200).json({message: "OK"});
  } catch (error) {
    res.json({message: error.message});
  }
})

// get_list_ntf
router.get('/get_list_ntf', verifyToken, async (req, res) => {
  let id = req.user.id;
  try {
    let Ntfs = await Ntf.find({"toUser._id": id}).sort("-createdAt");
    res.status(200).json({message: "OK", data: Ntfs});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

// get
router.get('/get_ntf', verifyToken, async (req, res) => {
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({message: "thiếu param"}); 
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({message: "not found"});
    res.status(200).json(ntf);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

// mark_seen_ntf
router.put('/mark_seen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({message: "thiếu param"}); 
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({message: "not found"});
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index >= 0) ntf.toUser[index].isSeen = true;
    await ntf.save();
    res.status(200).json(ntf);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

// mark_unSeen_ntf
router.put('/mark_unSeen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({message: "thiếu param"}); 
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({message: "not found"});
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index >= 0) ntf.toUser[index].isSeen = false;
    await ntf.save();
    res.status(200).json(ntf);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

// delete
router.delete('/delete_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({message: "thiếu param"}); 
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({message: "not found"});
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index >= 0) ntf.toUser[index].status = 1;
    await ntf.save();
    res.status(200).json(ntf);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

module.exports = router;


const checkPossitiveInteger = x => {
  let parsed = parseInt(x, 10);
  if (! isNaN(parsed)) {
    if (Number.isInteger(parsed) && parsed >= 0) return true;
    return false;
  }
  return false;
}