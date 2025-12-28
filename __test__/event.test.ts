import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { EVENT_STATUS, EVENT_TYPE, USER_ROLE } from '../src/common/enums';
import type { TEvent } from '../src/modules/event/adapters/mongodb/event.schema';

// Simple test server setup for testing
const createTestServer = async () => {
  const { default: app } = await import('../src/index');
  const request = require('supertest')(app);
  
  // Connect to test database
  const db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticket-api-test');
  
  return { request, db };
};

describe('Event Module', () => {
  let request: ReturnType<typeof createTestServer>['request'];
  let db: typeof mongoose;
  let authToken: string;
  let organizerId: string;
  let artistId: string;
  let sponsorId: string;
  
  // Test data
  const testOrganizer = {
    name: 'Test Organizer',
    email: 'organizer@test.com',
    password: 'password123',
    role: USER_ROLE.ORGANIZER,
  };

  const testArtist = {
    name: 'Test Artist',
    email: 'artist@test.com',
    password: 'password123',
    role: USER_ROLE.ARTIST,
  };

  const testSponsor = {
    name: 'Test Sponsor',
    email: 'sponsor@test.com',
    password: 'password123',
    role: USER_ROLE.SPONSOR,
  };

  beforeAll(async () => {
    // Setup test server and database
    const { request: testRequest, db: testDb } = await createTestServer();
    request = testRequest;
    db = testDb;

    // Create test users
    const [organizerRes, artistRes, sponsorRes] = await Promise.all([
      request.post('/auth/register').send(testOrganizer),
      request.post('/auth/register').send(testArtist),
      request.post('/auth/register').send(testSponsor),
    ]);

    organizerId = organizerRes.body.data.user._id;
    artistId = artistRes.body.data.user._id;
    sponsorId = sponsorRes.body.data.user._id;

    // Login as organizer
    const loginRes = await request
      .post('/auth/login')
      .send({ email: testOrganizer.email, password: testOrganizer.password });
    
    authToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    // await db.connection.dropDatabase();
    // await db.connection.close();
  });

  describe('Event Creation', () => {
    it('should create a new concert event with ticket setup', async () => {
      const eventData = {
        name: 'Summer Music Festival',
        startDate: faker.date.future(),
        endDate: faker.date.future({ refDate: new Date().setDate(new Date().getDate() + 2) }),
        description: 'Annual summer music festival with multiple artists',
        organizers: [organizerId],
        artists: [artistId],
        sponsors: [sponsorId],
        location: 'Central Park, New York',
        type: EVENT_TYPE.CONCERT,
        status: EVENT_STATUS.DRAFT,
      };

      const response = await request
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        name: eventData.name,
        type: EVENT_TYPE.CONCERT,
        status: EVENT_STATUS.DRAFT,
      });
    });

    it('should create a workshop event without ticket setup', async () => {
      const eventData = {
        name: 'Guitar Workshop',
        startDate: faker.date.future(),
        description: 'Learn to play guitar in 2 hours',
        organizers: [organizerId],
        artists: [artistId],
        sponsors: [sponsorId],
        location: 'Music Academy',
        type: EVENT_TYPE.WORKSHOP,
        status: EVENT_STATUS.PUBLISHED,
      };

      const response = await request
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        name: eventData.name,
        type: EVENT_TYPE.WORKSHOP,
        status: EVENT_STATUS.PUBLISHED,
      });
    });
  });

  describe('Event Management', () => {
    let testEvent: TEvent;

    beforeEach(async () => {
      // Create a test event for each test
      const eventData = {
        name: 'Test Event',
        startDate: faker.date.future(),
        description: 'Test event description',
        organizers: [organizerId],
        artists: [artistId],
        sponsors: [sponsorId],
        location: 'Test Location',
        type: EVENT_TYPE.CONFERENCE,
        status: EVENT_STATUS.DRAFT,
      };

      const response = await request
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      testEvent = response.body.data;
    });

    it('should update an existing event', async () => {
      const updateData = {
        name: 'Updated Event Name',
        description: 'Updated description',
        status: EVENT_STATUS.PUBLISHED,
      };

      const response = await request
        .put(`/api/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        _id: testEvent._id.toString(),
        name: updateData.name,
        description: updateData.description,
        status: updateData.status,
      });
    });

    it('should get event by ID', async () => {
      const response = await request
        .get(`/api/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        _id: testEvent._id.toString(),
        name: testEvent.name,
      });
    });

    it('should list all events', async () => {
      const response = await request
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should delete an event', async () => {
      const response = await request
        .delete(`/api/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify the event is deleted
      const getResponse = await request
        .get(`/api/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Event Validation', () => {
    it('should not create event with missing required fields', async () => {
      const invalidEvent = {
        name: 'Invalid Event',
        // Missing required fields like startDate, organizers, etc.
      };

      const response = await request
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEvent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow non-organizers to create events', async () => {
      // Login as artist (non-organizer)
      const loginRes = await request
        .post('/api/auth/login')
        .send({ email: testArtist.email, password: 'password123' });
      
      const artistToken = loginRes.body.data.accessToken;

      const eventData = {
        name: 'Unauthorized Event',
        startDate: faker.date.future(),
        description: 'This should fail',
        organizers: [organizerId],
        artists: [artistId],
        sponsors: [sponsorId],
        location: 'Test Location',
        type: EVENT_TYPE.CONCERT,
      };

      const response = await request
        .post('/api/events')
        .set('Authorization', `Bearer ${artistToken}`)
        .send(eventData);

      expect(response.status).toBe(403);
    });
  });
});
