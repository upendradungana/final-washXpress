// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/db";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }

//   interface User {
//     id: string;
//     role: string;
//   }
// }

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     // Add email/password provider if needed
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       // First time user logs in
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl;
//     },
//   },
  
//   pages: {
//     signIn: "/login",
//     newUser: "/register",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


//...............................................................................................




import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
