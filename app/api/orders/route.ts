import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api/api';

interface BackendError {
  statusCode?: number;
  error?: string;
  message?: string;
  validation?: {
    body?: {
      source?: string;
      keys?: string[];
      message?: string;
    };
  };
}

interface CartItem {
  goodId: string;
  size: string;
  amount: number;
  pricePerItem: number; 
}

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postOfficeNum: string;
  comment?: string;
}

interface OrderRequestBody {
  cart: CartItem[];
  status: string;
  userData: UserData;
}


export async function POST(req: NextRequest) {
  
  try {
    const body: OrderRequestBody = await req.json();
    
    // 1. Отримання заголовка Cookie з вхідного запиту клієнта
    const cookieHeader = req.headers.get('cookie');
    
    // Логування тіла запиту перед відправкою на зовнішній бекенд
    console.log('📦 [NEXT-API] Тіло запиту, що надсилається на зовнішній бекенд (Body):', body);
    console.log('🍪 [NEXT-API] Заголовок Cookie, що надсилається:', cookieHeader ? cookieHeader.substring(0, 50) + '...' : 'NONE'); // Логуємо частину кукі
    
    // 2. Створення об'єкта заголовків для запиту Axios
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 3. Явне додавання заголовка Cookie до вихідного запиту, якщо він існує
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // 4. ПРОКИДАЄМО запит на зовнішній бекенд, передаючи заголовки
    // Використовуємо .post з додатковим об'єктом конфігурації
    const apiRes = await api.post('/orders', body, { headers });
    
    // Логування відповіді від зовнішнього бекенду
    console.log('✅ [NEXT-API] Успішна відповідь від зовнішнього бекенду:', apiRes.data);
 
    return NextResponse.json(apiRes.data);
    
  } catch (error: unknown) {
    console.error('❌ [NEXT-API] Ошибка в API route:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: {
          data?: BackendError;
          status?: number;
          statusText?: string;
        };
      };
      
      const backendError: BackendError = axiosError.response?.data || {};
      const statusCode = axiosError.response?.status || 500;
      
      console.error('🔍 [NEXT-API] Детали ошибки от бекенда:', {
        status: statusCode,
        statusText: axiosError.response?.statusText,
        validation: backendError.validation?.body,
        message: backendError.message
      });
      
      return NextResponse.json(
        backendError,
        { status: statusCode }
      );
    }
    
    console.error('❌ [NEXT-API] Неизвестная ошибка:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Внутренняя помилка сервера',
          message: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Внутренняя помилка сервера',
        message: 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}



// // app/api/orders/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { api } from '../../api/api';

// interface BackendError {
//   statusCode?: number;
//   error?: string;
//   message?: string;
//   validation?: {
//     body?: {
//       source?: string;
//       keys?: string[];
//       message?: string;
//     };
//   };
// }

// interface CartItem {
//   goodId: string;
//   size: string;
//   amount: number;
// }

// interface UserData {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   postOfficeNum: string;
//   comment?: string;
// }

// interface OrderRequestBody {
//   cart: CartItem[];
//   status: string;
//   userData: UserData;
// }

// export async function POST(req: NextRequest) {
  
//   try {
//     const body: OrderRequestBody = await req.json();
      
//     const apiRes = await api.post('/orders', body);
 
//     return NextResponse.json(apiRes.data);
    
//   } catch (error: unknown) {
//     console.error('❌ [NEXT-API] Ошибка в API route:', error);
    
//     if (error && typeof error === 'object' && 'response' in error) {
//       const axiosError = error as { 
//         response?: {
//           data?: BackendError;
//           status?: number;
//           statusText?: string;
//         };
//       };
      
//       const backendError: BackendError = axiosError.response?.data || {};
//       const statusCode = axiosError.response?.status || 500;
      
//       console.error('🔍 [NEXT-API] Детали ошибки от бекенда:', {
//         status: statusCode,
//         statusText: axiosError.response?.statusText,
//         validation: backendError.validation?.body,
//         message: backendError.message
//       });
      
//       return NextResponse.json(
//         backendError,
//         { status: statusCode }
//       );
//     }
    
//     console.error('❌ [NEXT-API] Неизвестная ошибка:', error);
    
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { 
//           error: 'Внутренняя помилка сервера',
//           message: error.message 
//         },
//         { status: 500 }
//       );
//     }
    
//     return NextResponse.json(
//       { 
//         error: 'Внутренняя помилка сервера',
//         message: 'Невідома помилка'
//       },
//       { status: 500 }
//     );
//   }
// }
