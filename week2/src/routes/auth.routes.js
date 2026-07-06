const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const rateLimiter = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = Router();

router.post('/register', rateLimiter, registerValidator, authController.register);
router.post('/login', rateLimiter, loginValidator, authController.login);

module.exports = router;
