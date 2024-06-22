const express = require('express');
const multer = require('multer');
const router = express.Router();
const minutesController = require('../controllers/minutesController');

const upload = multer({ dest: 'uploads/' });

router.get('/', minutesController.getAllMinutes);
// 임시 회의록
router.get('/temp', minutesController.getTempMinutes);
router.get('/:id', minutesController.getMinutes);
// 해당 유저의 모든 회의록
router.get('/user/:userId', minutesController.getMinutesByUserId);
router.post('/save', minutesController.saveMinutes);
router.post('/transcription', upload.single('file'), minutesController.transcription);

module.exports = router;
