const { Op } = require('sequelize');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const logger = require('../utils/logger');

const getAll = async ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', name, email, role, departmentId }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (role) where.role = role;
  if (departmentId) where.departmentId = departmentId;

  const { count, rows } = await Employee.findAndCountAll({
    where,
    include: [{ model: Department, as: 'department', attributes: ['departmentId', 'name', 'description'] }],
    order: [[sortBy, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return { employees: rows, total: count };
};

const getById = async (id) => {
  const employee = await Employee.findByPk(id, {
    include: [{ model: Department, as: 'department', attributes: ['departmentId', 'name', 'description'] }],
  });
  if (!employee) {
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  }
  return employee;
};

const create = async ({ name, email, role, departmentId }) => {
  if (departmentId) {
    const dept = await Department.findByPk(departmentId);
    if (!dept) {
      const err = new Error('Department not found');
      err.statusCode = 404;
      throw err;
    }
  }

  const existing = await Employee.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Employee with this email already exists');
    err.statusCode = 400;
    throw err;
  }

  const employee = await Employee.create({ name, email, role: role || 'EMPLOYEE', departmentId });
  logger.info(`Employee created: ${employee.name} (${employee.employeeId})`);
  return employee;
};

const update = async (id, updates) => {
  const employee = await Employee.findByPk(id);
  if (!employee) {
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  }

  if (updates.departmentId) {
    const dept = await Department.findByPk(updates.departmentId);
    if (!dept) {
      const err = new Error('Department not found');
      err.statusCode = 404;
      throw err;
    }
  }

  await employee.update(updates);
  logger.info(`Employee updated: ${employee.name} (${employee.employeeId})`);
  return employee.reload({
    include: [{ model: Department, as: 'department', attributes: ['departmentId', 'name', 'description'] }],
  });
};

const remove = async (id) => {
  const employee = await Employee.findByPk(id);
  if (!employee) {
    const err = new Error('Employee not found');
    err.statusCode = 404;
    throw err;
  }
  await employee.destroy();
  logger.info(`Employee deleted: ${employee.name} (${id})`);
  return employee;
};

module.exports = { getAll, getById, create, update, remove };
