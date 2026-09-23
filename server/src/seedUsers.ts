import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    console.log('Clearing old users...');
    await User.deleteMany();

    console.log('Creating Users...');
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      {
        firstName: 'Normal',
        lastName: 'User',
        email: 'user@example.com',
        password,
        role: 'USER',
        isVerified: true
      },
      {
        firstName: 'Store',
        lastName: 'Admin',
        email: 'admin@example.com',
        password,
        role: 'ADMIN',
        isVerified: true
      },
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password,
        role: 'SUPER_ADMIN',
        isVerified: true
      }
    ];

    await User.insertMany(users);

    console.log('Users Seeded Successfully!');
    console.log('Credentials (all passwords are "password123"):');
    console.log('- user@example.com');
    console.log('- admin@example.com');
    console.log('- superadmin@example.com');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
