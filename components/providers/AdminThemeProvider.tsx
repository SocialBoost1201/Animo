'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SIDEBAR_DARK, SIDEBAR_LIGHT,
  FORM_DARK, FORM_LIGHT,
  type AdminFormTokens,
} from '@/lib/admin-theme';

type AdminTheme = 'dark' | 'light';

type AdminThemeContextValue = {
  theme: AdminTheme;
  setTheme: (t: AdminTheme) => void;
  /** Sidebar / layout tokens */
  T: typeof SIDEBAR_DARK;
  /** Form / page tokens */
  F: AdminFormTokens;
  isDark: boolean;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

const STORAGE_KEY = 'animo-admin-theme';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // lazy initializer でSSR安全にlocalStorageを読み込む（エフェクト内でのsetState不要）
  const [theme, setThemeState] = useState<AdminTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); // ハイドレーション後のフラッシュ防止のため意図的に呼び出す
  }, []);

  const setTheme = (t: AdminTheme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const isDark = theme === 'dark';
  const T = isDark ? SIDEBAR_DARK : SIDEBAR_LIGHT;
  const F = isDark ? FORM_DARK : FORM_LIGHT;

  // マウント前はデフォルト(dark)で描画してチラつきを抑止
  if (!mounted) {
    return (
      <AdminThemeContext.Provider value={{ theme: 'dark', setTheme, T: SIDEBAR_DARK, F: FORM_DARK, isDark: true }}>
        {children}
      </AdminThemeContext.Provider>
    );
  }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, T, F, isDark }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error('useAdminTheme must be used inside AdminThemeProvider');
  return ctx;
}
