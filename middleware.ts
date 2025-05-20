// middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from './lib/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Exclude static/image assets from middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
