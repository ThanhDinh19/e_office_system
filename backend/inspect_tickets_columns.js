const sequelize = require('./src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('tickets');
    console.log(JSON.stringify(desc, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
