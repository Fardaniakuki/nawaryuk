import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            const data = await login(username, password);
            const role = data.user.role;
            if (role === 'admin') navigate('/beranda');
            else if (role === 'petugas') navigate('/barangs');
            else navigate('/lelangs');
        } catch (err) { setError(err.message); }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Selamat Datang Kembali di NawarYuk</h1>
                <p className="subtitle">Masuk sekarang dan jangan lewatkan kesempatan memenangkan lelang terbaik hari ini</p>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Nama Pengguna</label>
                        <div className="input-group">
                            <div className="input-icon">
                                <svg viewBox="0 0 17 20" fill="black"><path d="M11.261 12.238C11.138 12.198 10.359 11.846 10.845 10.362H10.839C12.107 9.051 13.076 6.942 13.076 4.866 13.076 1.674 10.96 0 8.501 0 6.04 0 3.935 1.673 3.935 4.866 3.935 6.951 4.899 9.068 6.175 10.376 6.673 11.685 5.783 12.171 5.597 12.239 3.022 13.174 0 14.877 0 16.558V17.188C0 19.479 4.427 20 8.525 20 12.628 20 17 19.479 17 17.188V16.558C17 14.826 13.963 13.136 11.261 12.238Z" /></svg>
                            </div>
                            <input type="text" placeholder="Masukkan nama pengguna anda..." value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Kata Sandi</label>
                        <div className="input-group">
                            <div className="input-icon">
                                <svg viewBox="0 0 25 25" fill="black"><path d="M21.429 14.286V12.5c0-.474-.188-.928-.523-1.263a1.786 1.786 0 00-1.263-.523H1.786c-.474 0-.928.188-1.263.523A1.786 1.786 0 000 12.5v10.714c0 .474.188.928.523 1.263.335.335.789.523 1.263.523h17.857c.474 0 .928-.188 1.263-.523.335-.335.523-.789.523-1.263v-1.786m0-7.142h-7.143a3.571 3.571 0 100 7.142h7.143a3.571 3.571 0 100-7.142M5.357 10.714V5.357a5.357 5.357 0 1110.714 0v5.357" stroke="black" strokeWidth="2" fill="none" /></svg>
                            </div>
                            <input type="password" placeholder="Masukkan kata sandi anda..." value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <p className="auth-link">Belum punya akun? <Link to="/register">daftar di sini</Link></p>
                    <button type="submit" className="auth-btn">Masuk</button>
                </form>
            </div>
        </div>
    );
}
