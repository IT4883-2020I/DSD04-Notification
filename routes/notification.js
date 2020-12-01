const express = require('express');
const mongoose = require('mongoose');
const Ntf = require('../models/Notification');
const FollowRef = require('../models/followRef');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();
const resCode = require('../utils/resCode');
var axios = require('axios');


// Create new Ntf
router.post('/create_ntf', async (req, res) => {
  let statusText =['tạo mới', 'cập nhật', 'xóa'];
  try {
    let { fromUserID, toUserIDs, status, refID } = req.body;
    console.log(typeof fromUserID === 'string', Array.isArray(toUserIDs), typeof status === 'number', typeof refID === 'string')
    if (!fromUserID || !toUserIDs|| status == undefined || !refID) 
      return res.status(400).json({code: resCode.BAD_REQUEST.code, message: " thiếu parameter"});
    if  (status < 0 || status > 2)
      return res.status(400).json({code: resCode.BAD_REQUEST.code, message: " sai parameter"});
    // status: 0: new, 1: update, 2:delete
    let newNtf = new Ntf();

    newNtf.fromUser = {_id: fromUserID};
    for (let e in toUserIDs){
      newNtf.toUser.push({ _id: e})
    }
    newNtf.content = "Người dùng " + fromUserID + ' đã '+statusText[status] + ' ' + refID;
    newNtf.level = autoCreatLevel();
    newNtf.ref = {
      _id: refID,
      _type:  Math.floor(Math.random() * 13) + 1,
      _link: 'https://github.com/leminhnguyen'
    }
    newNtf.project_type = req.headers['project-type'];
    let saved = await newNtf.save();
    let data = {
      id: saved._id,
      title: saved.content,
      link: saved.ref._link,
      project_type: saved.project_type
    }
    res.status(200).json({ code: resCode.OK.code, message: "OK", data: data });
  } catch (error) {
    console.log(error)
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// get_list_ntf
router.get('/get_list_ntf', verifyToken, async (req, res) => {
  let id = req.user.id;
  try {
    let Ntfs = await Ntf.find({ "toUser._id": id }).sort("-createdAt");
    res.status(200).json({ code: resCode.OK.code, message: "OK", data: Ntfs });
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// get
router.get('/get_ntf', verifyToken, async (req, res) => {
  let idNtf = req.query.idNtf;
  if (!idNtf) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({ code: resCode.NOT_FOUND.code, message: "not found" });
    res.status(200).json({ code: resCode.OK.code, message: "OK", data: ntf});
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// mark_seen_ntf
router.put('/mark_seen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({code: resCode.BAD_REQUEST.code,  message: "thiếu param" });
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({ code: resCode.NOT_FOUND.code, message: "not found" });
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "user không trong danh sách nhận thông báo" });
    if (ntf.toUser[index].isSeen == true) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
    ntf.toUser[index].isSeen = true;
    await ntf.save();
    res.status(200).json({ code: resCode.OK.code, message: "OK" });
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// mark_unSeen_ntf
router.put('/mark_unSeen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({ code: resCode.NOT_FOUND.code, message: "not found" });
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return res.status(400).json({ code: resCode.BAD_REQUEST.code,message: "user không trong danh sách nhận thông báo" });
    if (ntf.toUser[index].isSeen == false) return res.status(400).json({ code:resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
    ntf.toUser[index].isSeen = false;
    await ntf.save();
    res.status(200).json({ code: resCode.OK.code, message: "OK" });
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// delete
router.delete('/delete_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({ code: resCode.NOT_FOUND.code, message: "not found" });
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "user không trong danh sách nhận thông báo" });
    if (ntf.toUser[index].status == 1) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
    ntf.toUser[index].status = 1;
    await ntf.save();
    res.status(200).json({ code: resCode.OK.code, message: "OK" });
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// unDelete
router.delete('/unDelete_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return res.status(404).json({ code: resCode.NOT_FOUND.code, message: "not found" });
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "user không trong danh sách nhận thông báo" });
    if (ntf.toUser[index].status == 0) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
    ntf.toUser[index].status = 0;
    await ntf.save();
    res.status(200).json({ code: resCode.OK.code, message: "OK" });
  } catch (error) {
    res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// follow ref 
router.post('/follow_ref', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let { refId, isFollow } = req.body;
  if (!refId || isFollow == undefined) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  if (typeof (isFollow) !== "boolean") return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "sai định dạng param" });

  try {
    let followRef = await FollowRef.findOne({ "ref._id": refId });
    if (!followRef) {
      followRef = new FollowRef({
        ref: {
          _id: refId
        },
        followers: []
      });
    }
    let index = followRef.followers.findIndex(e => e._id == userId);
    if (index < 0) {
      if (isFollow == false) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
      followRef.followers.push({ _id: userId });
    } else {// tim thay user dang follow ref
      if (isFollow == true) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "hành động đã thực hiện" });
      followRef.followers.splice(index, 1);
    }
    let saved = await followRef.save();
    return res.status(200).json({ code: resCode.OK.code, message: "OK", data: saved });
  } catch (error) {
    return res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

// get_followers
router.post('/get_followers', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let { refId } = req.body;
  let data = [];
  if (!refId ) return res.status(400).json({ code: resCode.BAD_REQUEST.code, message: "thiếu param" });
  try {
    let followRef = await FollowRef.findOne({ "ref._id": refId });
    if (followRef) {
      data = followRef.followers;
    } 
    return res.status(200).json({code: resCode.OK.code, message: "OK", data: data});
  } catch (error) {
    return res.status(500).json({ code: resCode.UNKNOWN_ERROR.code, message: error.message });
  }
})

module.exports = router;


const checkPossitiveInteger = x => {
  let parsed = parseInt(x, 10);
  if (!isNaN(parsed)) {
    if (Number.isInteger(parsed) && parsed >= 0) return true;
    return false;
  }
  return false;
}

const autoCreatLevel = () => {
  return Math.floor(Math.random() * 5) + 1;
}