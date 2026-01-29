import rawEmails from "./emails.json";

export type MockEmail = {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  createdAt: string;
  read: boolean;
};

// 🔥 SINGLE SOURCE OF TRUTH
// Use globalThis to persist across HMR / module reloads
export const emailStore: MockEmail[] = (() => {
  if ((globalThis as any).__EMAIL_STORE__) {
    return (globalThis as any).__EMAIL_STORE__;
  }
  const store = rawEmails.map((e) => ({ ...e, read: false }));
  (globalThis as any).__EMAIL_STORE__ = store;
  return store;
})();