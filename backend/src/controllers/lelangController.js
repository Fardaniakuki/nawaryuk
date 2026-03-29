const { Lelang, Barang, User, Penawaran } = require('../models');

class LelangController {
    static async getAll(req, res) {
        try {
            const lelangs = await Lelang.findAll({
                include: [
                    { model: Barang, attributes: ['id', 'namaBarang', 'hargaAwal', 'gambar', 'deskripsi'] },
                    { model: User, as: 'admin', attributes: ['id', 'nama'] },
                    { model: User, as: 'pemenang', attributes: ['id', 'nama'] },
                    { model: Penawaran },
                ],
                order: [['createdAt', 'DESC']],
            });
            res.json(lelangs);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async getById(req, res) {
        try {
            const l = await Lelang.findByPk(req.params.id, {
                include: [Barang, { model: User, as: 'admin' }, { model: User, as: 'pemenang' },
                    { model: Penawaran, include: [{ model: User, as: 'penawar', attributes: ['id', 'nama'] }], order: [['hargaTawar', 'DESC']] }],
            });
            if (!l) return res.status(404).json({ message: 'Lelang tidak ditemukan' });
            res.json(l);
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async create(req, res) {
        try {
            const { barangId, tanggalMulai, tanggalSelesai } = req.body;
            const barang = await Barang.findByPk(barangId);
            if (!barang) return res.status(404).json({ message: 'Barang tidak ditemukan' });
            await barang.update({ status: 'dilelang' });
            const l = await Lelang.create({ barangId, tanggalMulai, tanggalSelesai, adminId: req.user.id, hargaAkhir: barang.hargaAwal });
            const populated = await Lelang.findByPk(l.id, { include: [Barang, { model: User, as: 'admin' }] });
            res.status(201).json({ message: 'Lelang berhasil dibuka', lelang: populated });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async tutup(req, res) {
        try {
            const l = await Lelang.findByPk(req.params.id, { include: [{ model: Penawaran, order: [['hargaTawar', 'DESC']] }] });
            if (!l) return res.status(404).json({ message: 'Lelang tidak ditemukan' });
            const topBid = l.Penawarans?.length > 0 ? l.Penawarans.reduce((a, b) => a.hargaTawar > b.hargaTawar ? a : b) : null;
            await l.update({ status: 'ditutup', hargaAkhir: topBid ? topBid.hargaTawar : l.hargaAkhir, pemenangId: topBid ? topBid.userId : null });
            const barang = await Barang.findByPk(l.barangId);
            if (topBid) await barang.update({ status: 'terjual' });
            else await barang.update({ status: 'pending' });
            const populated = await Lelang.findByPk(l.id, { include: [Barang, { model: User, as: 'admin' }, { model: User, as: 'pemenang' }] });
            res.json({ message: 'Lelang berhasil ditutup', lelang: populated });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }

    static async delete(req, res) {
        try {
            const l = await Lelang.findByPk(req.params.id);
            if (!l) return res.status(404).json({ message: 'Lelang tidak ditemukan' });
            await Penawaran.destroy({ where: { lelangId: l.id } });
            await Barang.update({ status: 'pending' }, { where: { id: l.barangId } });
            await l.destroy();
            res.json({ message: 'Lelang berhasil dihapus' });
        } catch (e) { res.status(500).json({ message: 'Server error', error: e.message }); }
    }
}

module.exports = LelangController;
