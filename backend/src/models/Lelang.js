const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lelang = sequelize.define('Lelang', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    barangId: { type: DataTypes.INTEGER, allowNull: false },
    tanggalMulai: { type: DataTypes.DATE, allowNull: false },
    tanggalSelesai: { type: DataTypes.DATE, allowNull: false },
    hargaAkhir: { type: DataTypes.INTEGER, defaultValue: 0 },
    pemenangId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('dibuka', 'ditutup'), defaultValue: 'dibuka' },
    adminId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Lelang;
