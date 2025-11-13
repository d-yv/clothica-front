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

const fetchCurrentUser = async (): Promise<UserProfileData> => {
    const res = await fetch('https:/clothica-back.onrender.com/api/users/me'); 
    
    if (res.status === 401) {
        console.error('User not authenticated (401)');
        throw new Error('Необхідна авторизація');
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch user data: ${res.status}`);
    }
    return res.json();
}


export default function Cabinet(){
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileData | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  

  const loadUserData = useCallback(async () => {
    try {
        const userData = await fetchCurrentUser(); 
        setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setCurrentUser(undefined);
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
              <UserInfoForm currentUser={userFormInitialData} /> 
          ) : (
              <p className="text-red-500">Не вдалося завантажити дані профілю. Будь ласка, перевірте авторизацію.</p>
          )}
          
      </section>
      <section className="mb-8">
          <h2>Мої замовлення</h2>
          <OrderList orders={currentOrders} /> 
          
      </section>
      
    </div>
  )
}