import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';

export async function GET(request: NextRequest) {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ message: 'Немає авторизаційних даних (cookies).' }, { status: 401 });
  }

  try {
    const apiRes = await api.get('/orders', {
      headers: {
        'Cookie': cookies,
      },
    });

    return NextResponse.json(apiRes.data);

  } catch (error: unknown) {
    console.error('Error fetching orders data from backend:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: unknown; status?: number } };
      return NextResponse.json(
        apiError.response?.data || { message: 'Помилка сервера при отриманні замовлень.' },
        { status: apiError.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Помилка сервера при отриманні замовлень.' },
      { status: 500 }
    );
  }
}