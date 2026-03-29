import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PembayaranPage() {
    const { apiFetch, user } = useAuth();
    const [pembayarans, setPembayarans] = useState([]);
    const [lelangs, setLelangs] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ lelangId: '', jumlah: '', metode: 'transfer', bukti: '' });
    const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const formatDate = d => d ? new Date(d).toLocaleDateString('id-ID') : '-';

    const load = async () => {
        try {
            setPembayarans(await apiFetch('/pembayarans'));
            if (user.role === 'masyarakat') {
                const ls = await apiFetch('/lelangs');
                setLelangs(ls.filter(l => l.status === 'ditutup' && l.pemenangId === user.id));
            }
        } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await apiFetch('/pembayarans', { method: 'POST', body: JSON.stringify({ ...form, jumlah: Number(form.jumlah) }) });
            setModal(null); load();
        } catch (err) { alert(err.message); }
    };

    const handleVerify = async (id, status) => {
        try { await apiFetch(`/pembayarans/${id}/verify`, { method: 'PUT', body: JSON.stringify({ status }) }); load(); }
        catch (err) { alert(err.message); }
    };

    const statusLabel = { pending: 'Pending', verified: 'Verified', rejected: 'Rejected' };

    return (
        <>
            <div className="panel-header">
                <h2>💳 Pembayaran</h2>
                {user.role === 'masyarakat' && <button className="btn btn-primary" onClick={() => { setForm({ lelangId: lelangs[0]?.id || '', jumlah: '', metode: 'transfer', bukti: '' }); setModal('add'); }}>+ Bayar</button>}
            </div>
            <div className="panel">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>No.</th><th>Barang</th><th>Pembeli</th><th>Jumlah</th><th>Metode</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {pembayarans.map((p, i) => (
                                <tr key={p.id}>
                                    <td>{i + 1}</td><td>{p.Lelang?.Barang?.namaBarang || '-'}</td><td>{p.pembeli?.nama || '-'}</td><td>{formatRp(p.jumlah)}</td><td>{p.metode}</td>
                                    <td><span className={`badge ${p.status}`}>{statusLabel[p.status]}</span></td><td>{formatDate(p.createdAt)}</td>
                                    <td style={{ display: 'flex', gap: 6 }}>
                                        {(user.role === 'petugas' || user.role === 'admin') && p.status === 'pending' && (
                                            <>
                                                <button className="btn-action verify" onClick={() => handleVerify(p.id, 'verified')}>Verifikasi</button>
                                                <button className="btn-action delete" onClick={() => handleVerify(p.id, 'rejected')}>Tolak</button>
                                            </>
                                        )}
                                        {p.status !== 'pending' && <span style={{ fontSize: 11, color: '#888' }}>{p.verifier?.nama || 'Auto'}</span>}
                                    </td>
                                </tr>
                            ))}
                            {pembayarans.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>Belum ada pembayaran</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Kirim Pembayaran</h3><button className="modal-close" onClick={() => setModal(null)}>×</button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Lelang (yang Anda menangkan)</label>
                                    <select value={form.lelangId} onChange={e => setForm({ ...form, lelangId: e.target.value })} required>
                                        <option value="">Pilih Lelang</option>
                                        {lelangs.map(l => <option key={l.id} value={l.id}>{l.Barang?.namaBarang} - {formatRp(l.hargaAkhir)}</option>)}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Jumlah (Rp)</label><input type="number" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} required min={0} /></div>
                                    <div className="form-group">
                                        <label>Metode</label>
                                        <select value={form.metode} onChange={e => setForm({ ...form, metode: e.target.value })}>
                                            <option value="transfer">Transfer Bank</option><option value="ewallet">E-Wallet</option><option value="tunai">Tunai</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group"><label>Bukti Pembayaran (URL)</label><input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} placeholder="https://..." /></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Batal</button>
                                <button type="submit" className="btn btn-success">Kirim Pembayaran</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
