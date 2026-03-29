const { Op } = require('sequelize');
const { Lelang, Barang, Penawaran, Pembayaran, User } = require('../models');

class LaporanController {
    static async get(req, res) {
        try {
            const where = {};
            if (req.query.status) where.status = req.query.status;
            if (req.query.startDate && req.query.endDate) where.createdAt = { [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate + 'T23:59:59')] };

            const lelangs = await Lelang.findAll({
                where, include: [Barang, { model: User, as: 'pemenang', attributes: ['id', 'nama'] }, { model: Penawaran }], order: [['createdAt', 'DESC']],
            });
            const pembayarans = await Pembayaran.findAll({
                include: [{ model: Lelang, include: [Barang] }, { model: User, as: 'pembeli', attributes: ['id', 'nama'] }], order: [['createdAt', 'DESC']],
            });

            const totalLelang = lelangs.length;
            const lelangDitutup = lelangs.filter(l => l.status === 'ditutup').length;
            const totalPenawaran = lelangs.reduce((s, l) => s + (l.Penawarans?.length || 0), 0);
            const totalPendapatan = pembayarans.filter(p => p.status === 'verified').reduce((s, p) => s + p.jumlah, 0);

            res.json({ lelangs, pembayarans, summary: { totalLelang, lelangDitutup, totalPenawaran, totalPendapatan } });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = LaporanController;
