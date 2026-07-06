const authService = require('../services/auth.service');
const departmentService = require('../services/department.service');
const employeeService = require('../services/employee.service');
const emailService = require('../services/email.service');

const resolvers = {
  employees: async ({ page, limit, sortBy, sortOrder, name, email, role, departmentId }) => {
    const result = await employeeService.getAll({ page, limit, sortBy, sortOrder, name, email, role, departmentId });
    return {
      employees: result.employees,
      total: result.total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      totalPages: Math.ceil(result.total / (parseInt(limit) || 10)),
    };
  },
  employee: async ({ id }) => {
    return employeeService.getById(id);
  },
  departments: async () => {
    return departmentService.getAll();
  },
  register: async ({ name, email, password, role }) => {
    return authService.register({ name, email, password, role });
  },
  login: async ({ email, password }) => {
    return authService.login({ email, password });
  },
  createDepartment: async ({ name, description }) => {
    return departmentService.create({ name, description });
  },
  createEmployee: async ({ name, email, role, departmentId }) => {
    const employee = await employeeService.create({ name, email, role, departmentId });
    emailService.sendWelcomeEmail(employee);
    return employee;
  },
  updateEmployee: async ({ id, ...updates }) => {
    return employeeService.update(id, updates);
  },
  deleteEmployee: async ({ id }) => {
    const employee = await employeeService.remove(id);
    return employee;
  },
};

module.exports = resolvers;
