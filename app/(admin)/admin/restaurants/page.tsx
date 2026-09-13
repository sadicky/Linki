import { getAllRestaurantsForAdmin } from "@/lib/actions/admin.actions";
import { CommissionManager } from "@/components/admin/CommissionManager";

export default async function AdminRestaurantsPage() {
  const restaurants = await getAllRestaurantsForAdmin();

  return <CommissionManager restaurants={restaurants} />;
}
