'use client'; 

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import UserInfoForm from '@/components/forms/UserInfoForm/UserInfoForm';
import { OrderList, Order } from '@/components/common/OrderList/OrderList'; 

interface UserProfileData {
  firstName: string;
  lastName?: string;
  phone?: string;
  city?: string;
  postOfficeNum?: string;
}

const fetchCurrentUser = async (): Promise<UserProfileData> => {
    try {
        const res = await fetch('/api/user', {
            method: 'GET',
            credentials: 'include', 
            cache: 'no-store',
        });
        
        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Необхідна авторизація: Cookie відсутній або недійсний.');
            }
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to fetch user data: ${res.status}`);
        }
        
        return res.json();
        
    } catch (error) {
        console.error('Error in fetchCurrentUser:', error);
        throw new Error((error as Error).message.includes('Авторизація') ? (error as Error).message : 'Невідома помилка при отриманні даних користувача.');
    }
}

const fetchUserOrders = async (): Promise<Order[]> => {
    console.log('Fetching user orders (using Next.js API Route)...');
    
    try {
        const response = await fetch('/api/orders', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        }); 
        
        if (!response.ok) {
             if (response.status === 401) {
                 throw new Error('Необхідна авторизація для отримання замовлень.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
        }
        
        return response.json();

    } catch (error) {
        console.error('Помилка при отриманні замовлень:', error);
        return []; 
    }
};


export default function Cabinet(){
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileData | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Новий стан

  const loadUserData = useCallback(async () => {
    setAuthError(null); 
    try {
        const userData = await fetchCurrentUser(); 
        setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setCurrentUser(undefined);
      setAuthError((error as Error).message.includes('Авторизація') ? (error as Error).message : 'Не вдалося завантажити дані профілю.');
    }
  }, []);
  
  const loadOrdersData = useCallback(async () => {
    try {
      const userOrdersData = await fetchUserOrders(); 
      setOrders(userOrdersData);
    } catch (error) {
      console.error('Failed to load orders data:', error);
      setOrders([]); 
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([loadUserData(), loadOrdersData()]); 
        setIsLoading(false);
    }
    fetchData();
  }, [loadUserData, loadOrdersData]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        
        if (typeof window !== 'undefined') {
            window.location.href = 'auth/login';
        }

    } catch (error) {
        console.error('Logout failed:', error);
        alert('Помилка при спробі вийти. Спробуйте пізніше.');
    } finally {
        setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return <div className={styles.kabinetContainer || "p-8 text-center"}>Завантаження даних кабінету...</div>;
  }
  
  const currentOrders = orders || [];
  
  const userFormInitialData = currentUser ? {
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      phone: currentUser.phone || '', 
      city: currentUser.city || '',
      postOfficeNum: currentUser.postOfficeNum || '',
  } : undefined;

  return(
    <div className={styles.kabinetContainer}>
      <h1 className={styles.title}>Кабінет</h1>
      
      <section className="mb-8">
          {currentUser ? (
              <UserInfoForm currentUser={userFormInitialData} onProfileUpdate={loadUserData} /> 
          ) : (
              <p className="text-red-500">
                  {authError || 'Не вдалося завантажити дані профілю. Будь ласка, перевірте авторизацію.'}
              </p>
          )}
          
      </section>
      <section className="mb-8">
          <h2>Мої замовлення</h2>
          <OrderList orders={currentOrders} /> 
      </section>
      <div className={styles.logoutWrapper}>
          <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className={styles.logoutButton}
          >
              {isLoggingOut ? 'Вихід...' : 'Вийти'}
          </button>
      </div>
    </div>
  )
}
