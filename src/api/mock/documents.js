import { getDocuments, setDocuments, getAuditLog, setAuditLog, mockDelay } from './data';
import { getCurrentUser } from './auth';

export async function listDocuments(page = 1, limit = 20, search = '') {
  await mockDelay(500);
  return getDocuments();
}

export async function getDocument(docId) {
  await mockDelay(350);
  const doc = getDocuments().find((d) => d.docId === docId);
  const user = await getCurrentUser();
  
  if (doc && user?.role === 'client') {
    const sharedWithMe = (doc.sharedWith || []).includes(user.id);
    if (!sharedWithMe) {
      throw new Error("Access Denied. You do not have permission to view this legal record.");
    }
  }
  
  return doc || null;
}

export async function getVersionHistory(docId) {
  await mockDelay(350);
  const doc = getDocuments().find((d) => d.docId === docId);
  if (!doc) return [];
  return Array.from({ length: doc.version }, (_, i) => ({
    version: i + 1,
    hash: doc.hash.slice(0, -1) + i,
    updatedAt: doc.updatedAt,
    updatedBy: doc.ownerName,
  })).reverse();
}

export async function downloadDocument(docId) {
  await mockDelay(600);
  const doc = getDocuments().find((d) => d.docId === docId);
  const content = `MOCK DOWNLOAD\n\nTitle: ${doc?.title}\nCase: ${doc?.caseNo}\nHash: ${doc?.hash}`;
  const blob = new Blob([content], { type: 'text/plain' });
  return URL.createObjectURL(blob);
}

export async function uploadDocument({ title, caseNo, file }, onStep) {
  const steps = [
    'Preparing secure upload',
    'Authenticating request',
    'Uploading file',
    'Registering hash',
    'Confirming record',
  ];

  for (let i = 0; i < steps.length; i++) {
    onStep?.(i, steps[i]);
    await mockDelay(420);
  }
  
  const user = await getCurrentUser();
  const docs = getDocuments();
  const docId = `DOC-${Math.floor(80000 + Math.random() * 9000)}`;
  
  const doc = {
    docId,
    title,
    caseNo,
    ownerId: user?.id || 'usr_101',
    ownerName: user?.name || 'You',
    hash: '0x' + Array.from({ length: 62 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    cid: 'bafybei' + Array.from({ length: 50 }, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 32)]).join(''),
    status: 'verified',
    size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '—',
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  
  setDocuments([doc, ...docs]);
  
  const audit = getAuditLog();
  setAuditLog([{
    id: `evt_${Date.now()}`,
    docId: doc.docId,
    userId: doc.ownerId,
    userName: doc.ownerName,
    action: 'UPLOAD',
    timestamp: doc.updatedAt,
  }, ...audit]);
  
  return doc;
}

export async function checkAccess(docId, userId) {
  await mockDelay(250);
  return { allowed: true };
}

export async function grantAccess(docId, userId, permission = 'READ') {
  await mockDelay(400);
  const audit = getAuditLog();
  setAuditLog([{
    id: `evt_${Date.now()}`,
    docId,
    userId,
    userName: userId, // In mock, we don't look up the user name for simplicity
    action: `SHARE (${permission})`,
    timestamp: new Date().toISOString(),
  }, ...audit]);
  return { ok: true };
}

export async function revokeAccess(docId, userId) {
  await mockDelay(400);
  const audit = getAuditLog();
  setAuditLog([{
    id: `evt_${Date.now()}`,
    docId,
    userId,
    userName: userId,
    action: 'REVOKE',
    timestamp: new Date().toISOString(),
  }, ...audit]);
  return { ok: true };
}

export async function getDocumentAudit(docId) {
  await mockDelay(300);
  return getAuditLog().filter(a => a.docId === docId);
}

export async function updateDocument(docId, { file }, onStep) {
  const steps = [
    'Encrypting new version',
    'Authenticating request',
    'Uploading file',
    'Registering hash',
    'Confirming record update',
  ];
  for (let i = 0; i < steps.length; i++) {
    onStep?.(i, steps[i]);
    await mockDelay(400);
  }
  
  const docs = getDocuments();
  const docIndex = docs.findIndex(d => d.docId === docId);
  if (docIndex === -1) throw new Error("Document not found");
  
  const doc = docs[docIndex];
  doc.version += 1;
  doc.updatedAt = new Date().toISOString();
  doc.hash = '0x' + Array.from({ length: 62 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  if (file) doc.size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  
  setDocuments([...docs]);
  
  const audit = getAuditLog();
  setAuditLog([{
    id: `evt_${Date.now()}`,
    docId: doc.docId,
    userId: doc.ownerId,
    userName: doc.ownerName,
    action: `UPDATE (v${doc.version})`,
    timestamp: doc.updatedAt,
  }, ...audit]);
  
  return doc;
}

export async function deleteDocument(docId) {
  await mockDelay(600);
  const docs = getDocuments();
  setDocuments(docs.filter(d => d.docId !== docId));
  
  // optionally clear audit log for it, but immutable systems usually keep logs
  return { ok: true };
}
