const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/serviceController');

router.get('/main', servicesController.getMainServices);
router.get('/additional', servicesController.getAdditionalServices);
router.get('/certifications', servicesController.getCertifications);

module.exports = router;
