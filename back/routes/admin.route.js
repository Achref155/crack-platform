const express = require('express');
const adminController = require('../controllers/admin.controller');
// const userController = require('../controllers/user.controller');
const router = express.Router();

router.get('/users', adminController.getAllUsers);
router.post('/ban', adminController.banUser);
router.delete('/users/:id', adminController.removeUser);
router.get('/ai/track', adminController.trackAiModel);
router.post('/ai/retrain', adminController.retrainAiModel);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.get('/details', adminController.getAdminDetails);
// router.post('/transfer-to-admin', userController.transferUserToAdmin);


module.exports = router;