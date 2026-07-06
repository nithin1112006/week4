const { validationResult } = require('express-validator');
const departmentService = require('../services/department.service');
const { sendSuccess, sendError } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const departments = await departmentService.getAll();
    sendSuccess(res, departments, 'Departments fetched successfully');
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 400, errors.array());

    const department = await departmentService.create(req.body);
    sendSuccess(res, department, 'Department created successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create };
