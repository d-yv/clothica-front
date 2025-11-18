// import { NextRequest, NextResponse } from 'next/server';
// import { api } from '../../api/api';

// // const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api'; 

// export async function GET(request: NextRequest) {
//   console.log('✅ API route /api/orders called');
//   const cookies = request.headers.get('cookie');

//   if (!cookies) {
//     return NextResponse.json({ message: 'Немає авторизаційних даних (cookies).' }, { status: 401 });
//   }

//   try {
//     const apiRes = await api.get('/orders', {
//       headers: {
//         'Cookie': cookies,
//       },
//     });

//     console.log('📦 Received data:', apiRes.data);
//     return NextResponse.json(apiRes.data);

//   } catch (error: unknown) {
//     console.error('Error fetching orders data from backend:', error);
    
//     if (error && typeof error === 'object' && 'response' in error) {
//       const apiError = error as { response?: { data?: unknown; status?: number } };
//       return NextResponse.json(
//         apiError.response?.data || { message: 'Помилка сервера при отриманні замовлень.' },
//         { status: apiError.response?.status || 500 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: 'Помилка сервера при отриманні замовлень.' },
//       { status: 500 }
//     );
//   }
// }

// // Добавляем POST метод для создания заказов
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log('✅ [ORDERS] Заказ получен:', body);
    
//     const apiRes = await api.post('/orders', body);
    
//     return NextResponse.json(apiRes.data);
    
//   } catch (error: unknown) {
//     console.error('❌ [ORDERS] Ошибка:', error);
    
//     if (error && typeof error === 'object' && 'response' in error) {
//       const apiError = error as { response?: { data?: { error?: string }; status?: number } };
      
//       return NextResponse.json(
//         { error: apiError.response?.data?.error || 'Помилка створення замовлення' },
//         { status: apiError.response?.status || 500 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Помилка сервера' },
//       { status: 500 }
//     );
//   }
// }


// // Импорты из Next.js для работы с API routes
// import { NextRequest, NextResponse } from 'next/server';
// // Наши утилиты для API
// import { api } from '../../api/api';

// // POST обработчик для маршрута /api/orders
// export async function POST(req: NextRequest) {
//   // Парсим тело запроса в JSON
//   const body = await req.json();
  
//   try {
//     // Делаем запрос к бекенду для создания заказа
//     const apiRes = await api.post('orders', body);
    
//     // Возвращаем данные заказа
//     return NextResponse.json(apiRes.data);
    
//   } catch (error: unknown) {
//     // Обрабатываем ошибки API
//     if (error && typeof error === 'object' && 'response' in error) {
//       const apiError = error as { 
//         response?: { 
//           data?: { 
//             error?: string;
//             message?: string;
//           }; 
//           status?: number; 
//         }; 
//       };
      
//       // Если бекенд вернул ошибку с сообщением
//       const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message || 'Помилка створення замовлення';
      
//       return NextResponse.json(
//         { error: errorMessage },
//         { status: apiError.response?.status || 500 }
//       );
//     }
    
//     // Обрабатываем другие ошибки (сеть, таймаут и т.д.)
//     return NextResponse.json(
//       { error: 'Внутрішня помилка сервера' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export async function POST(request: NextRequest) {
  console.log('✅ API route /api/orders called');
  
  try {
    const orderData = await request.json();
    console.log('📦 Received order data:', orderData);

    const response = await fetch(`${BACKEND_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const orderResponse = await response.json();
    console.log('📦 Order created:', orderResponse);
    return NextResponse.json(orderResponse);

  } catch (error) {
    console.error('Error creating order via backend:', error);
    return NextResponse.json(
      { message: 'Помилка сервера при створенні замовлення.' },
      { status: 500 }
    );
  }
}