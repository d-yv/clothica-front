import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL +'/api'; 

export async function POST(request: NextRequest) {
  let dataToSubscribe: { email?: string };
  try {
    dataToSubscribe = await request.json();
    
    if (!dataToSubscribe.email) {
      return NextResponse.json({ message: 'Поле "email" є обов\'язковим.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Невірний формат JSON.' }, { status: 400 });
  }

  const email = dataToSubscribe.email.trim();

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const subscriptionData = await response.json();
    return NextResponse.json(subscriptionData);

  } catch (error) {
    console.error('Network error during subscription fetch:', error);
    return NextResponse.json({ message: 'Помилка сервера при обробці запиту.' }, { status: 500 });
  }
}
