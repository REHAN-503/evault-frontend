import client from '../client';

export async function getSystemStatus() {
  const { data } = await client.get('/system/status');
  return data;
}

export async function getSystemInfo() {
  const { data } = await client.get('/system/info');
  return data;
}

export async function listUsers() {
  try {
    const { data } = await client.get('/users');
    return data;
  } catch {
    return [];
  }
}
