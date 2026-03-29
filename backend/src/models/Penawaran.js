const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Penawaran = sequelize.define('Penawaran', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lelangId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    hargaTawar: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Penawaran;
