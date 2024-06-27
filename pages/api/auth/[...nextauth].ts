import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import Auth0Provider from 'next-auth/providers/auth0';
import { Headers } from 'next/dist/compiled/@edge-runtime/primitives/fetch';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../../util/baseUtils';


// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text'
        },
        password: {
          label: 'password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const email = credentials ? credentials.email : '';
        const password = credentials ? credentials.password : '';

        const res = await fetch('http://localhost:3000/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          console.log('HIT A 401')
        }

        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      }
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
  ],
  theme: {
    colorScheme: 'light',
  },
  session: {
    // @ts-ignore - I don't know if removing this will caus auth to fail
    jwt: true
  },
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);