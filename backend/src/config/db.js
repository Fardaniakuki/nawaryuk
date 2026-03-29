const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // path.resolve memastikan alamatnya benar-benar absolut dari root
    storage: path.resolve(process.cwd(), 'backend', 'database.sqlite'),
    logging: false,
});

module.exports = sequelize;