const { index, changeOptionsStatus, changeStatus, show, destroy, multipleDelete } = require('../controllers/locationController');

const router = require('express').Router();

router.get('/locations',index);
router.get('/locations/:id',show);
router.delete('/locations/:id',destroy);
router.patch('/locations/change/:slug/:id',changeOptionsStatus);
router.put('/locations/change-status/:id',changeStatus);
router.post('/locations/multiple-delete',multipleDelete);

module.exports = router;