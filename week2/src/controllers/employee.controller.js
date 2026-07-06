const { validationResult } = require('express-validator');
const employeeService = require('../services/employee.service');
const emailService = require('../services/email.service');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder, name, email, role, departmentId } = req.query;
    const result = await employeeService.getAll({ page, limit, sortBy, sortOrder, name, email, role, departmentId });
    sendPaginated(res, result.employees, result.total, parseInt(page) || 1, parseInt(limit) || 10);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const employee = await employeeService.getById(req.params.id);
    sendSuccess(res, employee, 'Employee fetched successfully');
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 400, errors.array());

    const employee = await employeeService.create(req.body);
    emailService.sendWelcomeEmail(employee);
    sendSuccess(res, employee, 'Employee created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 400, errors.array());

    const employee = await employeeService.update(req.params.id, req.body);
    sendSuccess(res, employee, 'Employee updated successfully');
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id);
    sendSuccess(res, null, 'Employee deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
