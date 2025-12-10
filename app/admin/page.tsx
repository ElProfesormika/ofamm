import { AdminDashboard } from "@/components/AdminDashboard";

// The middleware already handles authentication, so we don't need to check again here
export default async function AdminPage() {
  return <AdminDashboard />;
}

