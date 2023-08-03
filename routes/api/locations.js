const { index, store, getPlugOptions, getNetworkOptions, getAmenitiesOptions, getParkingOptions, show, locationsByUser } = require('../../controllers/api/locationController');

const router = require('express').Router();

router.get('/locations',index);
router.get('/locations-by-user',locationsByUser);
router.post('/locations',store);
router.get('/locations/get-plugs-options',getPlugOptions)
router.get('/locations/get-networks-options',getNetworkOptions)
router.get('/locations/get-amenities-options',getAmenitiesOptions)
router.get('/locations/get-parkings-options',getParkingOptions)
router.get('/locations/:id',show);
module.exports = router;