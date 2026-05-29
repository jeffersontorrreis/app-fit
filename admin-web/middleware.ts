import { NextResponse } from 'next/server';

// A proteção de rota é feita client-side no próprio dashboard/page.tsx
// via onAuthStateChanged do Firebase Auth.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
