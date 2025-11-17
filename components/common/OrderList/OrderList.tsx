'use client';

import React from 'react';
import styles from "./OrderList.module.css";

export interface Order {
  id: string; 
  orderDate: string; 
  orderNumber: string;
  total: number;
  status: 'Оплачено' | 'В обробці' | 'Відправлено' | 'Скасовано';
}


interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <div className={styles.orderListContainer}>
    {orders.map((order) => {
        return (
            <div key={order.id} className={styles.orderItem}>
              <div className={styles.orderItemDetails}>
                
                <div className={styles.orderLeft}>
                  <p className={styles.date}>{order.orderDate}</p>
                  <p className={styles.boldText}>{order.orderNumber}</p>
                </div>
                
                <div className={styles.orderTotal} >
                  <p className={styles.boldText}>Сума:</p>
                  <p className={styles.orderValueText}>{order.total} грн</p>
                </div>
                
                <div className={styles.orderStatusWrapper}>
                  <p className={styles.boldText}>Статус:</p>
                  <p className={styles.orderValueText}>{order.status}</p>
                </div>
                
                </div>
            </div>
        );
    })}
  </div>
);
