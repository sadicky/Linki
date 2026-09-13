import { notFound } from "next/navigation";
import { getRestaurantById } from "@/lib/actions/client.actions";
import { RestaurantMenuView } from "@/components/client/RestaurantMenuView";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantDetailPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurantData = await getRestaurantById(id);

  if (!restaurantData) {
    notFound();
  }

  const { categories, menuItems, ...restaurant } = restaurantData;

  return (
    <RestaurantMenuView
      restaurant={restaurant}
      categories={categories}
      menuItems={menuItems}
    />
  );
}
