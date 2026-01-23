const sequelize = require('./config/database');
const { Employee } = require('./models');
require('./models');
const app = require('./app');
const createDefaultUsers = require('./seed/seedAdmin');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // create default users
    await createDefaultUsers();

    // Test query
    const employees = await Employee.findAll();
    console.log('Employees:', employees.map(e => e.full_name));

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
};

startServer();