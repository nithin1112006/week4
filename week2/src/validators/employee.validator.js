const { body } = require('express-validator');

const createEmployeeValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['ADMIN', 'MANAGER', 'EMPLOYEE']).withMessage('Invalid role'),
  body('departmentId').optional().isUUID().withMessage('Valid department ID is required'),
];

const updateEmployeeValidator = [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  body('departmentId').optional().isUUID(),
];

module.exports = { createEmployeeValidator, updateEmployeeValidator };
