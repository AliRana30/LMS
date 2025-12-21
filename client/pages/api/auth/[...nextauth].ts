// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider, { GithubProfile } from "next-auth/providers/github"

const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: "read:user user:email"
                }
            },
            profile(profile: GithubProfile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email || '',
                    image: profile.avatar_url || ''
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            return true
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            return session
        }
    },
    pages: {
        signIn: '/',
        error: '/',
    },
    debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export default NextAuth(authOptions)