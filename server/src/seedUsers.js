"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const seedUsers = async () => {
    try {
        await (0, db_1.default)();
        console.log('Clearing old users...');
        await User_1.default.deleteMany();
        console.log('Creating Users...');
        const salt = await bcrypt_1.default.genSalt(10);
        const password = await bcrypt_1.default.hash('password123', salt);
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
        await User_1.default.insertMany(users);
        console.log('Users Seeded Successfully!');
        console.log('Credentials (all passwords are "password123"):');
        console.log('- user@example.com');
        console.log('- admin@example.com');
        console.log('- superadmin@example.com');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};
seedUsers();
//# sourceMappingURL=seedUsers.js.map