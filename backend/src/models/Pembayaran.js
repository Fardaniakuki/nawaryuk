const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pembayaran = sequelize.define('Pembayaran', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lelangId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    jumlah: { type: DataTypes.INTEGER, allowNull: false },
    metode: { type: DataTypes.STRING, defaultValue: 'transfer' },
    status: { type: DataTypes.ENUM('pending', 'verified', 'rejected'), defaultValue: 'pending' },
    bukti: { type: DataTypes.STRING, defaultValue: '' },
    petugasId: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = Pembayaran;
