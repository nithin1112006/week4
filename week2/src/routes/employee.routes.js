const { Router } = require('express');
const employeeController = require('../controllers/employee.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const { createEmployeeValidator, updateEmployeeValidator } = require('../validators/employee.validator');

const router = Router();

router.get('/', authenticate, employeeController.getAll);
router.get('/:id', authenticate, employeeController.getById);
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), createEmployeeValidator, employeeController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), updateEmployeeValidator, employeeController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), employeeController.remove);

module.exports = router;
