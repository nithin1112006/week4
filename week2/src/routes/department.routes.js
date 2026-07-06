const { Router } = require('express');
const departmentController = require('../controllers/department.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const { createDepartmentValidator } = require('../validators/department.validator');

const router = Router();

router.get('/', authenticate, departmentController.getAll);
router.post('/', authenticate, authorize('ADMIN'), createDepartmentValidator, departmentController.create);

module.exports = router;
