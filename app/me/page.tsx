'use client'; 

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import UserInfoForm from '@/components/forms/UserInfoForm/UserInfoForm';
import { OrderList, fetchUserOrders, Order } from '@/components/common/OrderList/OrderList'; 

interface UserProfileData {
  firstName: string;
  lastName?: string;
  phone?: string;
  city?: string;
  postOfficeNum?: string;
}

/**
 * Отримує дані поточного користувача. 
 * Токен буде автоматично надісланий у Cookie завдяки опції 'credentials'.
 */
const fetchCurrentUser = async (): Promise<UserProfileData> => {
    // !!! Видалено отримання токена з localStorage !!!
    
    // Переконайтеся, що тут правильний URL
    const API_URL = 'http://localhost:4000/api/users/me'; 

    const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // !!! Видалено заголовок Authorization !!!
        },
        // !!! ДОДАНО: Ця опція дозволяє надсилати Cookie з запитом до іншого домену/порту
        credentials: 'include', 
    }); 
    
    if (res.status === 401) {
        console.error('User not authenticated (401). Cookie missing or invalid.');
        // Тут можна додати логіку для перенаправлення на сторінку входу
        throw new Error('Необхідна авторизація: Cookie відсутній або недійсний.');
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'No message' }));
        throw new Error(`Failed to fetch user data: ${res.status}. ${errorBody.message}`);
    }
    return res.json();
}


export default function Cabinet(){
  // ... (весь код компонента залишається майже незмінним, крім функцій)
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileData | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // ... loadUserData, loadOrdersData, useEffect залишаються незмінними.
  // ... loadUserData тепер викликає fetchCurrentUser, який використовує Cookie.
  
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
      
    </div>
  )
}
