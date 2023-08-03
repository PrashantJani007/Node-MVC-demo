const { index, updateStatus, destroy, editAdminProfile, updateAdminProfile, checkDuplicateEmail, show, multipleDelete } = require('../controllers/userController');

const router = require('express').Router();

router.get('/users',index);
router.get('/users/:id',show);
router.get('/profile',editAdminProfile)
router.post('/profile',updateAdminProfile)
router.post('/users/multiple-delete',multipleDelete)
router.post('/users/check-duplicate-email',checkDuplicateEmail);
router.patch('/users/change-status/:id',updateStatus);
router.delete('/users/:id',destroy);

module.exports = router;