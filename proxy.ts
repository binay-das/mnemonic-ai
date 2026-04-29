import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                const path = req.nextUrl.pathname

                if (path === '/') {
                    return true
                }

                return !!token
            },
        },
        pages: {
            signIn: '/auth/signin',
        },
    }
)

export const config = {
    matcher: [
        "/((?!api/auth|api/register|signin|signup|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)",
    ]
}
