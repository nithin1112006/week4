const app = require('./app');
const sequelize = require('./models/index');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync({ force: true });
    logger.info('Database synced successfully');

    const User = require('./models/User');
    const existing = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!existing) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN',
      });
      await User.create({
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'MANAGER',
      });
      await User.create({
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'employee123',
        role: 'EMPLOYEE',
      });
      logger.info('Seed users created');
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
