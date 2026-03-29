const sequelize = require('../config/db');
const User = require('./User');
const Barang = require('./Barang');
const Lelang = require('./Lelang');
const Penawaran = require('./Penawaran');
const Pembayaran = require('./Pembayaran');

// User -> Barang (petugas created)
User.hasMany(Barang, { foreignKey: 'petugasId', as: 'barangDiinput' });
Barang.belongsTo(User, { foreignKey: 'petugasId', as: 'petugas' });

// Barang -> Lelang
Barang.hasMany(Lelang, { foreignKey: 'barangId' });
Lelang.belongsTo(Barang, { foreignKey: 'barangId' });

// User (admin) -> Lelang
User.hasMany(Lelang, { foreignKey: 'adminId', as: 'lelangDibuat' });
Lelang.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

// User (pemenang) -> Lelang
Lelang.belongsTo(User, { foreignKey: 'pemenangId', as: 'pemenang' });

// Lelang -> Penawaran
Lelang.hasMany(Penawaran, { foreignKey: 'lelangId' });
Penawaran.belongsTo(Lelang, { foreignKey: 'lelangId' });

// User -> Penawaran
User.hasMany(Penawaran, { foreignKey: 'userId', as: 'penawaranUser' });
Penawaran.belongsTo(User, { foreignKey: 'userId', as: 'penawar' });

// Lelang -> Pembayaran
Lelang.hasMany(Pembayaran, { foreignKey: 'lelangId' });
Pembayaran.belongsTo(Lelang, { foreignKey: 'lelangId' });

// User -> Pembayaran (pembeli)
User.hasMany(Pembayaran, { foreignKey: 'userId', as: 'pembayaranUser' });
Pembayaran.belongsTo(User, { foreignKey: 'userId', as: 'pembeli' });

// User -> Pembayaran (verifier petugas)
Pembayaran.belongsTo(User, { foreignKey: 'petugasId', as: 'verifier' });

module.exports = { sequelize, User, Barang, Lelang, Penawaran, Pembayaran };
