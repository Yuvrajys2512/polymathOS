const DB_NAME    = 'polymath-os';
const DB_VERSION = 1;
const STORE      = 'state';
const KEY        = 'main';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    req.onsuccess  = e => resolve(e.target.result);
    req.onerror    = () => reject(req.error);
  });
}

export async function idbSave(state) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(state, KEY);
      tx.oncomplete = resolve;
      tx.onerror    = reject;
    });
    db.close();
  } catch { /* silent — localStorage is the primary */ }
}

export async function idbLoad() {
  try {
    const db = await openDB();
    const result = await new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror   = reject;
    });
    db.close();
    return result;
  } catch { return null; }
}

export async function idbClear() {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = resolve;
      tx.onerror    = reject;
    });
    db.close();
  } catch {}
}
