import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoose } from '../../src/lib/mongodb';
import Education from '../../src/models/Education';
import User from '../../src/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🌱 Seeding initial data...');
    await connectToMongoose();

    // Create admin user (jika belum ada)
    const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0]?.trim();
    let adminUser = null;
    
    if (adminEmail) {
      adminUser = await User.findOne({ email: adminEmail });
      
      if (!adminUser) {
        adminUser = new User({
          firebaseUid: 'seed-admin-uid',
          email: adminEmail,
          displayName: 'Admin User',
          photoURL: null,
          isAdmin: true
        });
        await adminUser.save();
        console.log('✅ Admin user created');
      }
    }

    // Check if education content already exists
    const existingEducation = await Education.countDocuments();
    
    if (existingEducation === 0 && adminUser) {
      // Seed education content
      const educationData = [
        {
          title: 'Cara Memilah Sampah yang Benar',
          content: 'Pemilahan sampah adalah langkah pertama dalam pengelolaan sampah yang bertanggung jawab. Pisahkan sampah organik (sisa makanan, daun) dan anorganik (plastik, kertas, logam) sejak dari sumbernya. Sampah organik dapat diolah menjadi kompos, sedangkan sampah anorganik dapat didaur ulang. Pastikan sampah dalam kondisi bersih sebelum dibuang ke tempat sampah yang sesuai.',
          category: 'recycling',
          imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop',
          author: adminUser._id
        },
        {
          title: 'Membuat Kompos dari Sampah Organik',
          content: 'Kompos adalah cara alami mengolah sampah organik menjadi pupuk yang berguna untuk tanaman. Campurkan 30% bahan hijau (sisa sayuran, kulit buah) dengan 70% bahan coklat (daun kering, kertas). Siram sedikit air dan aduk seminggu sekali. Dalam 2-3 bulan, kompos akan siap digunakan dengan ciri berwarna coklat kehitaman dan berbau tanah.',
          category: 'composting',
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop',
          author: adminUser._id
        },
        {
          title: 'Tips Mengurangi Sampah Plastik',
          content: 'Plastik membutuhkan ratusan tahun untuk terurai. Kurangi penggunaan plastik dengan: 1) Bawa tas belanja sendiri, 2) Gunakan botol minum yang dapat dipakai ulang, 3) Pilih produk dengan kemasan minimal, 4) Hindari sedotan plastik, 5) Gunakan wadah makanan yang dapat dipakai berulang. Setiap langkah kecil berkontribusi untuk lingkungan yang lebih bersih.',
          category: 'reduction',
          imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
          author: adminUser._id
        },
        {
          title: 'Bank Sampah: Sampah Bernilai Ekonomis',
          content: 'Bank sampah adalah sistem pengelolaan sampah yang memberikan nilai ekonomis. Cara kerjanya: 1) Pilah sampah anorganik di rumah, 2) Bersihkan sampah sebelum disetor, 3) Timbang sampah di bank sampah, 4) Catat berat dan harga di buku tabungan. Jenis sampah yang bisa disetor: kardus, kertas, plastik, logam, dan kaca. Selain mengurangi sampah, Anda juga mendapat penghasilan tambahan.',
          category: 'recycling',
          imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=200&fit=crop',
          author: adminUser._id
        }
      ];

      await Education.insertMany(educationData);
      console.log('✅ Education content seeded');
    }

    const stats = {
      users: await User.countDocuments(),
      education: await Education.countDocuments(),
      classifications: 0
    };

    return res.status(200).json({
      success: true,
      message: 'Data seeded successfully!',
      data: stats
    });

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}