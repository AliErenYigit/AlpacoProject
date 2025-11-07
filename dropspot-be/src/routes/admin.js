const express = require("express");
const router = express.Router();
const {requireAuth } = require('../middlewares/auth');
const { listDropsAdmin, createDrop, updateDrop, deleteDrop,getDropByIdAdmin } = require('../controllers/adminController');

router.get('/drops/:id', requireAuth, getDropByIdAdmin);
router.get('/drops', requireAuth, listDropsAdmin);
router.post('/drops',requireAuth, createDrop);
router.put('/drops/:id',requireAuth, updateDrop);
router.delete('/drops/:id',requireAuth, deleteDrop);

module.exports = router;
