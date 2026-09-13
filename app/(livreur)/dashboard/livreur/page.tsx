import { getAvailableRuns, getActiveDelivery } from "@/lib/actions/livreur.actions";
import { CourierDashboardView } from "@/components/livreur/CourierDashboardView";

export default async function LivreurDashboardPage() {
  const availableRuns = await getAvailableRuns();
  const activeDeliveryData = await getActiveDelivery();

  return (
    <CourierDashboardView
      availableRuns={availableRuns}
      activeDeliveryData={activeDeliveryData}
    />
  );
}
