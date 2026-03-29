const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'Akses ditolak.' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(401).json({ message: 'User tidak ditemukan.' });
        req.user = user;
        next();
    } catch (error) { res.status(401).json({ message: 'Token tidak valid.' }); }
};

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Akses tidak diizinkan.' });
    next();
};

module.exports = { auth, authorize };
