import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { adminIsConfigured, isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminData } from "@/lib/admin-storage";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const runtime = "nodejs";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <AdminLogin configured={adminIsConfigured()} />;
  let initialData;
  let initialError = "";
  try {
    initialData = await getAdminData();
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load data.";
  }
  return <AdminDashboard initialData={initialData} initialError={initialError} />;
}
