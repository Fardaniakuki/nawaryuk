import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BerandaPage() {
    const { apiFetch } = useAuth();
    const [stats, setStats] = useState({ barangs: 0, lelangs: 0, penawarans: 0, pembayarans: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [b, l, p] = await Promise.all([apiFetch('/barangs'), apiFetch('/lelangs'), apiFetch('/pembayarans')]);
                setStats({ barangs: b.length, lelangs: l.length, penawarans: l.reduce((s, x) => s + (x.Penawarans?.length || 0), 0), pembayarans: p.length });
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Jumlah Barang', value: stats.barangs },
        { label: 'Jumlah Lelang', value: stats.lelangs },
        { label: 'Jumlah Penawaran', value: stats.penawarans },
        { label: 'Jumlah Pembayaran', value: stats.pembayarans },
    ];

    return (
        <>
            <div className="panel-header"><h2>🏠 Beranda</h2></div>
            <div className="dashboard-cards">
                {cards.map(c => (
                    <div className="dash-card" key={c.label}>
                        <div><h3>{c.label}</h3></div>
                        <div className="num">{c.value}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
