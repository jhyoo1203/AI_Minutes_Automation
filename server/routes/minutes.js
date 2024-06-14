const express = require('express');
const multer = require('multer');
const router = express.Router();
const minutesController = require('../controllers/minutesController');

const upload = multer({ dest: 'uploads/' });

router.get('/', minutesController.getAllMinutes);
router.get('/:id', minutesController.getMinutes);
router.get('/user/:userId', minutesController.getMinutesByUserId);
router.get('/temp', minutesController.getAllTempMinutes);
router.get('/temp/:id', minutesController.getTempMinutes);
router.post('/temp', minutesController.saveTempMinutes);
router.post('/final', minutesController.saveFinalMinutes);
router.post('/save', minutesController.saveMinutes);
router.post('/transcription', upload.single('file'), minutesController.transcription);

module.exports = router;
