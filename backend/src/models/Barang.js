const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Barang = sequelize.define('Barang', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    namaBarang: { type: DataTypes.STRING, allowNull: false },
    deskripsi: { type: DataTypes.TEXT, defaultValue: '' },
    hargaAwal: { type: DataTypes.INTEGER, allowNull: false },
    gambar: { type: DataTypes.STRING, defaultValue: '' },
    status: { type: DataTypes.ENUM('pending', 'dilelang', 'terjual'), defaultValue: 'pending' },
    petugasId: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = Barang;
