import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const token = (await cookies()).get('token')?.value;
    const user = token ? await verifyAuth(token) : null;

    let response = NextResponse.next();

    // protected routes
    const protectedRoutes = ['/'];
    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            request.nextUrl.pathname === route ||
            request.nextUrl.pathname.startsWith(route + '/')
    );

    if (isProtectedRoute) {
        if (!user) {
            if (request.nextUrl.pathname !== '/login') {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('from', request.nextUrl.pathname);
                response = NextResponse.redirect(loginUrl);
            }
        }
    }

    // public routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.some(
        (route) => request.nextUrl.pathname === route
    );
    if (isPublicRoute) {
        if (user) {
            const homeUrl = new URL('/', request.url);
            response = NextResponse.redirect(homeUrl);
        }
    }

    return response;
}
