import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BarangPage() {
    const { apiFetch } = useAuth();
    const [barangs, setBarangs] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ namaBarang: '', deskripsi: '', hargaAwal: '', gambar: '' });
    const [editId, setEditId] = useState(null);
    const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    const load = async () => { try { setBarangs(await apiFetch('/barangs')); } catch (e) { console.error(e); } };
    useEffect(() => { load(); }, []);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const openAdd = () => { setForm({ namaBarang: '', deskripsi: '', hargaAwal: '', gambar: '' }); setModal('add'); };
    const openEdit = b => { setForm({ namaBarang: b.namaBarang, deskripsi: b.deskripsi, hargaAwal: b.hargaAwal, gambar: b.gambar }); setEditId(b.id); setModal('edit'); };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const payload = { ...form, hargaAwal: Number(form.hargaAwal) };
            if (modal === 'add') await apiFetch('/barangs', { method: 'POST', body: JSON.stringify(payload) });
            else await apiFetch(`/barangs/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
            setModal(null); load();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async id => {
        if (!confirm('Hapus barang ini?')) return;
        try { await apiFetch(`/barangs/${id}`, { method: 'DELETE' }); load(); } catch (err) { alert(err.message); }
    };

    const statusLabel = { pending: 'Pending', dilelang: 'Dilelang', terjual: 'Terjual' };

    return (
        <>
            <div className="panel-header">
                <h2>📦 Pendataan Barang</h2>
                <button className="btn btn-primary" onClick={openAdd}>+ Tambah Barang</button>
            </div>
            <div className="panel">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>No.</th><th>Nama Barang</th><th>Harga Awal</th><th>Status</th><th>Deskripsi</th><th>Oleh</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {barangs.map((b, i) => (
                                <tr key={b.id}>
                                    <td>{i + 1}</td><td>{b.namaBarang}</td><td>{formatRp(b.hargaAwal)}</td>
                                    <td><span className={`badge ${b.status}`}>{statusLabel[b.status]}</span></td>
                                    <td>{b.deskripsi?.substring(0, 50) || '-'}</td><td>{b.petugas?.nama || '-'}</td>
                                    <td style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn-action edit" onClick={() => openEdit(b)}>Edit</button>
                                        <button className="btn-action delete" onClick={() => handleDelete(b.id)}>Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {barangs.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Belum ada barang</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>{modal === 'add' ? 'Tambah Barang' : 'Edit Barang'}</h3><button className="modal-close" onClick={() => setModal(null)}>×</button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group"><label>Nama Barang</label><input name="namaBarang" value={form.namaBarang} onChange={handleChange} required /></div>
                                <div className="form-group"><label>Harga Awal (Rp)</label><input name="hargaAwal" type="number" value={form.hargaAwal} onChange={handleChange} required min={0} /></div>
                                <div className="form-group"><label>URL Gambar</label><input name="gambar" value={form.gambar} onChange={handleChange} placeholder="https://..." /></div>
                                <div className="form-group"><label>Deskripsi</label><textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={3} /></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Batal</button>
                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
