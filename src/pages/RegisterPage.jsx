import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({ nama: '', username: '', password: '', confirmPassword: '', alamat: '', noTelpon: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (form.password !== form.confirmPassword) return setError('Kata sandi tidak cocok');
        try { await register(form); navigate('/lelangs'); }
        catch (err) { setError(err.message); }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Selamat Datang Kembali di NawarYuk</h1>
                <p className="subtitle">Daftar sekarang dan jangan lewatkan kesempatan memenangkan lelang terbaik hari ini</p>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Nama Lengkap</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 17 20" fill="black"><path d="M11.261 12.238C11.138 12.198 10.359 11.846 10.845 10.362H10.839C12.107 9.051 13.076 6.942 13.076 4.866 13.076 1.674 10.96 0 8.501 0 6.04 0 3.935 1.673 3.935 4.866 3.935 6.951 4.899 9.068 6.175 10.376 6.673 11.685 5.783 12.171 5.597 12.239 3.022 13.174 0 14.877 0 16.558V17.188C0 19.479 4.427 20 8.525 20 12.628 20 17 19.479 17 17.188V16.558C17 14.826 13.963 13.136 11.261 12.238Z" /></svg></div>
                            <input name="nama" placeholder="Masukkan nama lengkap anda..." value={form.nama} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Username</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 17 20" fill="black"><path d="M11.261 12.238C11.138 12.198 10.359 11.846 10.845 10.362H10.839C12.107 9.051 13.076 6.942 13.076 4.866 13.076 1.674 10.96 0 8.501 0 6.04 0 3.935 1.673 3.935 4.866 3.935 6.951 4.899 9.068 6.175 10.376 6.673 11.685 5.783 12.171 5.597 12.239 3.022 13.174 0 14.877 0 16.558V17.188C0 19.479 4.427 20 8.525 20 12.628 20 17 19.479 17 17.188V16.558C17 14.826 13.963 13.136 11.261 12.238Z" /></svg></div>
                            <input name="username" placeholder="Masukkan username anda..." value={form.username} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Alamat</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 24 24" fill="black"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg></div>
                            <input name="alamat" placeholder="Masukkan alamat anda..." value={form.alamat} onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Nomor Telpon</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 24 24" fill="black"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.02l-2.2 2.19z" /></svg></div>
                            <input name="noTelpon" placeholder="Masukkan nomor telpon anda..." value={form.noTelpon} onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Kata Sandi</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 25 25" fill="none"><path d="M21.429 14.286V12.5c0-.474-.188-.928-.523-1.263a1.786 1.786 0 00-1.263-.523H1.786c-.474 0-.928.188-1.263.523A1.786 1.786 0 000 12.5v10.714c0 .474.188.928.523 1.263.335.335.789.523 1.263.523h17.857c.474 0 .928-.188 1.263-.523.335-.335.523-.789.523-1.263v-1.786m0-7.142h-7.143a3.571 3.571 0 100 7.142h7.143a3.571 3.571 0 100-7.142M5.357 10.714V5.357a5.357 5.357 0 1110.714 0v5.357" stroke="black" strokeWidth="2" /></svg></div>
                            <input name="password" type="password" placeholder="Masukkan kata sandi anda..." value={form.password} onChange={handleChange} required minLength={6} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Konfirmasi Kata Sandi</label>
                        <div className="input-group">
                            <div className="input-icon"><svg viewBox="0 0 25 25" fill="none"><path d="M21.429 14.286V12.5c0-.474-.188-.928-.523-1.263a1.786 1.786 0 00-1.263-.523H1.786c-.474 0-.928.188-1.263.523A1.786 1.786 0 000 12.5v10.714c0 .474.188.928.523 1.263.335.335.789.523 1.263.523h17.857c.474 0 .928-.188 1.263-.523.335-.335.523-.789.523-1.263v-1.786m0-7.142h-7.143a3.571 3.571 0 100 7.142h7.143a3.571 3.571 0 100-7.142M5.357 10.714V5.357a5.357 5.357 0 1110.714 0v5.357" stroke="black" strokeWidth="2" /></svg></div>
                            <input name="confirmPassword" type="password" placeholder="Konfirmasi kata sandi anda..." value={form.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>
                    <p className="auth-link">Sudah punya akun? <Link to="/">masuk di sini</Link></p>
                    <button type="submit" className="auth-btn">Daftar</button>
                </form>
            </div>
        </div>
    );
}
