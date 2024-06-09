const express = require('express');
const router = express.Router();
const minutesController = require('../controllers/minutesController');

router.get('/', minutesController.getAllMinutes);
router.get('/temp', minutesController.getAllTempMinutes);
router.post('/temp', minutesController.saveTempMinutes);
router.post('/final', minutesController.saveFinalMinutes);
router.post('/save', minutesController.saveMinutes);

module.exports = router;
