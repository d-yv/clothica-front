
'use client'; 

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import UserInfoForm from '@/components/forms/UserInfoForm/UserInfoForm';
import { OrderList, Order } from '@/components/common/OrderList/OrderList'; 
import MessageNoInfo from "@/components/common/MessageNoInfo/MessageNoInfo"; 
import { useAuth } from '@/hooks/useAuth'; 

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
        const errorMessage = (error as Error).message;
        throw new Error(errorMessage.includes('Авторизація') ? errorMessage : 'Невідома помилка при отриманні даних користувача.');
    }
}

const fetchUserOrders = async (): Promise<Order[]> => {
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


export default function Cabinet(): JSX.Element{
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileData | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false); 
  
  const { handleLogout } = useAuth();

  const loadUserData = useCallback(async () => {
    setAuthError(null); 
    try {
        const userData = await fetchCurrentUser(); 
        setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      const errorMessage = (error as Error).message;

      if (errorMessage.includes('Авторизація')) {
          setAuthError(errorMessage);
          handleLogout('/auth/login'); 
          return; 
      }
      
      setCurrentUser(undefined);
      setAuthError(errorMessage.includes('Авторизація') ? errorMessage : 'Не вдалося завантажити дані профілю.');
      
    }
  }, [handleLogout]);
  
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

  const handleCabinetLogout = async () => {
    setIsLoggingOut(true);
    await handleLogout('/auth/login'); 
    setIsLoggingOut(false);
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
    <div className={styles.profilePageContainer}>
      <h1 className={styles.title}>Кабінет</h1>
      <h3 className={styles.sectionTitle}>Особиста інформація</h3>
      <section>
      
          {currentUser ? (
              <UserInfoForm currentUser={userFormInitialData} onProfileUpdate={loadUserData} /> 
          ) : (
              <p className="text-red-500">
                  {authError || 'Не вдалося завантажити дані профілю. Будь ласка, перевірте авторизацію.'}
              </p>
          )}
          
      </section>
      <section>
          <h2 className={styles.sectionTitle}>Мої замовлення</h2>
          {currentOrders.length === 0 ? (
              <MessageNoInfo 
                  text="У вас ще немає жодного замовлення." 
                  buttonText="Перейти до покупок" 
                  route="/goods" 
              />
          ) : (
              <OrderList orders={currentOrders} /> 
          )}
      </section>
      <div className={styles.logoutWrapper}>
          <button 
              onClick={handleCabinetLogout} 
              disabled={isLoggingOut}
              className={styles.logoutButton}
          >
              {isLoggingOut ? 'Вихід...' : 'Вийти з кабінету'}
          </button>
      </div>
    </div>
  )
}
