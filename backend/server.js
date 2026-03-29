// 1. Pancing driver sqlite3 agar terbaca oleh Vercel Serverless
require('sqlite3'); 
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, User } = require('./src/models');

const app = express();

// 2. Konfigurasi CORS (Sesuaikan dengan domain Vercel kamu)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 3. Routes API
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/barangs', require('./src/routes/barangs'));
app.use('/api/lelangs', require('./src/routes/lelangs'));
app.use('/api/penawarans', require('./src/routes/penawarans'));
app.use('/api/pembayarans', require('./src/routes/pembayarans'));
app.use('/api/laporans', require('./src/routes/laporans'));

// Route bantuan untuk cek status API di browser
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'NawarYuk API is running' });
});

const PORT = process.env.PORT || 5001;

// 4. Fungsi Seed Data (Membuat akun default jika database kosong)
const seedData = async () => {
    try {
        const count = await User.count();
        if (count === 0) {
            await User.create({ nama: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' });
            await User.create({ nama: 'Petugas Lelang', username: 'petugas', password: 'petugas123', role: 'petugas', alamat: 'Jl. Merdeka No. 1' });
            await User.create({ nama: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'masyarakat', alamat: 'Jl. Mawar No. 5', noTelpon: '081234567890' });
            console.log('✅ Seed data created');
        }
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
};

// 5. Inisialisasi Database
const startServer = async () => {
    try {
        // Force sync hanya di development, di Vercel pakai sync biasa
        await sequelize.sync();
        console.log('📦 SQLite database synced');
        await seedData();
        
        // Vercel tidak butuh app.listen, tapi Lokal butuh.
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            app.listen(PORT, () => console.log(`🚀 NawarYuk API running on port ${PORT}`));
        }
    } catch (error) {
        console.error('❌ Database sync error:', error);
    }
};

// Jalankan inisialisasi
startServer();

// 6. PENTING: Export app agar Vercel bisa menjalankan ini sebagai Serverless Function
module.exports = app;