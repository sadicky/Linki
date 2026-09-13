import { getAllOrdersForAdmin } from "@/lib/actions/admin.actions";
import { GlobalOrdersManager } from "@/components/admin/GlobalOrdersManager";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return <GlobalOrdersManager initialOrders={orders} />;
}
