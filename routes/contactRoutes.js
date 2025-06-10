const express = require("express");
const router = express.Router();
const contactController= require('../controllers/contactController');

router.post('/enviar', contactController.sendContactMessage);


module.exports = router;
