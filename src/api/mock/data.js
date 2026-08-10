export const roles = {
  LAWYER: 'lawyer',
  JUDGE: 'judge',
  ADMIN: 'admin',
};

const initialUsers = [
  { id: 'usr_101', name: 'Ananya Rao', email: 'ananya@rao.com', role: roles.LAWYER, org: 'Rao & Associates', status: 'active' },
  { id: 'usr_102', name: 'Justice K. Menon', email: 'menon@court.gov.in', role: roles.JUDGE, org: 'High Court of Delhi', status: 'active' },
  { id: 'usr_103', name: 'Vikram Sethi', email: 'vikram@registry.gov.in', role: roles.ADMIN, org: 'Registry Office', status: 'active' },
  { id: 'usr_104', name: 'Priya Nair', email: 'priya@nair.com', role: roles.LAWYER, org: 'Nair Legal Chambers', status: 'active' },
];

const initialDocuments = [
  {
    docId: 'DOC-88213',
    title: 'Affidavit of Evidence — Sharma vs. State',
    caseNo: 'CIV/2026/0417',
    ownerId: 'usr_101',
    ownerName: 'Ananya Rao',
    hash: '0x9f2a7c1e4b6d3081f5c9a2e7b410d6c3a8f1e29b7d4c0a5f3e8b1d6c9a2f7e40',
    cid: 'bafybeigd4ka2v7z9k3m8j0h5p6q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h',
    status: 'verified',
    size: '2.4 MB',
    version: 3,
    updatedAt: '2026-08-06T10:12:00Z',
  },
  {
    docId: 'DOC-88190',
    title: 'Witness Statement — Exhibit C',
    caseNo: 'CRL/2025/1183',
    ownerId: 'usr_104',
    ownerName: 'Priya Nair',
    hash: '0x1e5d9a3c7f2b8064d9e1a5c3b7f0d4e8a2c6b9d1e5f3a7c0b4d8e2f6a9c3',
    cid: 'bafybeic7m2k4j6h8p0q2w4e6r8t0y3u5i7o9p1a3s5d7f9g1h3j5k7l9',
    status: 'verified',
    size: '1.1 MB',
    version: 2,
    updatedAt: '2026-08-04T09:02:00Z',
  }
];

const initialAudit = [
  { id: 'evt_5001', docId: 'DOC-88213', userId: 'usr_101', userName: 'Ananya Rao', action: 'DocumentAdded', timestamp: '2026-08-01T11:00:00Z' },
  { id: 'evt_5004', docId: 'DOC-88213', userId: 'usr_101', userName: 'Ananya Rao', action: 'DocumentUpdated (v3)', timestamp: '2026-08-06T10:12:00Z' },
  { id: 'evt_5005', docId: 'DOC-88190', userId: 'usr_104', userName: 'Priya Nair', action: 'DocumentAdded', timestamp: '2026-08-04T09:02:00Z' },
];

export function getMockData(key, initialData) {
  const stored = localStorage.getItem(`evault_mock_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialData;
    }
  }
  localStorage.setItem(`evault_mock_${key}`, JSON.stringify(initialData));
  return initialData;
}

export function setMockData(key, data) {
  localStorage.setItem(`evault_mock_${key}`, JSON.stringify(data));
}

export function getUsers() {
  return getMockData('users', initialUsers);
}

export function setUsers(data) {
  setMockData('users', data);
}

export function getDocuments() {
  return getMockData('documents', initialDocuments);
}

export function setDocuments(data) {
  setMockData('documents', data);
}

export function getAuditLog() {
  return getMockData('audit', initialAudit);
}

export function setAuditLog(data) {
  setMockData('audit', data);
}

// Small helper so mocked functions "feel" like network calls (latency)
export const mockDelay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
