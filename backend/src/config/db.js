const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // process.cwd() akan menunjuk ke folder utama project kamu di Vercel
    storage: path.join(process.cwd(), 'backend', 'database.sqlite'), 
    logging: false,
});

module.exports = sequelize;