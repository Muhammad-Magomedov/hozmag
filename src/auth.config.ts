import type { NextAuthConfig } from "next-auth";
import type { Permission, Role } from "@/types";

/**
 * Edge-безопасная часть конфигурации (без mongoose/bcrypt).
 * Используется и в middleware, и в основном auth.ts.
 */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    // Гейт доступа к /admin. Вызывается в middleware.
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;
      if (path.startsWith("/admin")) {
        if (!user) return false; // не залогинен → на /login
        if (user.role !== "admin" && user.role !== "superadmin") {
          // залогинен, но не сотрудник → на главную
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = (user.id ?? token.sub) as string;
        token.role = user.role;
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.permissions = (token.permissions as Permission[]) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
