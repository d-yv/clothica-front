import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL +'/api'; 

export async function GET(request: NextRequest) {
  console.log('✅ API route /api/ardersalled');
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ message: 'Немає авторизаційних даних (cookies).' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      cache: 'no-store',
    });
    

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const ordersData = await response.json();
    console.log('📦 Received data:', ordersData);
    return NextResponse.json(ordersData);

  } catch (error) {
    console.error('Error fetching orders data from backend:', error);
    return NextResponse.json({ message: 'Помилка сервера при отриманні замовлень.' }, { status: 500 });
  }
}
