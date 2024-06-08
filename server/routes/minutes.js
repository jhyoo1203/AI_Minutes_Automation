const express = require('express');
const router = express.Router();
const minutesController = require('../controllers/minutesController');

router.get('/', minutesController.getAllMinutes);
router.post('/temp', minutesController.saveTempMinutes);
router.post('/final', minutesController.saveFinalMinutes);

module.exports = router;
