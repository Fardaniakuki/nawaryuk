const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
    static async register(req, res) {
        try {
            const { nama, username, password, alamat, noTelpon } = req.body;
            const exists = await User.findOne({ where: { username } });
            if (exists) return res.status(400).json({ message: 'Username sudah digunakan' });
            const user = await User.create({ nama, username, password, alamat, noTelpon, role: 'masyarakat' });
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ message: 'Registrasi berhasil', token, user });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } });
            if (!user) return res.status(400).json({ message: 'Username atau password salah' });
            const match = await user.comparePassword(password);
            if (!match) return res.status(400).json({ message: 'Username atau password salah' });
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ message: 'Login berhasil', token, user });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async getMe(req, res) {
        try { res.json(await User.findByPk(req.user.id)); }
        catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = AuthController;
