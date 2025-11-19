import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export async function POST(request: NextRequest) {
  
  try {
    const orderData = await request.json();

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
    return NextResponse.json(orderResponse);

  } catch (error) {
    return NextResponse.json(
      { message: 'Помилка сервера при створенні замовлення.' },
      { status: 500 }
    );
  }
}