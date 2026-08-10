import { getUsers, mockDelay } from './data';

export async function login({ email, password, role }) {
  await mockDelay(600);
  const users = getUsers();
  // Find a user matching the requested role (for demo purposes) or fallback to first
  const user = users.find((u) => u.role === role) || users[0];
  const token = `mock.${btoa(user.id)}.token`;
  
  localStorage.setItem('evault_token', token);
  localStorage.setItem('evault_refresh_token', token + '.refresh');
  localStorage.setItem('evault_user', JSON.stringify(user));
  return { token, user };
}

export async function register({ email, password, fullName, role }) {
  await mockDelay(600);
  return { message: 'Registered successfully' };
}

export async function getCurrentUser() {
  const raw = localStorage.getItem('evault_user');
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await mockDelay(200);
  localStorage.removeItem('evault_token');
  localStorage.removeItem('evault_refresh_token');
  localStorage.removeItem('evault_user');
}
