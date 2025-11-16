import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL +'/api'; 

export async function GET(request: NextRequest) {
  console.log('✅ API route /api/ausers/me called');
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ message: 'Немає авторизаційних даних (cookies).' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/me`, {
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

    const userData = await response.json();
    console.log('📦 Received data:', userData);
    return NextResponse.json(userData);

  } catch (error) {
    console.error('Error fetching user data from backend:', error);
    return NextResponse.json({ message: 'Помилка сервера при отриманні даних користувача.' }, { status: 500 });
  }
}
export async function PATCH(request: NextRequest) {
  console.log('✅ API route /api/ausers/me called');
  const cookies = request.headers.get('cookie');
  let dataToUpdate;
  
  try {
    dataToUpdate = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Невірний формат JSON у тілі запиту.' }, { status: 400 });
  }

  if (!cookies) {
    return NextResponse.json({ message: 'Немає авторизаційних даних.' }, { status: 401 });
  }
  
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies, 
      },
      body: JSON.stringify(dataToUpdate),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const updatedUser = await response.json();
    console.log('📦 Received data:', updatedUser);
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user data via backend:', error);
    return NextResponse.json({ message: 'Помилка сервера при оновленні даних.' }, { status: 500 });
  }
}
