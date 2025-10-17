import { useEffect, useState } from 'react';

import { useState, useEffect } from 'react';

const storageKey = 'agrigo_auth';

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || null; } catch { return null; }
}

export function setAuth(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(storageKey);
}

export function useAuth() {
  const [auth, setAuthState] = useState(getAuth());
  useEffect(() => {
    const onStorage = () => setAuthState(getAuth());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return [auth, (v) => { setAuth(v); setAuthState(v); }];
}

export function useAuthInit() {
  useEffect(() => { getAuth(); }, []);
}
