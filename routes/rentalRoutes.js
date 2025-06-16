const express = require("express");
const router = express.Router();
const rentalController= require('../controllers/rentalController');

router.post('/add', rentalController.sendRentalRequest);


module.exports = router;
