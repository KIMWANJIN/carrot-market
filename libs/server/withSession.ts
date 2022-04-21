import { withIronSessionApiRoute } from "iron-session/next"

const cookieOptions = {
  cookieName: "cmcc",
  password: process.env.COOKIE_PW!
}

declare module "iron-session" {
  interface IronSessionData{
    user?: {
      id: number
    }
  }
}

// Get session from API route
export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions)
}

// When server side rendering get session 