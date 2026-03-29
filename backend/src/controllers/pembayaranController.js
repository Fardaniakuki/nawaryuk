const { Pembayaran, Lelang, Barang, User } = require('../models');

class PembayaranController {
    static async getAll(req, res) {
        try {
            const where = {};
            if (req.user.role === 'masyarakat') where.userId = req.user.id;
            const pembayarans = await Pembayaran.findAll({
                where,
                include: [
                    { model: Lelang, include: [{ model: Barang, attributes: ['id', 'namaBarang', 'gambar'] }] },
                    { model: User, as: 'pembeli', attributes: ['id', 'nama', 'username'] },
                    { model: User, as: 'verifier', attributes: ['id', 'nama'] },
                ],
                order: [['createdAt', 'DESC']],
            });
            res.json(pembayarans);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async create(req, res) {
        try {
            const { lelangId, jumlah, metode, bukti } = req.body;
            const lelang = await Lelang.findByPk(lelangId);
            if (!lelang) return res.status(404).json({ message: 'Lelang tidak ditemukan' });
            const p = await Pembayaran.create({ lelangId, userId: req.user.id, jumlah, metode, bukti });
            res.status(201).json({ message: 'Pembayaran berhasil dikirim', pembayaran: p });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async verify(req, res) {
        try {
            const p = await Pembayaran.findByPk(req.params.id);
            if (!p) return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
            await p.update({ status: req.body.status, petugasId: req.user.id });
            const populated = await Pembayaran.findByPk(p.id, {
                include: [{ model: Lelang, include: [Barang] }, { model: User, as: 'pembeli' }, { model: User, as: 'verifier' }],
            });
            res.json({ message: 'Status pembayaran diperbarui', pembayaran: populated });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = PembayaranController;
