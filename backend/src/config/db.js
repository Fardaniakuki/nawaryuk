const { Sequelize } = require('sequelize');
const path = require('path');

// Menggunakan path.resolve dan process.cwd() agar Vercel tidak tersesat mencari database
const dbPath = path.resolve(process.cwd(), 'backend', 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    // Dialect Options ini membantu saat proses tulis (Edit/Hapus) di beberapa lingkungan
    dialectOptions: {
        mode: 2, // SQLITE_OPEN_READWRITE
    },
    // Konfigurasi pool agar koneksi database tidak gampang "Locked"
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Cek koneksi (opsional, untuk muncul di Log Vercel)
sequelize.authenticate()
    .then(() => console.log('✅ Connection to SQLite has been established successfully.'))
    .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;