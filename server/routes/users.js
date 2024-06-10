const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/detail/:id', userController.getUserIncludeMinutes);
router.get('/:id', userController.getUser);
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/verify', userController.verifyToken);
router.post('/logout', userController.logoutUser);

module.exports = router;
