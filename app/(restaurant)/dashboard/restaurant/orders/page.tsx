import { getRestaurantOrders } from "@/lib/actions/restaurant.actions";
import { LiveKitchenQueue } from "@/components/restaurant/LiveKitchenQueue";

export default async function RestaurantOrdersPage() {
  const orders = await getRestaurantOrders();

  return <LiveKitchenQueue initialOrders={orders} />;
}
