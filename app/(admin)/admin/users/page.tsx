import { getAllUsersForAdmin, getGlobalPlatformStats } from "@/lib/actions/admin.actions";
import { UsersManager } from "@/components/admin/UsersManager";

export default async function AdminUsersPage() {
  const [users, stats] = await Promise.all([
    getAllUsersForAdmin(),
    getGlobalPlatformStats(),
  ]);

  return (
    <UsersManager
      initialUsers={users}
      stats={{
        totalUsers: stats.totalUsers,
        clientsCount: stats.clientsCount,
        restaurantsCount: stats.restaurantsCount,
        couriersCount: stats.couriersCount,
        adminsCount: stats.adminsCount,
      }}
    />
  );
}
