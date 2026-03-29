const { Barang, User } = require('../models');

class BarangController {
    static async getAll(req, res) {
        try {
            const barangs = await Barang.findAll({ include: [{ model: User, as: 'petugas', attributes: ['id', 'nama'] }], order: [['createdAt', 'DESC']] });
            res.json(barangs);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async getById(req, res) {
        try {
            const b = await Barang.findByPk(req.params.id, { include: [{ model: User, as: 'petugas' }] });
            if (!b) return res.status(404).json({ message: 'Barang tidak ditemukan' });
            res.json(b);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async create(req, res) {
        try {
            const b = await Barang.create({ ...req.body, petugasId: req.user.id });
            res.status(201).json({ message: 'Barang berhasil ditambahkan', barang: b });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async update(req, res) {
        try {
            const b = await Barang.findByPk(req.params.id);
            if (!b) return res.status(404).json({ message: 'Barang tidak ditemukan' });
            await b.update(req.body);
            res.json({ message: 'Barang berhasil diperbarui', barang: b });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async delete(req, res) {
        try {
            const b = await Barang.findByPk(req.params.id);
            if (!b) return res.status(404).json({ message: 'Barang tidak ditemukan' });
            await b.destroy();
            res.json({ message: 'Barang berhasil dihapus' });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = BarangController;
