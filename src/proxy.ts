import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("refresh_token")?.value;

  const pathname = req.nextUrl.pathname;
  //* Redirect routes
  const authenticatedHomeRoute = "/feed";
  const loginRoute = "/login";

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  //* 1.If it's a public route and there is token => allow access
  if (isPublicRoute) {
    if ((pathname === "/login" || pathname === "/register") && token) {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
    return NextResponse.next();
  }
  //* 2.If not a public route and no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
 
  //* 4.If its a public route
  if (pathname === "/") {
    if (token) {
      //* If token exists, redirect to the feed/homepage
      return NextResponse.redirect(new URL(authenticatedHomeRoute, req.url));
    } else {
      //* If no token exists, redirect to the login page
      return NextResponse.redirect(new URL(loginRoute, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
};
