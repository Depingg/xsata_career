import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "xsata-auth";
const LOGIN_PATH = "/login";

function dashboardPath(raw: string): string | null {
  try {
    const session = JSON.parse(decodeURIComponent(raw)) as {
      role?: string;
    };
    if (session.role === "siswa") return "/siswa";
    return null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const raw = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname === LOGIN_PATH) {
    const dest = raw ? dashboardPath(raw) : null;
    if (dest) {
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (!raw) {
    const url = new URL(LOGIN_PATH, request.url);
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};