'use client';

import React from 'react';

export interface Order {
  id: string; 
  date: string; 
  number: string;
  amount: number;
  status: 'Оплачено' | 'В обробці' | 'Відправлено' | 'Скасовано';
}


interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <div className="space-y-3">
    {orders.length === 0 && <p className="text-gray-500">Замовлень поки немає.</p>}
    
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
