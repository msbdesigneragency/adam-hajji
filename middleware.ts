import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];
  const headers = new Headers(request.headers);
  headers.set(
    "x-clinic-locale",
    ["fr", "en", "ar"].includes(locale) ? locale : "fr",
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
