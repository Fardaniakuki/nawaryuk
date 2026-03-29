const { Penawaran, Lelang, Barang, User } = require('../models');

class PenawaranController {
    static async getAll(req, res) {
        try {
            const where = {};
            if (req.query.lelang) where.lelangId = req.query.lelang;
            const penawarans = await Penawaran.findAll({
                where,
                include: [
                    { model: Lelang, include: [Barang] },
                    { model: User, as: 'penawar', attributes: ['id', 'nama', 'username'] },
                ],
                order: [['hargaTawar', 'DESC']],
            });
            res.json(penawarans);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async create(req, res) {
        try {
            const { lelangId, hargaTawar } = req.body;
            const lelang = await Lelang.findByPk(lelangId, { include: [Barang] });
            if (!lelang) return res.status(404).json({ message: 'Lelang tidak ditemukan' });
            if (lelang.status === 'ditutup') return res.status(400).json({ message: 'Lelang sudah ditutup' });
            if (hargaTawar <= lelang.hargaAkhir) return res.status(400).json({ message: `Tawaran harus lebih dari ${lelang.hargaAkhir}` });

            const p = await Penawaran.create({ lelangId, userId: req.user.id, hargaTawar });
            await lelang.update({ hargaAkhir: hargaTawar });

            const populated = await Penawaran.findByPk(p.id, {
                include: [{ model: User, as: 'penawar', attributes: ['id', 'nama'] }, { model: Lelang, include: [Barang] }],
            });
            res.status(201).json({ message: 'Penawaran berhasil', penawaran: populated });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = PenawaranController;
