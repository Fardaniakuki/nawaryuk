import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LelangPage() {
    const { apiFetch, user } = useAuth();
    const [lelangs, setLelangs] = useState([]);
    const [barangs, setBarangs] = useState([]);
    const [modal, setModal] = useState(null);
    const [bidModal, setBidModal] = useState(null);
    const [form, setForm] = useState({ barangId: '', tanggalMulai: '', tanggalSelesai: '' });
    const [bidForm, setBidForm] = useState({ hargaTawar: '' });
    const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const formatDate = d => d ? new Date(d).toLocaleDateString('id-ID') : '-';

    const load = async () => {
        try {
            const l = await apiFetch('/lelangs');
            setLelangs(l);
            if (user.role === 'admin') { const b = await apiFetch('/barangs'); setBarangs(b.filter(x => x.status === 'pending')); }
        } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        try { await apiFetch('/lelangs', { method: 'POST', body: JSON.stringify(form) }); setModal(null); load(); }
        catch (err) { alert(err.message); }
    };

    const handleTutup = async id => {
        if (!confirm('Tutup lelang ini? Pemenang akan ditentukan dari harga tertinggi.')) return;
        try { await apiFetch(`/lelangs/${id}/tutup`, { method: 'PUT' }); load(); }
        catch (err) { alert(err.message); }
    };

    const handleBid = async e => {
        e.preventDefault();
        try { await apiFetch('/penawarans', { method: 'POST', body: JSON.stringify({ lelangId: bidModal.id, hargaTawar: Number(bidForm.hargaTawar) }) }); setBidModal(null); setBidForm({ hargaTawar: '' }); load(); }
        catch (err) { alert(err.message); }
    };

    const handleDelete = async id => {
        if (!confirm('Hapus lelang ini?')) return;
        try { await apiFetch(`/lelangs/${id}`, { method: 'DELETE' }); load(); }
        catch (err) { alert(err.message); }
    };

    return (
        <>
            <div className="panel-header">
                <h2>🔨 {user.role === 'masyarakat' ? 'Penawaran Lelang' : 'Kelola Lelang'}</h2>
                {user.role === 'admin' && <button className="btn btn-primary" onClick={() => { setForm({ barangId: barangs[0]?.id || '', tanggalMulai: '', tanggalSelesai: '' }); setModal('add'); }}>+ Buka Lelang Baru</button>}
            </div>
            <div className="panel">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>No.</th><th>Barang</th><th>Harga Awal</th><th>Harga Tertinggi</th><th>Mulai</th><th>Selesai</th><th>Status</th><th>Pemenang</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {lelangs.map((l, i) => (
                                <tr key={l.id}>
                                    <td>{i + 1}</td><td>{l.Barang?.namaBarang}</td><td>{formatRp(l.Barang?.hargaAwal || 0)}</td><td>{formatRp(l.hargaAkhir)}</td>
                                    <td>{formatDate(l.tanggalMulai)}</td><td>{formatDate(l.tanggalSelesai)}</td>
                                    <td><span className={`badge ${l.status}`}>{l.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}</span></td>
                                    <td>{l.pemenang?.nama || '-'}</td>
                                    <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {user.role === 'admin' && l.status === 'dibuka' && <button className="btn-action delete" onClick={() => handleTutup(l.id)}>Tutup</button>}
                                        {user.role === 'admin' && <button className="btn-action delete" onClick={() => handleDelete(l.id)}>Hapus</button>}
                                        {user.role === 'masyarakat' && l.status === 'dibuka' && <button className="btn-action verify" onClick={() => { setBidModal(l); setBidForm({ hargaTawar: '' }); }}>Tawar</button>}
                                        <span style={{ fontSize: 11, color: '#888' }}>{l.Penawarans?.length || 0} bid</span>
                                    </td>
                                </tr>
                            ))}
                            {lelangs.length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40 }}>Belum ada lelang</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Buka Lelang Baru</h3><button className="modal-close" onClick={() => setModal(null)}>×</button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Barang</label>
                                    <select name="barangId" value={form.barangId} onChange={e => setForm({ ...form, barangId: e.target.value })} required>
                                        <option value="">Pilih Barang</option>
                                        {barangs.map(b => <option key={b.id} value={b.id}>{b.namaBarang} - {formatRp(b.hargaAwal)}</option>)}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Tanggal Mulai</label><input type="date" value={form.tanggalMulai} onChange={e => setForm({ ...form, tanggalMulai: e.target.value })} required /></div>
                                    <div className="form-group"><label>Tanggal Selesai</label><input type="date" value={form.tanggalSelesai} onChange={e => setForm({ ...form, tanggalSelesai: e.target.value })} required /></div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Batal</button>
                                <button type="submit" className="btn btn-primary">Buka Lelang</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {bidModal && (
                <div className="modal-overlay" onClick={() => setBidModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Ajukan Penawaran</h3><button className="modal-close" onClick={() => setBidModal(null)}>×</button></div>
                        <form onSubmit={handleBid}>
                            <div className="modal-body">
                                <p><strong>Barang:</strong> {bidModal.Barang?.namaBarang}</p>
                                <p><strong>Harga saat ini:</strong> {formatRp(bidModal.hargaAkhir)}</p>
                                <div className="form-group"><label>Tawaran Anda (Rp)</label><input type="number" value={bidForm.hargaTawar} onChange={e => setBidForm({ hargaTawar: e.target.value })} required min={bidModal.hargaAkhir + 1} /></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setBidModal(null)}>Batal</button>
                                <button type="submit" className="btn btn-success">Tawar Sekarang</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
