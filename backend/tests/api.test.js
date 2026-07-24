process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-for-jest';
process.env.JWT_EXPIRES_IN = '1h';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const User = require('../src/models/User');
const Business = require('../src/models/Business');
const Insight = require('../src/models/Insight');
const Review = require('../src/models/Review');
const { demoUser, business, insights, reviews } = require('../src/seed/data');

let mongoServer;

/** Recursively assert no _id or __v (or password) keys exist anywhere in a payload. */
const assertNoInternalKeys = (value) => {
  if (Array.isArray(value)) {
    value.forEach(assertNoInternalKeys);
    return;
  }
  if (value && typeof value === 'object') {
    expect(value).not.toHaveProperty('_id');
    expect(value).not.toHaveProperty('__v');
    expect(value).not.toHaveProperty('password');
    Object.values(value).forEach(assertNoInternalKeys);
  }
};

const expectEnvelope = (body) => {
  expect(Object.keys(body).sort()).toEqual(['data', 'message', 'success']);
  expect(typeof body.success).toBe('boolean');
  expect(typeof body.message).toBe('string');
};

const loginAndGetToken = async () => {
  const res = await request(app)
    .post('/login')
    .send({ email: demoUser.email, password: demoUser.password });
  return res.body.data.token;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const hashedPassword = await bcrypt.hash(demoUser.password, 10);
  await User.create({ email: demoUser.email, password: hashedPassword });
  await Business.create(business);
  await Insight.create(insights);
  await Review.insertMany(reviews);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('GET /health', () => {
  it('returns 200 with the running message and uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is running');
    expect(typeof res.body.data.uptime).toBe('number');
  });
});

describe('POST /login', () => {
  it('succeeds with valid credentials and returns token + user without password/_id/__v', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: demoUser.email, password: demoUser.password });

    expect(res.status).toBe(200);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.token.length).toBeGreaterThan(0);
    expect(res.body.data.user.email).toBe('admin@abcsalon.com');
    expect(typeof res.body.data.user.id).toBe('string');
    assertNoInternalKeys(res.body.data);
  });

  it('logs in with mixed-case email and surrounding spaces', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: '  Admin@ABCSalon.com  ', password: demoUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.user.email).toBe('admin@abcsalon.com');
  });

  it('returns 401 with the exact message for a wrong password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: demoUser.email, password: 'WrongPassword999' });

    expect(res.status).toBe(401);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
    expect(res.body.data).toBeNull();
  });

  it('returns 401 for an unknown email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'nobody@abcsalon.com', password: demoUser.password });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
    expect(res.body.data).toBeNull();
  });

  it('returns 400 when fields are missing', async () => {
    const cases = [
      {},
      { email: demoUser.email },
      { password: demoUser.password },
      { email: '', password: '' },
      { email: '   ', password: demoUser.password },
    ];
    for (const body of cases) {
      const res = await request(app).post('/login').send(body);
      expect(res.status).toBe(400);
      expectEnvelope(res.body);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email and password are required');
      expect(res.body.data).toBeNull();
    }
  });
});

describe('protected routes require a valid token', () => {
  const protectedPaths = ['/business', '/insights', '/reviews'];

  it.each(protectedPaths)('%s returns 401 without a token', async (path) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(401);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Unauthorized: token missing or invalid');
    expect(res.body.data).toBeNull();
  });

  it.each(protectedPaths)('%s returns 401 with an invalid token', async (path) => {
    const res = await request(app).get(path).set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: token missing or invalid');
    expect(res.body.data).toBeNull();
  });

  it.each(protectedPaths)('%s returns 200 with a valid token', async (path) => {
    const token = await loginAndGetToken();
    const res = await request(app).get(path).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /business', () => {
  it('returns the ABC Salon profile exactly', async () => {
    const token = await loginAndGetToken();
    const res = await request(app).get('/business').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(data.name).toBe('ABC Salon');
    expect(data.category).toBe('Beauty Salon');
    expect(data.address).toBe('Hyderabad');
    expect(data.phone).toBe('9876543210');
    expect(data.rating).toBe(4.2);
    expect(data.total_reviews).toBe(120);
    expect(typeof data.id).toBe('string');
    assertNoInternalKeys(data);
  });
});

describe('GET /insights', () => {
  it('returns the seeded insights with profile_views 1200', async () => {
    const token = await loginAndGetToken();
    const res = await request(app).get('/insights').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(data.profile_views).toBe(1200);
    expect(data.search_views).toBe(800);
    expect(data.website_clicks).toBe(150);
    expect(data.phone_calls).toBe(60);
    expect(data.direction_requests).toBe(40);
    expect(typeof data.id).toBe('string');
    assertNoInternalKeys(data);
  });
});

describe('GET /reviews', () => {
  it('returns all 7 reviews sorted by date descending with Ravi first', async () => {
    const token = await loginAndGetToken();
    const res = await request(app).get('/reviews').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(7);
    expect(data[0].name).toBe('Ravi');
    expect(data[1].name).toBe('Priya');

    const dates = data.map((review) => new Date(review.date).getTime());
    const sortedDesc = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sortedDesc);

    for (const review of data) {
      expect(typeof review.id).toBe('string');
      expect(typeof review.name).toBe('string');
      expect(typeof review.rating).toBe('number');
      expect(typeof review.comment).toBe('string');
      expect(typeof review.date).toBe('string');
    }
    assertNoInternalKeys(data);
  });
});

describe('unknown routes', () => {
  it('returns the 404 envelope', async () => {
    const res = await request(app).get('/definitely-not-a-route');
    expect(res.status).toBe(404);
    expectEnvelope(res.body);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Route not found');
    expect(res.body.data).toBeNull();
  });
});
