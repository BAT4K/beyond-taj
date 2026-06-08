import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.isAdmin) {
    // If logged in but not an admin, redirect to their user dashboard
    redirect("/dashboard");
  }

  return <>{children}</>;
}
