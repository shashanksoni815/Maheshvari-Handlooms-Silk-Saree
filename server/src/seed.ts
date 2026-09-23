import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load env vars
dotenv.config();

// Models
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Banner from './models/Banner';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maheshwari_silk')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const seedData = async () => {
  try {
    console.log('Clearing old data (Users, Categories, Products, Banners)...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});

    console.log('Inserting Demo Users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    await User.insertMany([
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@maheshwari.com',
        password,
        role: 'SUPER_ADMIN',
        isActive: true
      },
      {
        firstName: 'Store',
        lastName: 'Admin',
        email: 'admin@maheshwari.com',
        password,
        role: 'ADMIN',
        isActive: true
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'user@example.com',
        password,
        role: 'USER',
        isActive: true
      }
    ]);

    console.log('Inserting Demo Categories...');
    const cat1 = await Category.create({ name: 'Maheshwari Silk', slug: 'maheshwari-silk', description: 'Authentic handloom Maheshwari silk sarees.' });
    const cat2 = await Category.create({ name: 'Kanjeevaram', slug: 'kanjeevaram', description: 'Traditional Kanjeevaram silk sarees.' });
    const cat3 = await Category.create({ name: 'Banarasi', slug: 'banarasi', description: 'Rich Banarasi brocade sarees.' });

    console.log('Inserting Demo Products...');
    
    // Cloudinary sample images (using random elegant saree images)
    const images = [
      'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80', // Red/gold saree
      'https://images.unsplash.com/photo-1583391733959-f1830554088b?auto=format&fit=crop&q=80', // Green saree
      'https://images.unsplash.com/photo-1601058268499-e5265898beb7?auto=format&fit=crop&q=80', // Blue saree
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80', // Yellow saree
      'https://images.unsplash.com/photo-1610030469534-1be66e4a6d4f?auto=format&fit=crop&q=80', // Pink saree
      'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&q=80' // Purple/magenta saree
    ];

    await Product.insertMany([
      {
        name: 'Royal Crimson Maheshwari Silk Saree',
        slug: 'royal-crimson-maheshwari',
        sku: 'MS-RC-001',
        description: 'A stunning crimson red Maheshwari silk saree featuring an intricate zari border and traditional motifs. Perfect for weddings and grand occasions.',
        price: 18500,
        mrp: 22000,
        category: cat1._id,
        stock: 15,
        status: 'PUBLISHED',
        images: [{ url: images[0], publicId: 'demo1', isPrimary: true }],
        attributes: {
          fabric: 'Pure Silk',
          color: 'Crimson Red',
          careInstructions: 'Dry clean only'
        }
      },
      {
        name: 'Emerald Green Kanjeevaram Classic',
        slug: 'emerald-green-kanjeevaram',
        sku: 'MS-EG-002',
        description: 'An elegant emerald green Kanjeevaram silk saree with a contrasting gold border. A masterpiece of traditional weaving.',
        price: 24000,
        mrp: 28000,
        category: cat2._id,
        stock: 8,
        status: 'PUBLISHED',
        images: [{ url: images[1], publicId: 'demo2', isPrimary: true }],
        attributes: {
          fabric: 'Pure Silk',
          color: 'Emerald Green',
          careInstructions: 'Dry clean only'
        }
      },
      {
        name: 'Midnight Blue Banarasi Brocade',
        slug: 'midnight-blue-banarasi',
        sku: 'MS-MB-003',
        description: 'Rich midnight blue Banarasi saree adorned with heavy gold brocade work all over. A regal choice for evening celebrations.',
        price: 32000,
        mrp: 32000,
        category: cat3._id,
        stock: 5,
        status: 'PUBLISHED',
        images: [{ url: images[2], publicId: 'demo3', isPrimary: true }],
        attributes: {
          fabric: 'Pure Silk',
          color: 'Midnight Blue',
          careInstructions: 'Dry clean only'
        }
      },
      {
        name: 'Turmeric Yellow Festive Silk',
        slug: 'turmeric-yellow-silk',
        sku: 'MS-TY-004',
        description: 'Bright and auspicious yellow silk saree, ideal for haldi ceremonies and festive gatherings.',
        price: 15000,
        mrp: 17500,
        category: cat1._id,
        stock: 20,
        status: 'PUBLISHED',
        images: [{ url: images[3], publicId: 'demo4', isPrimary: true }],
        attributes: {
          fabric: 'Silk Cotton Blend',
          color: 'Yellow',
          careInstructions: 'Dry clean recommended'
        }
      },
      {
        name: 'Magenta Pink Bridals Saree',
        slug: 'magenta-pink-bridal',
        sku: 'MS-MP-005',
        description: 'A gorgeous magenta pink saree with exquisite craftsmanship, perfect for the modern bride.',
        price: 45000,
        mrp: 52000,
        category: cat2._id,
        stock: 2,
        status: 'PUBLISHED',
        images: [{ url: images[4], publicId: 'demo5', isPrimary: true }],
        attributes: {
          fabric: 'Pure Silk',
          color: 'Magenta Pink',
          careInstructions: 'Dry clean only'
        }
      },
      {
        name: 'Deep Purple Heirloom Saree',
        slug: 'deep-purple-heirloom',
        sku: 'MS-DP-006',
        description: 'A timeless classic in deep purple, featuring traditional patterns that never go out of style.',
        price: 21000,
        mrp: 21000,
        category: cat1._id,
        stock: 12,
        status: 'PUBLISHED',
        images: [{ url: images[5], publicId: 'demo6', isPrimary: true }],
        attributes: {
          fabric: 'Pure Silk',
          color: 'Deep Purple',
          careInstructions: 'Dry clean only'
        }
      }
    ]);

    console.log('Inserting Demo Banners...');
    await Banner.insertMany([
      {
        title: 'Festive Collection 2026',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80',
        link: '/collections/festive',
        position: 'HOME_HERO',
        sortOrder: 1,
        isActive: true
      },
      {
        title: 'Bridal Heritage',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
        link: '/collections/bridal',
        position: 'HOME_HERO',
        sortOrder: 2,
        isActive: true
      }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
