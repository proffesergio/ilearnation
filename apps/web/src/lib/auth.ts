import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextRequest } from 'next/server';
import { getStore } from '../../../../packages/data/learning-store.mjs';
import {
  getAuthReadiness,
  assertAuthRequest,
  errorResponse,
} from '../../../../packages/auth/security.mjs';

export { getAuthReadiness };

declare module 'next-auth' {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; image?: string | null };
  }
}

const nextAuth = NextAuth(() => {
  const readiness = getAuthReadiness();
  return {
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
    pages: { signIn: '/signin', error: '/signin' },
    providers: [
      ...(readiness.google
        ? [
            Google({
              clientId: process.env.AUTH_GOOGLE_ID,
              clientSecret: process.env.AUTH_GOOGLE_SECRET,
              authorization: { params: { scope: 'openid email profile' } },
            }),
          ]
        : []),
      ...(readiness.invitations
        ? [
            Credentials({
              id: 'invite',
              name: 'Invitation link',
              credentials: { token: { type: 'password' } },
              async authorize(credentials, request) {
                const store = await getStore();
                // Stored, hashed counters are shared across processes. Tokens never enter logs.
                const source = process.env.VERCEL
                  ? request.headers.get('x-vercel-forwarded-for') || 'unknown'
                  : 'local';
                await store.limited(`invite-login:${source}`, 20, 60_000);
                if (typeof credentials.token !== 'string') return null;
                try {
                  const user = await store.consumeInvitation(credentials.token);
                  return { id: user.id, email: user.email, name: user.displayName };
                } catch (error) {
                  if (
                    error &&
                    typeof error === 'object' &&
                    'code' in error &&
                    ['INVALID_INVITATION', 'ACCOUNT_DELETED'].includes(String(error.code))
                  )
                    return null;
                  throw error;
                }
              },
            }),
          ]
        : []),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (!readiness.configured) return false;
        if (account?.provider === 'google') {
          if (
            profile?.email_verified !== true ||
            typeof profile.sub !== 'string' ||
            typeof profile.email !== 'string'
          )
            return false;
          const stored = await (
            await getStore()
          ).upsertGoogleUser({ sub: profile.sub, email: profile.email, emailVerified: true });
          user.id = stored.id;
          return true;
        }
        return account?.provider === 'invite' && Boolean(user.id);
      },
      async jwt({ token, user }) {
        if (user?.id) token.sub = user.id;
        return token;
      },
      async session({ session, token }) {
        if (token.sub) session.user.id = token.sub;
        return session;
      },
    },
    // Auth.js retains secure HttpOnly, same-site cookies and its CSRF flow.
    debug: false,
    logger: {
      error() {
        console.error(
          'Authentication failed. Check account configuration and storage availability.',
        );
      },
      warn(code) {
        console.warn('Authentication warning:', code);
      },
    },
  };
});

export const { auth, signIn, signOut } = nextAuth;
export const handlers = {
  async GET(request: NextRequest) {
    if (!getAuthReadiness().configured)
      return Response.json({ error: 'Accounts are not configured.' }, { status: 503 });
    try {
      assertAuthRequest(request);
      return await nextAuth.handlers.GET(request);
    } catch (error) {
      return errorResponse(error);
    }
  },
  async POST(request: NextRequest) {
    if (!getAuthReadiness().configured)
      return Response.json({ error: 'Accounts are not configured.' }, { status: 503 });
    try {
      assertAuthRequest(request);
      return await nextAuth.handlers.POST(request);
    } catch (error) {
      return errorResponse(error);
    }
  },
};

/** Always load current roles and profile from SQL. JWT claims grant no role. */
export async function currentUser(options: { authoritative?: boolean } = {}) {
  if (!getAuthReadiness().configured) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  return (await getStore()).getUser(session.user.id, options);
}
