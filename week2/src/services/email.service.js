const { simulateEmail } = require('../utils/asyncQueue');

const sendWelcomeEmail = (employee) => {
  simulateEmail(
    employee.email,
    'Welcome to the Company!',
    `Hi ${employee.name},\n\nWelcome to our organization! We are excited to have you on board.\n\nBest regards,\nHR Team`
  );
};

module.exports = { sendWelcomeEmail };
