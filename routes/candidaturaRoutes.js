const express = require("express");
const router = express.Router();
const candidaturaController= require('../controllers/candidaturaController');

router.post('/enviar', candidaturaController.sendCandidatura);


module.exports = router;
