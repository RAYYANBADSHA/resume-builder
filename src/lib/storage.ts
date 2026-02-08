// IndexedDB wrapper for file and data storage
const DB_NAME = "resumind-db";
const DB_VERSION = 1;
const FILES_STORE = "files";
const KV_STORE = "keyvalue";

class StorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create files store
        if (!db.objectStoreNames.contains(FILES_STORE)) {
          db.createObjectStore(FILES_STORE, { keyPath: "id" });
        }

        // Create key-value store
        if (!db.objectStoreNames.contains(KV_STORE)) {
          db.createObjectStore(KV_STORE);
        }
      };
    });
  }

  // File operations
  async uploadFile(file: File): Promise<{ id: string; path: string }> {
    if (!this.db) await this.init();

    const id = `file_${Date.now()}_${file.name}`;
    const path = `/${file.name}`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readwrite");
      const store = transaction.objectStore(FILES_STORE);

      const fileData = {
        id,
        path,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        createdAt: new Date().toISOString(),
      };

      const request = store.add(fileData);

      request.onsuccess = () => resolve({ id, path });
      request.onerror = () => reject(request.error);
    });
  }

  async readFile(path: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readonly");
      const store = transaction.objectStore(FILES_STORE);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.path === path) {
            resolve(cursor.value.file);
          } else {
            cursor.continue();
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readwrite");
      const store = transaction.objectStore(FILES_STORE);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.path === path) {
            cursor.delete();
            resolve();
          } else {
            cursor.continue();
          }
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async listFiles(): Promise<Array<{ id: string; path: string; name: string }>> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readonly");
      const store = transaction.objectStore(FILES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const files = request.result.map((f: any) => ({
          id: f.id,
          path: f.path,
          name: f.name,
        }));
        resolve(files);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Key-Value operations
  async kvGet(key: string): Promise<string | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE], "readonly");
      const store = transaction.objectStore(KV_STORE);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async kvSet(key: string, value: string): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE], "readwrite");
      const store = transaction.objectStore(KV_STORE);
      const request = store.put(value, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async kvDelete(key: string): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE], "readwrite");
      const store = transaction.objectStore(KV_STORE);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async kvList(pattern: string, returnValues = false): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE], "readonly");
      const store = transaction.objectStore(KV_STORE);
      const request = store.openCursor();
      const results: any[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const key = cursor.key as string;
          // Simple pattern matching (e.g., "resume:*")
          const regex = new RegExp(pattern.replace("*", ".*"));
          if (regex.test(key)) {
            if (returnValues) {
              results.push({ key, value: cursor.value });
            } else {
              results.push(key);
            }
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async kvFlush(): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE], "readwrite");
      const store = transaction.objectStore(KV_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE, KV_STORE], "readwrite");
      
      transaction.objectStore(FILES_STORE).clear();
      transaction.objectStore(KV_STORE).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const storage = new StorageService();
