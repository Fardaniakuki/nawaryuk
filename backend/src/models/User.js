const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'petugas', 'masyarakat'), defaultValue: 'masyarakat' },
    alamat: { type: DataTypes.STRING, defaultValue: '' },
    noTelpon: { type: DataTypes.STRING, defaultValue: '' },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
        },
    },
});

User.prototype.comparePassword = async function (pwd) {
    return bcrypt.compare(pwd, this.password);
};

User.prototype.toJSON = function () {
    const v = { ...this.get() };
    delete v.password;
    return v;
};

module.exports = User;
