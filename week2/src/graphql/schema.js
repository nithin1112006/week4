const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Department {
    departmentId: ID!
    name: String!
    description: String
    createdAt: String
  }

  type Employee {
    employeeId: ID!
    name: String!
    email: String!
    role: String!
    departmentId: ID
    department: Department
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    userId: ID!
    name: String!
    email: String!
    role: String!
  }

  type PaginatedEmployees {
    employees: [Employee]
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type Query {
    employees(page: Int, limit: Int, sortBy: String, sortOrder: String, name: String, email: String, role: String, departmentId: String): PaginatedEmployees
    employee(id: ID!): Employee
    departments: [Department]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): User!
    login(email: String!, password: String!): AuthPayload!
    createDepartment(name: String!, description: String): Department!
    createEmployee(name: String!, email: String!, role: String, departmentId: String): Employee!
    updateEmployee(id: ID!, name: String, email: String, role: String, departmentId: String): Employee!
    deleteEmployee(id: ID!): Employee!
  }
`);

module.exports = schema;
