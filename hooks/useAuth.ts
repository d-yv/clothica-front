// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_TOKEN_KEY = 'token'; 

export function useAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const checkAuthStatus = useCallback((): boolean => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    const authenticated = Boolean(token);
    setIsAuth(authenticated);
    return authenticated;
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  /**
   * Обробка виходу: викликає API логауту, очищає клієнтський токен та перенаправляє.
   * @param {string} redirectTo - Шлях, куди перенаправити після логауту.
   */
  const handleLogout = useCallback(async (redirectTo: string = '/auth/login') => {
    try {
        const response = await fetch('/api/logout', { 
            method: 'POST',
            credentials: 'include',
        });
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY); 
        }

        if (response.ok) { 
            setIsAuth(false); 
        } else {
            console.error('Logout API failed, but forcing client side cleanup.', await response.text());
            setIsAuth(false);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        if (typeof window !== 'undefined') {
             localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        setIsAuth(false);
    } finally {
        router.push(redirectTo);
    }
  }, [router]);
  
  const setAuth = useCallback((tokenValue: string) => {
    if (typeof window !== 'undefined' && tokenValue) {
        localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
        setIsAuth(true);
    }
  }, []);

  return { isAuth, handleLogout, setAuth, checkAuthStatus };
}
