import { notFound } from "next/navigation";
import { getRestaurantMenu } from "@/lib/actions/restaurant.actions";
import { RestaurantMenuManager } from "@/components/restaurant/RestaurantMenuManager";

export default async function RestaurantMenuPage() {
  const { categories, menuItems, restaurant } = await getRestaurantMenu();

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantMenuManager
      restaurant={restaurant}
      initialCategories={categories}
      initialMenuItems={menuItems}
    />
  );
}
