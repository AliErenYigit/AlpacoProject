const express = require("express");
const router = express.Router();
const { requireAdmin } = require('../middlewares/auth');
const { listDropsAdmin, createDrop, updateDrop, deleteDrop } = require('../controllers/adminController');

router.get('/drops', requireAdmin, listDropsAdmin);
router.post('/drops', requireAdmin, createDrop);
router.put('/drops/:id', requireAdmin, updateDrop);
router.delete('/drops/:id', requireAdmin, deleteDrop);

module.exports = router;
