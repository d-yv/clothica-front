
'use client';

import React from 'react';

export interface Order {
  id: string;
  date: string; 
  number: string;
  amount: number;
  status: 'Оплачено' | 'В обробці' | 'Відправлено' | 'Скасовано';
}
export const fetchUserOrders = async (): Promise<Order[]> => {
  console.log('Fetching user orders (integrated)...');
  
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return [
    { id: 'ORD001', date: '2025-10-20', number: '12345', amount: 450.50, status: 'Відправлено' },
    { id: 'ORD002', date: '2025-11-05', number: '67890', amount: 1200.00, status: 'Оплачено' },
  ];
};

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <div className="space-y-3">
    {orders.map((order) => {
        let statusColor = 'text-gray-600';
        if (order.status === 'Відправлено' || order.status === 'Оплачено') {
            statusColor = 'text-green-600';
        } else if (order.status === 'В обробці') {
            statusColor = 'text-orange-600';
        } else if (order.status === 'Скасовано') {
            statusColor = 'text-red-600';
        }
        
        return (
        
            <div key={order.id} className="p-3 border rounded-lg shadow-sm bg-white">
                <p><strong>Дата:</strong> {order.date}</p>
                <p><strong>Номер:</strong> {order.number}</p>
                <p><strong>Сума:</strong> {order.amount.toFixed(2)} грн</p>
                <p>
                    <strong>Статус:</strong> 
                    <span className={`font-semibold ${statusColor} ml-2`}>
                        {order.status}
                    </span>
                </p>
            </div>
        );
    })}
  </div>
);
