import { getCurrentUser } from "@/lib/actions/auth.actions";
import { ClientLayoutShell } from "@/components/client/ClientLayoutShell";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <ClientLayoutShell
      userRole={user?.role || "client"}
      userName={user?.full_name}
    >
      {children}
    </ClientLayoutShell>
  );
}
