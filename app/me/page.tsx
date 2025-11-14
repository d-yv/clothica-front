'use client'; 

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import UserInfoForm from '@/components/forms/UserInfoForm/UserInfoForm';
import { OrderList, fetchUserOrders, Order } from '@/components/common/OrderList/OrderList'; 
import { api } from '@/app/api/api';

interface UserProfileData {
  firstName: string;
  lastName?: string;
  phone?: string;
  city?: string;
  postOfficeNum?: string;
}

const fetchCurrentUser = async (): Promise<UserProfileData> => {
    try {
        const res = await api.get<UserProfileData>('/users/me'); 
        
        return res.data;
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 401) {
                console.error('User not authenticated (401). Cookie missing or invalid.');
                throw new Error('Необхідна авторизація: Cookie відсутній або недійсний.');
            }
            const errorMessage = error.response?.data?.error || `Failed to fetch user data: ${error.response?.status}`;
            throw new Error(errorMessage);
        }
        throw new Error('Невідома помилка при отриманні даних користувача.');
    }
}


export default function Cabinet(){
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileData | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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
