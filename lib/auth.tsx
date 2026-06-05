import { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { render } from "@react-email/render";
import MagicLinkEmailTemplate from "@/components/emails/MagicLinkEmail";

const resend = new Resend(process.env.RESEND_API_KEY);



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 60, // 60 days cache
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "Beyond Taj <onboarding@resend.dev>",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        
        try {
          // Plain text fallback to bypass aggressive spam filters
          const textContent = `Sign in to Beyond Taj\n\nClick the link below to securely sign in:\n${url}\n\nIf you did not request this email, you can safely ignore it.`;

          const { error } = await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: `Sign in to Beyond Taj`,
            html: await render(<MagicLinkEmailTemplate url={url} host={host} />),
            text: textContent,
          });
          
          if (error) {
            console.error("Resend API Error:", error);
            throw new Error(`Resend API Error: ${error.message}`);
          }
        } catch (error) {
          console.error("Failed to send verification email", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        const userId = token?.sub || user?.id;
        if (userId) {
          session.user.id = userId as string;
        }

        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
        const userEmail = session.user.email?.toLowerCase() || "";
        
        // Safely set the isAdmin boolean natively via our augmented interface
        session.user.isAdmin = adminEmails.includes(userEmail);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};
