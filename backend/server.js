require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./src/models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/barangs', require('./src/routes/barangs'));
app.use('/api/lelangs', require('./src/routes/lelangs'));
app.use('/api/penawarans', require('./src/routes/penawarans'));
app.use('/api/pembayarans', require('./src/routes/pembayarans'));
app.use('/api/laporans', require('./src/routes/laporans'));

const PORT = process.env.PORT || 5001;

const seedData = async () => {
    const count = await User.count();
    if (count === 0) {
        await User.create({ nama: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' });
        await User.create({ nama: 'Petugas Lelang', username: 'petugas', password: 'petugas123', role: 'petugas', alamat: 'Jl. Merdeka No. 1' });
        await User.create({ nama: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'masyarakat', alamat: 'Jl. Mawar No. 5', noTelpon: '081234567890' });
        console.log('✅ Seed data created');
        console.log('   Admin: admin / admin123');
        console.log('   Petugas: petugas / petugas123');
        console.log('   Masyarakat: budi / budi123');
    }
};

sequelize.sync().then(async () => {
    console.log('📦 SQLite database synced');
    await seedData();
    app.listen(PORT, () => console.log(`🚀 NawarYuk API running on port ${PORT}`));
});
