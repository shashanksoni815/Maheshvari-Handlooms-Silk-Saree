"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Category_1 = __importDefault(require("./models/Category"));
const Collection_1 = __importDefault(require("./models/Collection"));
const Product_1 = __importDefault(require("./models/Product"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const IMAGES = [
    'https://images.unsplash.com/photo-1583391733959-b52d9a334ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];
const seedData = async () => {
    try {
        await (0, db_1.default)();
        console.log('Clearing old data...');
        await Product_1.default.deleteMany();
        await Category_1.default.deleteMany();
        await Collection_1.default.deleteMany();
        console.log('Creating Categories...');
        const catBanarasi = (await Category_1.default.create({ name: 'Banarasi', slug: 'banarasi', description: 'Rich and heavy silk sarees from Varanasi.', isActive: true }));
        const catKanjivaram = (await Category_1.default.create({ name: 'Kanjivaram', slug: 'kanjivaram', description: 'Exquisite silk from Kanchipuram.', isActive: true }));
        const catChanderi = (await Category_1.default.create({ name: 'Chanderi', slug: 'chanderi', description: 'Lightweight sheer texture silk from MP.', isActive: true }));
        const catMysore = (await Category_1.default.create({ name: 'Mysore Silk', slug: 'mysore-silk', description: 'Pure silk from Karnataka.', isActive: true }));
        console.log('Creating Collections...');
        const colBridal = (await Collection_1.default.create({
            name: 'The Bridal Edit',
            slug: 'the-bridal-edit',
            description: 'Handwoven masterpieces crafted for your special day. Rich zari work and auspicious colors.',
            bannerImage: IMAGES[0],
            isActive: true
        }));
        const colHeritage = (await Collection_1.default.create({
            name: 'Heritage Handlooms',
            slug: 'heritage-handlooms',
            description: 'Timeless classics that carry the legacy of centuries-old weaving traditions.',
            bannerImage: IMAGES[1],
            isActive: true
        }));
        console.log('Creating Products...');
        const products = [
            {
                name: 'Crimson Red Pure Banarasi Brocade',
                slug: 'crimson-red-pure-banarasi-brocade',
                sku: 'BNR-001',
                description: 'A breathtakingly beautiful pure Banarasi silk saree in rich crimson red, featuring intricate floral brocade work in real gold zari. Perfect for the modern bride who appreciates tradition.',
                price: 24500,
                mrp: 32000,
                category: catBanarasi._id,
                collections: [colBridal._id, colHeritage._id],
                stock: 5,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[0], publicId: 'img1', isPrimary: true }, { url: IMAGES[1], publicId: 'img2', isPrimary: false }],
                attributes: { fabric: 'Silk', silkType: 'Banarasi', weave: 'Handloom', color: 'Red', zariType: 'Gold' },
                tags: ['Red', 'Bridal', 'Banarasi']
            },
            {
                name: 'Emerald Green Kanjivaram Silk',
                slug: 'emerald-green-kanjivaram-silk',
                sku: 'KNJ-002',
                description: 'Classic emerald green Kanjivaram with a contrasting pink border. Woven with pure mulberry silk and silver zari dipped in gold.',
                price: 35000,
                mrp: 42000,
                category: catKanjivaram._id,
                collections: [colBridal._id],
                stock: 2,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[1], publicId: 'img3', isPrimary: true }, { url: IMAGES[0], publicId: 'img4', isPrimary: false }],
                attributes: { fabric: 'Silk', silkType: 'Kanjivaram', weave: 'Handloom', color: 'Green', zariType: 'Gold' },
                tags: ['Green', 'Bridal', 'Kanjivaram']
            },
            {
                name: 'Soft Pink Tissue Chanderi',
                slug: 'soft-pink-tissue-chanderi',
                sku: 'CHN-003',
                description: 'Ethereal soft pink Chanderi silk saree with silver coin motifs. Extremely lightweight and perfect for day events.',
                price: 12500,
                mrp: 15000,
                category: catChanderi._id,
                collections: [],
                stock: 10,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[2], publicId: 'img5', isPrimary: true }],
                attributes: { fabric: 'Cotton Silk', silkType: 'Chanderi', weave: 'Powerloom', color: 'Pink', zariType: 'Silver' },
                tags: ['Pink', 'Lightweight', 'Chanderi']
            },
            {
                name: 'Golden Yellow Mysore Crepe Silk',
                slug: 'golden-yellow-mysore-crepe',
                sku: 'MYS-004',
                description: 'A vibrant golden yellow pure crepe silk saree from Mysore. Known for its incredible drape and minimalist zari border.',
                price: 18000,
                mrp: 18000,
                category: catMysore._id,
                collections: [colHeritage._id],
                stock: 4,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[3], publicId: 'img6', isPrimary: true }],
                attributes: { fabric: 'Silk', silkType: 'Mysore', weave: 'Handloom', color: 'Yellow', zariType: 'Gold' },
                tags: ['Yellow', 'Mysore', 'Minimalist']
            },
            {
                name: 'Midnight Blue Banarasi Georgette',
                slug: 'midnight-blue-banarasi-georgette',
                sku: 'BNR-005',
                description: 'Fluid Banarasi georgette in deep midnight blue with silver zari water motifs. A modern take on classic weaving.',
                price: 19500,
                mrp: 22000,
                category: catBanarasi._id,
                collections: [],
                stock: 8,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[4], publicId: 'img7', isPrimary: true }],
                attributes: { fabric: 'Georgette', silkType: 'Banarasi', weave: 'Handloom', color: 'Blue', zariType: 'Silver' },
                tags: ['Blue', 'Georgette', 'Partywear']
            },
            {
                name: 'Royal Purple Kanjivaram with Korvai Border',
                slug: 'royal-purple-kanjivaram-korvai',
                sku: 'KNJ-006',
                description: 'A striking royal purple Kanjivaram featuring the traditional Korvai weaving technique where the border is interlocked with the body.',
                price: 28000,
                mrp: 35000,
                category: catKanjivaram._id,
                collections: [colBridal._id, colHeritage._id],
                stock: 3,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[5], publicId: 'img8', isPrimary: true }],
                attributes: { fabric: 'Silk', silkType: 'Kanjivaram', weave: 'Handloom', color: 'Purple', zariType: 'Gold' },
                tags: ['Purple', 'Kanjivaram', 'Bridal']
            },
            {
                name: 'Ivory White Chanderi Silk Cotton',
                slug: 'ivory-white-chanderi',
                sku: 'CHN-007',
                description: 'Pristine ivory white Chanderi with delicate floral bootis. A versatile piece for every wardrobe.',
                price: 8500,
                mrp: 10000,
                category: catChanderi._id,
                collections: [colHeritage._id],
                stock: 15,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[6], publicId: 'img9', isPrimary: true }],
                attributes: { fabric: 'Cotton Silk', silkType: 'Chanderi', weave: 'Handloom', color: 'White', zariType: 'None' },
                tags: ['White', 'Chanderi', 'Daywear']
            },
            {
                name: 'Maroon Mysore Silk with Zari Checks',
                slug: 'maroon-mysore-silk-checks',
                sku: 'MYS-008',
                description: 'Deep maroon Mysore silk featuring an all-over zari check pattern. Exceptionally soft and luxurious.',
                price: 21000,
                mrp: 25000,
                category: catMysore._id,
                collections: [],
                stock: 6,
                status: 'PUBLISHED',
                images: [{ url: IMAGES[0], publicId: 'img10', isPrimary: true }],
                attributes: { fabric: 'Silk', silkType: 'Mysore', weave: 'Powerloom', color: 'Maroon', zariType: 'Gold' },
                tags: ['Maroon', 'Mysore', 'Checks']
            }
        ];
        for (const p of products) {
            await Product_1.default.create(p);
        }
        console.log('Database Seeded Successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seeder.js.map