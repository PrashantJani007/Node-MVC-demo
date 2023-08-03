const { index, checkEmail, showChangePassword, changePassword } = require('../controllers/forgotPasswordController');

const router = require('express').Router();

router.get('/forgot-password',index);
router.post('/forgot-password/check-email',checkEmail);
router.get('/forgot-password/verify-email',showChangePassword);
router.post('/forgot-password/change-password',changePassword);

module.exports = router;