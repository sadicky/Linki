import { notFound } from "next/navigation";
import { getOrderTrackingDetails } from "@/lib/actions/client.actions";
import { RealtimeOrderTracker } from "@/components/client/RealtimeOrderTracker";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;
  const details = await getOrderTrackingDetails(id);

  if (!details) {
    notFound();
  }

  return (
    <RealtimeOrderTracker
      initialOrder={details.order}
      restaurant={details.restaurant || null}
      initialDelivery={details.delivery || null}
      livreur={details.livreur || null}
    />
  );
}
