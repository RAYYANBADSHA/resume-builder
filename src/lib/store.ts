import { create } from "zustand";
import { useAuthStore } from "./auth";
import { storage } from "./storage";
import { aiService } from "./ai";

interface AppStore {
  isLoading: boolean;
  error: string | null;
  
  // File operations
  uploadFile: (file: File) => Promise<{ id: string; path: string } | null>;
  readFile: (path: string) => Promise<Blob | null>;
  deleteFile: (path: string) => Promise<void>;
  listFiles: () => Promise<Array<{ id: string; path: string; name: string }>>;
  
  // Key-Value operations
  kvGet: (key: string) => Promise<string | null>;
  kvSet: (key: string, value: string) => Promise<boolean>;
  kvDelete: (key: string) => Promise<boolean>;
  kvList: (pattern: string, returnValues?: boolean) => Promise<any[]>;
  kvFlush: () => Promise<boolean>;
  
  // AI operations
  analyzeResume: (imagePath: string, instructions: string) => Promise<any>;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearAll: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoading: false,
  error: null,

  // File operations
  uploadFile: async (file: File) => {
    try {
      set({ isLoading: true, error: null });
      await storage.init();
      const result = await storage.uploadFile(file);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      set({ isLoading: false, error: errorMsg });
      return null;
    }
  },

  readFile: async (path: string) => {
    try {
      set({ isLoading: true, error: null });
      await storage.init();
      const result = await storage.readFile(path);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Read failed";
      set({ isLoading: false, error: errorMsg });
      return null;
    }
  },

  deleteFile: async (path: string) => {
    try {
      set({ isLoading: true, error: null });
      await storage.init();
      await storage.deleteFile(path);
      set({ isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Delete failed";
      set({ isLoading: false, error: errorMsg });
    }
  },

  listFiles: async () => {
    try {
      set({ isLoading: true, error: null });
      await storage.init();
      const result = await storage.listFiles();
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "List failed";
      set({ isLoading: false, error: errorMsg });
      return [];
    }
  },

  // Key-Value operations
  kvGet: async (key: string) => {
    try {
      await storage.init();
      return await storage.kvGet(key);
    } catch (error) {
      console.error("KV get error:", error);
      return null;
    }
  },

  kvSet: async (key: string, value: string) => {
    try {
      await storage.init();
      return await storage.kvSet(key, value);
    } catch (error) {
      console.error("KV set error:", error);
      return false;
    }
  },

  kvDelete: async (key: string) => {
    try {
      await storage.init();
      return await storage.kvDelete(key);
    } catch (error) {
      console.error("KV delete error:", error);
      return false;
    }
  },

  kvList: async (pattern: string, returnValues = false) => {
    try {
      await storage.init();
      return await storage.kvList(pattern, returnValues);
    } catch (error) {
      console.error("KV list error:", error);
      return [];
    }
  },

  kvFlush: async () => {
    try {
      await storage.init();
      return await storage.kvFlush();
    } catch (error) {
      console.error("KV flush error:", error);
      return false;
    }
  },

  // AI operations
  analyzeResume: async (imagePath: string, instructions: string) => {
    try {
      set({ isLoading: true, error: null });
      aiService.init();
      const response = await aiService.feedback(imagePath, instructions);
      set({ isLoading: false });
      
      if (response) {
        const content = typeof response.message.content === "string"
          ? response.message.content
          : response.message.content[0].text;
        return JSON.parse(content);
      }
      return null;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Analysis failed";
      set({ isLoading: false, error: errorMsg });
      return null;
    }
  },

  // Utility
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  
  clearAll: async () => {
    try {
      set({ isLoading: true, error: null });
      await storage.init();
      await storage.clearAll();
      set({ isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Clear failed";
      set({ isLoading: false, error: errorMsg });
    }
  },
}));
