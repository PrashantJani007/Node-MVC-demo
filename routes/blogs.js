const { index, store, changeStatus, destroy, multipleDelete, edit } = require('../controllers/blogController');

const router = require('express').Router();

router.get('/blogs',index);
router.get('/blogs/:id',edit);
router.post('/blogs',store);
router.delete('/blogs/:id',destroy);
router.post('/blogs/multiple-delete',multipleDelete);
router.patch('/blogs/change-status/:id',changeStatus);

module.exports = router;