import { NextRequest, NextFetchEvent, NextResponse } from "next/server"

export function middleware(req: NextRequest, event: NextFetchEvent) {
  // if (req.ua?.isBot) {
  //   return new Response("You arn not human", { status: 403 })
  // }
  // if (!req.url.includes("/api")) {
  //   if (!req.cookies.cmcc && !req.url.includes("/enter")) {
  //     return NextResponse.redirect(`${req.nextUrl.origin}/enter`)
  //   }
  // }
}