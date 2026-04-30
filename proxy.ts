import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (
          path === "/" ||
          path.startsWith("/auth/signin") ||
          path.startsWith("/auth/signup")
        ) {
          return true;
        }

        return !!token;
      }, 
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
