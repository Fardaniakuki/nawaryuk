import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuConfig = {
    admin: [
        { path: '/beranda', label: 'Beranda', icon: 'beranda' },
        { path: '/barangs', label: 'Pendataan Barang', icon: 'barang' },
        { path: '/lelangs', label: 'Lelang', icon: 'lelang' },
        { path: '/penawarans', label: 'Penawaran', icon: 'penawaran' },
        { path: '/pembayarans', label: 'Pembayaran', icon: 'pembayaran' },
        { path: '/laporans', label: 'Laporan', icon: 'laporan' },
    ],
    petugas: [
        { path: '/barangs', label: 'Pendataan Barang', icon: 'barang' },
        { path: '/pembayarans', label: 'Pembayaran', icon: 'pembayaran' },
        { path: '/laporans', label: 'Laporan', icon: 'laporan' },
    ],
    masyarakat: [
        { path: '/lelangs', label: 'Penawaran', icon: 'penawaran' },
        { path: '/pembayarans', label: 'Pembayaran', icon: 'pembayaran' },
    ],
};

const icons = {
    beranda: <svg viewBox="0 0 30 30"><path d="M16.667 10V0H30V10H16.667ZM0 16.667V0H13.333V16.667H0ZM16.667 30V13.333H30V30H16.667ZM0 30V20H13.333V30H0Z" /></svg>,
    barang: <svg viewBox="0 0 24 24"><path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10h20V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-8h3v2h2v-2h6v2h2v-2h3v8z" /></svg>,
    lelang: <svg viewBox="0 0 24 24"><path d="M17.65 6.35a7.95 7.95 0 00-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 007.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 01-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0112 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" /></svg>,
    penawaran: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.94s4.18 1.36 4.18 3.85c0 1.89-1.44 2.98-3.12 3.19z" /></svg>,
    pembayaran: <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>,
    laporan: <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>,
};

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menus = menuConfig[user?.role] || [];

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-logo">
                    <span>🔨 NawarYuk</span>
                </div>
                <div className="header-right">
                    <svg viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 40c2.3 0 4.1-1.8 4.1-4H12.4c0 2.2 1.8 4 4.1 4zm12.3-12V18c0-6.1-4.3-11.2-10.2-12.5V4c0-1.1-.9-2-2.1-2s-2.1.9-2.1 2v1.5C8.5 6.8 4.2 11.9 4.2 18v10L0 32v2h33v-2l-4.2-4z" fill="white" /></svg>
                    <svg viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.5 31.72a14.4 14.4 0 007.11-1.9V25.16a4.38 4.38 0 00-4.37-4.38h-5.48a4.38 4.38 0 00-4.37 4.38v4.66a14.4 14.4 0 007.1 1.9zm10.39-6.56v2.05A14.22 14.22 0 0017.5 3.28 14.22 14.22 0 007.11 27.21v-2.05a7.65 7.65 0 015.44-7.31 6.56 6.56 0 114.5-12.97 6.56 6.56 0 019.84 5.68c0 2.19-1.08 4.12-2.73 5.3a7.65 7.65 0 013.73 7.3zM17.5 35a17.5 17.5 0 100-35 17.5 17.5 0 000 35zm3.28-21.88a3.28 3.28 0 11-6.56 0 3.28 3.28 0 016.56 0z" fill="white" /></svg>
                </div>
            </header>
            <div className="main-content">
                <nav className="sidebar">
                    {menus.map(m => (
                        <NavLink key={m.path} to={m.path} className={({ isActive }) => isActive ? 'active' : ''}>
                            {icons[m.icon]}<span>{m.label}</span>
                        </NavLink>
                    ))}
                    <div className="sidebar-logout">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                            <svg viewBox="0 0 18 18"><path d="M2 18a2 2 0 01-2-2V2C0 .9.9 0 2 0h7v2H2v14h7v2H2zm11-4l-1.4-1.45L14.2 10H6V8h8.2l-2.6-2.55L13 4l5 5-5 5z" /></svg>
                            <span>Keluar</span>
                        </a>
                    </div>
                </nav>
                <main className="page-content"><Outlet /></main>
            </div>
        </div>
    );
}
