const express = require('express');
const router = express.Router();
const minutesController = require('../controllers/minutesController');

router.get('/', minutesController.getAllMinutes);
router.get('/:id', minutesController.getMinutes);
router.get('/temp', minutesController.getAllTempMinutes);
router.get('/temp/:id', minutesController.getTempMinutes);
router.post('/temp', minutesController.saveTempMinutes);
router.post('/final', minutesController.saveFinalMinutes);
router.post('/save', minutesController.saveMinutes);

module.exports = router;
