import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

// Cấu hình Clerk Middleware
const clerk = clerkMiddleware()

// Danh sách các đường dẫn công khai
const publicRoutes = ['/public', '/about', '/contact']

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const pathname = req.nextUrl.pathname

    // Kiểm tra nếu đường dẫn là công khai
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next() // Bỏ qua kiểm tra cho các đường dẫn công khai
    }

    // Áp dụng Clerk Middleware cho các đường dẫn khác
    return clerk(req, event)
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
