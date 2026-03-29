const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // process.cwd() = Folder paling luar project kamu
    // Lalu masuk ke folder 'backend' dan cari 'database.sqlite'
    storage: path.join(process.cwd(), 'backend', 'database.sqlite'),
    logging: false,
});

module.exports = sequelize;