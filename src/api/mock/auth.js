import { getUsers, mockDelay } from './data';

export async function login({ email, password, role }) {
  await mockDelay(600);
  const users = getUsers();
  
  // Try strict matching first
  let user = users.find((u) => u.email === email && u.role === role);
  
  // If not found (often due to localStorage cache keeping old emails), fallback to role
  if (!user) {
    user = users.find((u) => u.role === role);
  }

  // Final fallback just in case
  if (!user) {
    user = users[0];
  }
  
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
