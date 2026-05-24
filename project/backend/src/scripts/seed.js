require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding…');

  // Clear
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Notification.deleteMany({}),
    Subscription.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  // Create admin user
  const admin = await User.create({
    name: 'Alex Johnson',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    plan: 'pro',
    isEmailVerified: true,
    phone: '+1 (555) 000-0001',
    location: 'San Francisco, CA',
    bio: 'Platform administrator and lead developer.',
  });

  // Demo user
  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo1234!',
    plan: 'pro',
    isEmailVerified: true,
  });

  // Subscriptions
  await Subscription.create({ user: admin._id, plan: 'pro', price: 29, status: 'active' });
  await Subscription.create({ user: demoUser._id, plan: 'pro', price: 29, status: 'active' });

  // Projects
  const projects = [
    { owner: admin._id, name: 'AI Content Hub', description: 'Centralized content generation platform.', status: 'active', priority: 'high', progress: 72, tags: ['ai', 'content'] },
    { owner: admin._id, name: 'Email Campaign Suite', description: 'Automated email generation tool.', status: 'active', priority: 'medium', progress: 45, tags: ['email', 'automation'] },
    { owner: admin._id, name: 'Social Media Bot', description: 'AI-powered social media scheduler.', status: 'completed', priority: 'low', progress: 100, tags: ['social'] },
    { owner: admin._id, name: 'Code Reviewer Pro', description: 'Automated code review using AI.', status: 'paused', priority: 'medium', progress: 28, tags: ['code', 'review'] },
    { owner: admin._id, name: 'Brand Identity Kit', description: 'Image prompts and brand consistency engine.', status: 'active', priority: 'high', progress: 60, tags: ['branding', 'images'] },
    { owner: admin._id, name: 'Analytics Dashboard', description: 'Real-time analytics and reporting system.', status: 'active', priority: 'critical', progress: 85, tags: ['analytics'] },
  ];
  await Project.insertMany(projects);

  // Notifications
  await Notification.insertMany([
    { user: admin._id, type: 'success', title: 'Welcome to AI SAAS Dashboard!', message: 'Your account is ready. Explore the dashboard features.', isRead: false },
    { user: admin._id, type: 'billing', title: 'Invoice #INV-001 Paid', message: 'Your December subscription has been charged.', isRead: false },
    { user: admin._id, type: 'project', title: 'Project Milestone', message: 'Analytics Dashboard reached 85% completion.', isRead: true },
    { user: admin._id, type: 'info', title: 'New Feature: Code Assistant', message: 'Try the updated Code Assistant with GPT-4 support.', isRead: true },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Admin credentials:');
  console.log('  Email:    admin@example.com');
  console.log('  Password: Admin123!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email:    demo@example.com');
  console.log('  Password: Demo1234!');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
