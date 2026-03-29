import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LaporanPage() {
    const { apiFetch } = useAuth();
    const [data, setData] = useState({ lelangs: [], pembayarans: [], summary: {} });
    const [filter, setFilter] = useState({ startDate: '', endDate: '', status: '' });
    const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const formatDate = d => d ? new Date(d).toLocaleDateString('id-ID') : '-';

    const load = async () => {
        try {
            const params = new URLSearchParams();
            if (filter.startDate) params.set('startDate', filter.startDate);
            if (filter.endDate) params.set('endDate', filter.endDate);
            if (filter.status) params.set('status', filter.status);
            setData(await apiFetch(`/laporans?${params}`));
        } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const handlePrint = () => {
        const w = window.open('', '_blank');
        w.document.write(`<html><head><title>Laporan NawarYuk</title><style>body{font-family:Nunito,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#FFF0C4}h2{color:#3E0703}.summary{display:flex;gap:20px;margin:16px 0}.summary div{background:#FFF0C4;padding:12px 20px;border-radius:8px}</style></head><body>
    <h2>🔨 Laporan NawarYuk - Sistem Lelang Online</h2>
    <p>Tanggal cetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
    <div class="summary"><div><strong>Total Lelang:</strong> ${data.summary.totalLelang}</div><div><strong>Lelang Ditutup:</strong> ${data.summary.lelangDitutup}</div><div><strong>Total Penawaran:</strong> ${data.summary.totalPenawaran}</div><div><strong>Total Pendapatan:</strong> ${formatRp(data.summary.totalPendapatan || 0)}</div></div>
    <h3>Data Lelang</h3>
    <table><thead><tr><th>No</th><th>Barang</th><th>Harga Awal</th><th>Harga Akhir</th><th>Status</th><th>Pemenang</th></tr></thead><tbody>
    ${data.lelangs.map((l, i) => `<tr><td>${i + 1}</td><td>${l.Barang?.namaBarang || '-'}</td><td>${formatRp(l.Barang?.hargaAwal || 0)}</td><td>${formatRp(l.hargaAkhir)}</td><td>${l.status}</td><td>${l.pemenang?.nama || '-'}</td></tr>`).join('')}
    </tbody></table>
    <h3 style="margin-top:20px">Data Pembayaran</h3>
    <table><thead><tr><th>No</th><th>Barang</th><th>Pembeli</th><th>Jumlah</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>
    ${data.pembayarans.map((p, i) => `<tr><td>${i + 1}</td><td>${p.Lelang?.Barang?.namaBarang || '-'}</td><td>${p.pembeli?.nama || '-'}</td><td>${formatRp(p.jumlah)}</td><td>${p.status}</td><td>${formatDate(p.createdAt)}</td></tr>`).join('')}
    </tbody></table></body></html>`);
        w.document.close(); w.print();
    };

    return (
        <>
            <div className="panel-header">
                <h2>📊 Laporan</h2>
                <div className="filter-bar">
                    <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })} />
                    <input type="date" value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })} />
                    <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
                        <option value="">Semua Status</option><option value="dibuka">Dibuka</option><option value="ditutup">Ditutup</option>
                    </select>
                    <button className="btn btn-primary" onClick={load}>Filter</button>
                    <button className="btn btn-success" onClick={handlePrint}>🖨️ Cetak</button>
                </div>
            </div>

            <div className="dashboard-cards" style={{ marginBottom: 20 }}>
                <div className="dash-card"><div><h3>Total Lelang</h3></div><div className="num">{data.summary.totalLelang || 0}</div></div>
                <div className="dash-card"><div><h3>Lelang Ditutup</h3></div><div className="num">{data.summary.lelangDitutup || 0}</div></div>
                <div className="dash-card"><div><h3>Total Penawaran</h3></div><div className="num">{data.summary.totalPenawaran || 0}</div></div>
                <div className="dash-card"><div><h3>Total Pendapatan</h3></div><div className="num" style={{ fontSize: 20 }}>{formatRp(data.summary.totalPendapatan || 0)}</div></div>
            </div>

            <div className="panel">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>No.</th><th>Barang</th><th>Harga Awal</th><th>Harga Akhir</th><th>Status</th><th>Pemenang</th><th>Penawaran</th></tr></thead>
                        <tbody>
                            {data.lelangs?.map((l, i) => (
                                <tr key={l.id}>
                                    <td>{i + 1}</td><td>{l.Barang?.namaBarang}</td><td>{formatRp(l.Barang?.hargaAwal || 0)}</td><td>{formatRp(l.hargaAkhir)}</td>
                                    <td><span className={`badge ${l.status}`}>{l.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}</span></td>
                                    <td>{l.pemenang?.nama || '-'}</td><td>{l.Penawarans?.length || 0}</td>
                                </tr>
                            ))}
                            {(!data.lelangs || data.lelangs.length === 0) && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Belum ada data</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
