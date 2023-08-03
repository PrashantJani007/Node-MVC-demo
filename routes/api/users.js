const { edit, update,changePassword } = require('../../controllers/api/userController');

const router = require('express').Router();

router.get('/profile',edit);
router.put('/profile-update',update);
router.put('/change-password',changePassword);
module.exports = router;