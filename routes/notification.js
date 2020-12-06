const express = require('express');
const mongoose = require('mongoose');
const Ntf = require('../models/Notification');
const FollowRef = require('../models/followRef');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();
const {resType, callRes} = require('../utils/response');
var axios = require('axios');


// Create new Ntf
router.post('/create_ntf', async (req, res) => {
  let statusText =['tạo mới', 'cập nhật', 'xóa'];
  try {
    let { fromUserID, toUserIDs, status, refID } = req.body;
    if (!fromUserID || !toUserIDs|| status == undefined || !refID) 
      return callRes(res,resType.BAD_REQUEST, 'thiếu parameter');
    if  (status < 0 || status > 2)
      return callRes(res,resType.BAD_REQUEST, 'sai parameter');
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
    return callRes(res, resType.OK, data);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// get_list_ntf
router.get('/get_list_ntf', verifyToken, async (req, res) => {
  let {index, count} = req.query;
  if (index === undefined || count === undefined) 
    return callRes(res, resType.BAD_REQUEST, 'thiếu tham số');
  index = parseInt(index, 10);
  count = parseInt(count, 10);
  if (isNaN(index) || isNaN (count)) 
    return callRes(res, resType.BAD_REQUEST, 'sai kiểu tham số');
  if (!Number.isInteger(index) || !Number.isInteger(count))
    return callRes(res, resType.BAD_REQUEST, 'sai kiểu tham số');
  if (index < 0 || count < 0)
    return callRes(res, resType.BAD_REQUEST, 'sai giá trị tham số');
  let id = req.user.id;
  try {
    let Ntfs = await Ntf.find({ "toUser._id": id }).sort("-createdAt");
    let result = Ntfs.slice(index, index + count);
    return callRes(res, resType.OK, {
      notifications: result,
      total: Ntfs.length
    });
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// get
router.get('/get_ntf', verifyToken, async (req, res) => {
  let idNtf = req.query.idNtf;
  if (!idNtf) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return callRes(res, resType.NOT_FOUND,'not found');
    return callRes(res, resType.OK, ntf);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// mark_seen_ntf
router.put('/mark_seen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return callRes(res, resType.NOT_FOUND,'not found');
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return callRes(res, resType.BAD_REQUEST, 'user không trong danh sách nhận thông báo');
    if (ntf.toUser[index].isSeen == true) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
    ntf.toUser[index].isSeen = true;
    await ntf.save();
    return callRes(res, resType.OK);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// mark_unSeen_ntf
router.put('/mark_unSeen_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return callRes(res, resType.NOT_FOUND,'not found');
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return callRes(res, resType.BAD_REQUEST, 'user không trong danh sách nhận thông báo');
    if (ntf.toUser[index].isSeen == false) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
    ntf.toUser[index].isSeen = false;
    await ntf.save();
    return callRes(res, resType.OK);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// delete
router.delete('/delete_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return callRes(res, resType.NOT_FOUND,'not found');
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return callRes(res, resType.BAD_REQUEST, 'user không trong danh sách nhận thông báo');
    if (ntf.toUser[index].status == 1) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
    ntf.toUser[index].isSeen = false;
    ntf.toUser[index].status = 1;
    await ntf.save();
    return callRes(res, resType.OK);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// unDelete
router.delete('/unDelete_ntf', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let idNtf = req.body.idNtf;
  if (!idNtf) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let ntf = await Ntf.findById(idNtf);
    if (!ntf) return callRes(res, resType.NOT_FOUND,'not found');
    let index = ntf.toUser.findIndex(e => e._id == userId);
    if (index < 0) return callRes(res, resType.BAD_REQUEST, 'user không trong danh sách nhận thông báo');
    if (ntf.toUser[index].status == 0) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
    ntf.toUser[index].status = 0;
    await ntf.save();
    return callRes(res, resType.OK);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// follow ref 
router.post('/follow_ref', verifyToken, async (req, res) => {
  let userId = req.user.id;
  let { refId, isFollow } = req.body;
  if (!refId || isFollow == undefined) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  if (typeof (isFollow) !== "boolean") return callRes(res, resType.BAD_REQUEST, 'sai định dạng param');

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
      if (isFollow == false) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
      followRef.followers.push({ _id: userId });
    } else {// tim thay user dang follow ref
      if (isFollow == true) return callRes(res,resType.BAD_REQUEST, 'hành động đã thực hiện');
      followRef.followers.splice(index, 1);
    }
    let saved = await followRef.save();
    return callRes(res, resType.OK, saved);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
  }
})

// get_followers
router.post('/get_followers', verifyToken, async (req, res) => {
  let { refId } = req.body;
  let data = [];
  if (!refId ) return callRes(res, resType.BAD_REQUEST, 'thiếu param');
  try {
    let followRef = await FollowRef.findOne({ "ref._id": refId });
    if (followRef) {
      data = followRef.followers;
    } 
    return callRes(res, resType.OK, data);
  } catch (error) {
    return callRes(res, resType.UNKNOWN_ERROR, error.message);
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