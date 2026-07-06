const Department = require('../models/Department');
const logger = require('../utils/logger');

const getAll = async () => {
  return Department.findAll({ order: [['createdAt', 'DESC']] });
};

const create = async ({ name, description }) => {
  const existing = await Department.findOne({ where: { name } });
  if (existing) {
    const err = new Error('Department already exists');
    err.statusCode = 400;
    throw err;
  }
  const department = await Department.create({ name, description });
  logger.info(`Department created: ${department.name} (${department.departmentId})`);
  return department;
};

module.exports = { getAll, create };
