import { NextRequest, NextResponse } from 'next/server';

const BACKEND_LOGOUT_URL = process.env.NEXT_PUBLIC_BACKEND_URL +'/api';

export async function POST(request: NextRequest) {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ message: 'User already logged out.' }, { status: 200 });
  }

  try {
    const response = await fetch(BACKEND_LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies, 
      },
      cache: 'no-store',
    });

    if (!response.ok) {
        console.error('Backend logout failed, but proceeding with client cookie cleanup.');
    }
    
    const logoutResponse = NextResponse.json({ message: 'Successfully logged out' }, { status: 200 });
    
    logoutResponse.cookies.set('auth_token', '', { 
        maxAge: -1,
        path: '/',
        httpOnly: true,
        secure: true,
    });
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
        return response; 
    }

    return logoutResponse;

  } catch (error) {
    console.error('Error during logout proxy:', error);
    return NextResponse.json({ message: 'Помилка сервера при виході.' }, { status: 500 });
  }
}
