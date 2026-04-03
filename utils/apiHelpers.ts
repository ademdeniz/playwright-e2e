import { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://reqres.in/api';

/**
 * Lightweight API helpers for use in tests.
 * Wraps Playwright's request context with typed responses.
 */
export async function createUser(
  request: APIRequestContext,
  name: string,
  job: string
): Promise<{ id: string; name: string; job: string; createdAt: string }> {
  const res = await request.post(`${API_BASE}/users`, {
    data: { name, job },
  });
  if (res.status() !== 201) {
    throw new Error(`createUser failed: ${res.status()}`);
  }
  return res.json();
}

export async function getUser(
  request: APIRequestContext,
  id: number
): Promise<{ id: number; email: string; first_name: string; last_name: string }> {
  const res = await request.get(`${API_BASE}/users/${id}`);
  if (res.status() !== 200) {
    throw new Error(`getUser(${id}) failed: ${res.status()}`);
  }
  const body = await res.json();
  return body.data;
}

export async function deleteUser(
  request: APIRequestContext,
  id: number
): Promise<void> {
  const res = await request.delete(`${API_BASE}/users/${id}`);
  if (res.status() !== 204) {
    throw new Error(`deleteUser(${id}) failed: ${res.status()}`);
  }
}
