import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const runMigration = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const usersCol = db.collection('users');

    console.log('Inspecting indexes...');
    const indexes = await usersCol.indexes();
    const phoneIdx = indexes.find(i => i.name === 'phone_1');

    if (phoneIdx && !phoneIdx.sparse) {
      console.log('Dropping non-sparse phone_1 index...');
      await usersCol.dropIndex('phone_1');
      console.log('Dropped old phone_1 index.');
    }

    console.log('Creating sparse unique indexes...');
    await usersCol.createIndex({ phone: 1 }, { unique: true, sparse: true });
    await usersCol.createIndex({ email: 1 }, { unique: true, sparse: true });
    await usersCol.createIndex({ googleId: 1 }, { unique: true, sparse: true });
    console.log('Sparse indexes created: phone, email, googleId.');

    // Update demo users with default email and password
    const hashedPassword = await bcrypt.hash('password123', 10);

    const demoUpdates = [
      {
        phone: '9876543210',
        email: 'vaibhav@streetvoice.org',
        name: 'Sai Vaibhav',
        role: 'citizen'
      },
      {
        phone: '8888888888',
        email: 'officer@ghmc.gov.in',
        name: 'GHMC Authority Officer',
        role: 'authority'
      },
      {
        phone: '9999999999',
        email: 'moderator@streetvoice.org',
        name: 'Chief Moderator',
        role: 'moderator'
      }
    ];

    for (const demo of demoUpdates) {
      await usersCol.updateOne(
        { phone: demo.phone },
        {
          $set: {
            email: demo.email,
            password: hashedPassword,
            name: demo.name,
            role: demo.role,
            authProvider: 'local'
          }
        },
        { upsert: false }
      );
      console.log(`Updated demo account: ${demo.name} (${demo.email} / ${demo.phone})`);
    }

    console.log('Migration completed successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
