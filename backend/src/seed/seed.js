require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Business = require('../models/Business');
const Insight = require('../models/Insight');
const Review = require('../models/Review');
const { demoUser, business, insights, reviews } = require('./data');

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Idempotent: wipe all four collections before inserting.
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Insight.deleteMany({}),
      Review.deleteMany({}),
    ]);

    const hashedPassword = await bcrypt.hash(demoUser.password, 10);

    const [createdUser, createdBusiness, createdInsight, createdReviews] = await Promise.all([
      User.create({ email: demoUser.email, password: hashedPassword }),
      Business.create(business),
      Insight.create(insights),
      Review.insertMany(reviews),
    ]);

    console.log('Seed complete:');
    console.log(`  user:     ${createdUser.email}`);
    console.log(`  business: ${createdBusiness.name}`);
    console.log(`  insights: profile_views=${createdInsight.profile_views}`);
    console.log(`  reviews:  ${createdReviews.length} inserted`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch (_) {
      // ignore disconnect errors on failure path
    }
    process.exit(1);
  }
};

seed();
