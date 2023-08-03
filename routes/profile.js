const { editAdminProfile } = require('../controllers/adminProfileController');

const router = require('expres').Router();

router.get('/admin/profile',editAdminProfile);

module.exports = router;