import { getPendingPartners } from "@/lib/actions/admin.actions";
import { PartnerValidationsManager } from "@/components/admin/PartnerValidationsManager";

export default async function AdminValidationsPage() {
  const pendingPartners = await getPendingPartners();

  return <PartnerValidationsManager initialPending={pendingPartners} />;
}
