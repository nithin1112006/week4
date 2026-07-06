const { body } = require('express-validator');

const createDepartmentValidator = [
  body('name').notEmpty().withMessage('Department name is required'),
  body('description').optional().isString(),
];

module.exports = { createDepartmentValidator };
