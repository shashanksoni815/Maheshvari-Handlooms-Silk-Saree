// @ts-nocheck
import mongoose from 'mongoose';
import Collection from './models/Collection';

mongoose.connect('mongodb://127.0.0.1:27017/maheshwari_silk').then(async () => {
  await Collection.create({ name: 'Festive Collection', slug: 'festive', description: 'For the festive season' }).catch(() => {});
  console.log('Done seeding festive');
  process.exit(0);
});
