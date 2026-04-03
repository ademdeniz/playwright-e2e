import { test, expect } from '@playwright/test';

/**
 * API tests using Playwright's built-in request context.
 * Target: https://reqres.in/api
 *
 * No extra libraries needed — Playwright handles REST calls natively.
 */
test.describe('Users API', () => {

  const API_BASE = 'https://reqres.in/api';

  test('@smoke GET /users returns 200 with user list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?page=1`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.page).toBe(1);
    expect(body.total).toBeGreaterThan(0);
  });

  test('@smoke GET /users/:id returns correct user', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/2`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(2);
    expect(body.data.email).toBeTruthy();
    expect(body.data.first_name).toBeTruthy();
    expect(body.data.last_name).toBeTruthy();
  });

  test('@smoke POST /users creates a user and returns 201', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users`, {
      data: { name: 'Adem Garic', job: 'SDET' },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe('Adem Garic');
    expect(body.job).toBe('SDET');
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
  });

  test('@regression PUT /users/:id updates user and returns 200', async ({ request }) => {
    const response = await request.put(`${API_BASE}/users/2`, {
      data: { name: 'Adem Garic', job: 'Senior SDET' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job).toBe('Senior SDET');
    expect(body.updatedAt).toBeTruthy();
  });

  test('@regression PATCH /users/:id partially updates user', async ({ request }) => {
    const response = await request.patch(`${API_BASE}/users/2`, {
      data: { job: 'Lead SDET' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.job).toBe('Lead SDET');
  });

  test('@regression DELETE /users/:id returns 204', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/users/2`);
    expect(response.status()).toBe(204);
  });

  test('@regression GET /users/:id for non-existent returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/999`);
    expect(response.status()).toBe(404);
  });

  test('@regression response headers contain correct content-type', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
