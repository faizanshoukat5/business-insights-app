/**
 * Single source of truth for seed data — used by both the seed script and the tests.
 */

const demoUser = {
  email: 'admin@abcsalon.com',
  // Plain-text demo password; it is bcrypt-hashed before being stored.
  password: 'Password123',
};

const business = {
  name: 'ABC Salon',
  category: 'Beauty Salon',
  address: 'Hyderabad',
  phone: '9876543210',
  rating: 4.2,
  total_reviews: 120,
};

const insights = {
  profile_views: 1200,
  search_views: 800,
  website_clicks: 150,
  phone_calls: 60,
  direction_requests: 40,
};

const reviews = [
  { name: 'Ravi', rating: 5, comment: 'Good service', date: new Date('2026-03-20T00:00:00.000Z') },
  { name: 'Priya', rating: 4, comment: 'Nice experience', date: new Date('2026-03-18T00:00:00.000Z') },
  { name: 'Aisha', rating: 5, comment: 'Amazing haircut, very professional staff', date: new Date('2026-03-15T00:00:00.000Z') },
  { name: 'Vikram', rating: 4, comment: 'Clean place and friendly service', date: new Date('2026-03-11T00:00:00.000Z') },
  { name: 'Sneha', rating: 3, comment: 'Good facial but had to wait 20 minutes', date: new Date('2026-03-05T00:00:00.000Z') },
  { name: 'Rahul', rating: 5, comment: 'Best salon in the area, highly recommend', date: new Date('2026-02-26T00:00:00.000Z') },
  { name: 'Meera', rating: 4, comment: 'Nice ambience, reasonable prices', date: new Date('2026-02-14T00:00:00.000Z') },
];

module.exports = { demoUser, business, insights, reviews };
