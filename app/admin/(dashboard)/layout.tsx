import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/api/admin-auth";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <AdminNav />
      <div className="mt-8 flex gap-10">
        <AdminSidebar />
        <div className="min-w-0 flex-1 pb-16">{children}</div>
      </div>
    </div>
  );
}
