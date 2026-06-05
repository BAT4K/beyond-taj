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

const resend = new Resend(process.env.RESEND_API_KEY);

function MagicLinkEmail({ url, host }: { url: string; host: string }) {
  return `
    <div style="background-color: #0a0806; color: #ffffff; padding: 40px 20px; font-family: sans-serif; text-align: center;">
      <h1 style="color: #c9a96e; font-weight: normal; letter-spacing: 2px; margin: 0;">BEYOND TAJ</h1>
      <p style="font-size: 16px; color: rgba(255,255,255,0.7); margin-top: 30px; margin-bottom: 40px;">
        Secure login request for ${host}
      </p>
      <a href="${url}" style="background-color: #c9a96e; color: #0a0806; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 4px; display: inline-block; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
        Sign In Securely
      </a>
      <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 40px;">
        If you did not request this email, you can safely ignore it. Your account is secure.
      </p>
    </div>
  `;
}

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
            html: MagicLinkEmail({ url, host }),
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
