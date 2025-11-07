const express = require("express");
const router = express.Router();
const {requireAuth}=require('../middlewares/auth');
const { signup } = require('../controllers/authController');
const {getDropById, getDrops, joinWaitlist,leaveWaitlist, claimDrop } = require("../controllers/dropController");




router.post('/auth/signup', signup);
router.get("/drops/:id", requireAuth,getDropById);
router.get('/drops',requireAuth,getDrops);
router.post('/drops/:id/join',requireAuth,joinWaitlist);
router.post('/drops/:id/leave',requireAuth,leaveWaitlist);
router.post('/drops/:id/claim',requireAuth,claimDrop);


module.exports = router;
