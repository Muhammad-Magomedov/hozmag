import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Proxy (бывш. middleware) работает в Edge-рантайме — только authConfig, без mongoose.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
