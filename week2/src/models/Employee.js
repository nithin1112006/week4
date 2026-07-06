const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Department = require('./Department');

const Employee = sequelize.define('Employee', {
  employeeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MANAGER', 'EMPLOYEE'),
    defaultValue: 'EMPLOYEE',
  },
  departmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Department,
      key: 'departmentId',
    },
  },
}, {
  timestamps: true,
});

Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });

module.exports = Employee;
