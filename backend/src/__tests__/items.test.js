const request = require('supertest');
const app = require('../app');

describe('Items API', () => {
  test('GET /api/items returns paginated payload', async () => {
    const res = await request(app).get('/api/items?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 2);
    expect(res.body).toHaveProperty('total');
  });

  test('GET /api/items supports search (q)', async () => {
    const res = await request(app).get('/api/items?q=desk');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    // All item names or categories should include the term
    for (const it of res.body.items) {
      const text = `${it.name || ''} ${it.category || ''}`.toLowerCase();
      expect(text).toEqual(expect.stringContaining('desk'));
    }
  });

  test('GET /api/items/:id returns a single item', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  test('GET /api/items/:id returns 404 for missing item', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.status).toBe(404);
  });
});


