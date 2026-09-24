// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import Category from './models/Category';
import Product from './models/Product';
import Banner from './models/Banner';
import Collection from './models/Collection';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maheshwari_silk')
  .then(() => console.log('MongoDB connected for home page seeding'))
  .catch(err => console.error(err));

const seedHomeData = async () => {
  try {
    console.log('Adding HOME_FABRIC Banners...');
    // Delete existing ones to prevent duplicates
    await Banner.deleteMany({ position: 'HOME_FABRIC' });
    
    await Banner.insertMany([
      {
        title: 'Banarasi',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=800&q=80',
        link: '/shop?category=banarasi',
        position: 'HOME_FABRIC',
        sortOrder: 1,
        isActive: true
      },
      {
        title: 'Kanjivaram',
        image: 'https://images.unsplash.com/photo-1583391733959-f1830554088b?auto=format&fit=crop&w=800&q=80',
        link: '/shop?category=kanjeevaram',
        position: 'HOME_FABRIC',
        sortOrder: 2,
        isActive: true
      }
    ]);

    console.log('Adding Collections...');
    const collections = [
      { name: 'Wedding Collection', slug: 'wedding-collection', description: 'For the bride', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
      { name: 'Tissue', slug: 'tissue', description: 'Tissue silk sarees', image: 'https://images.unsplash.com/photo-1601058268499-e5265898beb7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Jamdani', slug: 'jamdani', description: 'Jamdani craft', image: 'https://images.unsplash.com/photo-1610030469534-1be66e4a6d4f?auto=format&fit=crop&w=500&q=80' },
      { name: 'Silk Cotton', slug: 'silk-cotton', description: 'Blend', image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=500&q=80' }
    ];
    
    for (const c of collections) {
      const exists = await Collection.findOne({ slug: c.slug });
      if (!exists) {
        await Collection.create({ ...c, bannerImage: c.image });
      } else {
        exists.bannerImage = c.image;
        await exists.save();
      }
    }

    console.log('Tagging Products for New Arrivals and Trending...');
    const products = await Product.find().limit(8);
    
    // Tag first 4 as new
    for (let i = 0; i < 4 && i < products.length; i++) {
      if (!products[i].tags) products[i].tags = [];
      if (!products[i].tags.includes('new')) {
        products[i].tags.push('new');
        await products[i].save();
      }
    }

    // Tag next 4 as trending
    for (let i = 4; i < 8 && i < products.length; i++) {
      if (!products[i].tags) products[i].tags = [];
      if (!products[i].tags.includes('trending')) {
        products[i].tags.push('trending');
        await products[i].save();
      }
    }

    // Make sure we have category images
    const cats = await Category.find();
    const images = [
      'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1583391733959-f1830554088b?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1601058268499-e5265898beb7?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80',
    ];
    for (let i = 0; i < cats.length; i++) {
      if (!cats[i].image) {
        cats[i].image = images[i % images.length];
        await cats[i].save();
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedHomeData();
