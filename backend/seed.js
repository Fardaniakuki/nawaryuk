const { sequelize, User, Barang, Lelang, Penawaran, Pembayaran } = require('./src/models');
require('dotenv').config();

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('🗑️  Database cleared & re-synced');

        // Users
        const admin = await User.create({ nama: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' });
        const petugas1 = await User.create({ nama: 'Andi Petugas', username: 'petugas', password: 'petugas123', role: 'petugas', alamat: 'Jl. Merdeka No. 1', noTelpon: '081111222333' });
        const petugas2 = await User.create({ nama: 'Sari Petugas', username: 'sari', password: 'sari123', role: 'petugas', alamat: 'Jl. Sudirman No. 5', noTelpon: '081222333444' });
        const user1 = await User.create({ nama: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'masyarakat', alamat: 'Jl. Mawar No. 5', noTelpon: '081234567890' });
        const user2 = await User.create({ nama: 'Dewi Lestari', username: 'dewi', password: 'dewi123', role: 'masyarakat', alamat: 'Jl. Melati No. 10', noTelpon: '081234567891' });
        const user3 = await User.create({ nama: 'Rizky Pratama', username: 'rizky', password: 'rizky123', role: 'masyarakat', alamat: 'Jl. Anggrek No. 15', noTelpon: '081234567892' });
        console.log('✅ 6 Users created');

        // Barang
        const barangs = await Barang.bulkCreate([
            { namaBarang: 'Laptop ASUS ROG', deskripsi: 'Laptop gaming ASUS ROG Strix, Intel i7, RTX 4060, RAM 16GB', hargaAwal: 15000000, gambar: '', petugasId: petugas1.id },
            { namaBarang: 'Samsung Galaxy S24 Ultra', deskripsi: 'Smartphone flagship Samsung, 256GB, kondisi mint', hargaAwal: 12000000, gambar: '', petugasId: petugas1.id },
            { namaBarang: 'Sepeda Polygon Cascade', deskripsi: 'Sepeda gunung Polygon Cascade 4, 27.5 inch', hargaAwal: 3500000, gambar: '', petugasId: petugas2.id },
            { namaBarang: 'Kamera Canon EOS R50', deskripsi: 'Mirrorless camera Canon EOS R50, body only', hargaAwal: 10000000, gambar: '', petugasId: petugas1.id },
            { namaBarang: 'PS5 Digital Edition', deskripsi: 'PlayStation 5 Digital Edition + 2 Controller', hargaAwal: 6000000, gambar: '', petugasId: petugas2.id },
            { namaBarang: 'MacBook Air M2', deskripsi: 'Apple MacBook Air M2 2023, 8GB/256GB', hargaAwal: 14000000, gambar: '', petugasId: petugas1.id },
            { namaBarang: 'Smart TV LG 55 inch', deskripsi: 'LG Smart TV 55UP7750, 4K UHD, WebOS', hargaAwal: 7000000, gambar: '', petugasId: petugas2.id },
            { namaBarang: 'Jam Tangan Casio G-Shock', deskripsi: 'Casio G-Shock GA-2100, Solar, kondisi baru', hargaAwal: 1500000, gambar: '', petugasId: petugas1.id },
        ]);
        console.log('✅ 8 Barangs created');

        // Lelang
        const now = new Date();
        const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(now); lastWeek.setDate(lastWeek.getDate() - 7);
        const nextWeek = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);

        // Active lelangs
        const lelang1 = await Lelang.create({ barangId: barangs[0].id, tanggalMulai: lastWeek, tanggalSelesai: nextWeek, adminId: admin.id, hargaAkhir: 15000000 });
        await barangs[0].update({ status: 'dilelang' });
        const lelang2 = await Lelang.create({ barangId: barangs[1].id, tanggalMulai: yesterday, tanggalSelesai: nextWeek, adminId: admin.id, hargaAkhir: 12000000 });
        await barangs[1].update({ status: 'dilelang' });
        const lelang3 = await Lelang.create({ barangId: barangs[2].id, tanggalMulai: lastWeek, tanggalSelesai: tomorrow, adminId: admin.id, hargaAkhir: 3500000 });
        await barangs[2].update({ status: 'dilelang' });

        // Closed lelangs
        const lelang4 = await Lelang.create({ barangId: barangs[3].id, tanggalMulai: lastWeek, tanggalSelesai: yesterday, adminId: admin.id, hargaAkhir: 12500000, pemenangId: user1.id, status: 'ditutup' });
        await barangs[3].update({ status: 'terjual' });
        const lelang5 = await Lelang.create({ barangId: barangs[4].id, tanggalMulai: lastWeek, tanggalSelesai: yesterday, adminId: admin.id, hargaAkhir: 7500000, pemenangId: user2.id, status: 'ditutup' });
        await barangs[4].update({ status: 'terjual' });
        console.log('✅ 5 Lelangs created (3 active, 2 closed)');

        // Penawaran
        await Penawaran.create({ lelangId: lelang1.id, userId: user1.id, hargaTawar: 16000000 });
        await Penawaran.create({ lelangId: lelang1.id, userId: user2.id, hargaTawar: 17000000 });
        await Penawaran.create({ lelangId: lelang1.id, userId: user3.id, hargaTawar: 17500000 });
        await lelang1.update({ hargaAkhir: 17500000 });

        await Penawaran.create({ lelangId: lelang2.id, userId: user1.id, hargaTawar: 13000000 });
        await Penawaran.create({ lelangId: lelang2.id, userId: user3.id, hargaTawar: 13500000 });
        await lelang2.update({ hargaAkhir: 13500000 });

        await Penawaran.create({ lelangId: lelang3.id, userId: user2.id, hargaTawar: 4000000 });
        await lelang3.update({ hargaAkhir: 4000000 });

        await Penawaran.create({ lelangId: lelang4.id, userId: user1.id, hargaTawar: 11000000 });
        await Penawaran.create({ lelangId: lelang4.id, userId: user2.id, hargaTawar: 12000000 });
        await Penawaran.create({ lelangId: lelang4.id, userId: user1.id, hargaTawar: 12500000 });

        await Penawaran.create({ lelangId: lelang5.id, userId: user2.id, hargaTawar: 6500000 });
        await Penawaran.create({ lelangId: lelang5.id, userId: user3.id, hargaTawar: 7000000 });
        await Penawaran.create({ lelangId: lelang5.id, userId: user2.id, hargaTawar: 7500000 });
        console.log('✅ 13 Penawarans created');

        // Pembayaran
        await Pembayaran.create({ lelangId: lelang4.id, userId: user1.id, jumlah: 12500000, metode: 'transfer', status: 'verified', petugasId: petugas1.id });
        await Pembayaran.create({ lelangId: lelang5.id, userId: user2.id, jumlah: 7500000, metode: 'ewallet', status: 'pending' });
        console.log('✅ 2 Pembayarans created');

        console.log('\n🎉 Seed completed!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin     : admin / admin123');
        console.log('   Petugas 1 : petugas / petugas123');
        console.log('   Petugas 2 : sari / sari123');
        console.log('   Masyarakat: budi / budi123');
        console.log('   Masyarakat: dewi / dewi123');
        console.log('   Masyarakat: rizky / rizky123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seed();
