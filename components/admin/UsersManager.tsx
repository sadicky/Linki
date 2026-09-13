"use client";

import React, { useState, useTransition } from "react";
import {
  Users,
  Search,
  Shield,
  Store,
  Bike,
  User,
  CheckCircle2,
  Clock,
  Ban,
  Filter,
  Loader2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import type { Profile } from "@/lib/mock-data";
import type { UserRole, AccountStatus } from "@/lib/supabase/types";
import { updateUserRole, updateUserAccountStatus } from "@/lib/actions/admin.actions";
import { formatDate } from "@/lib/utils";

interface UsersManagerProps {
  initialUsers: Profile[];
  stats: {
    totalUsers: number;
    clientsCount: number;
    restaurantsCount: number;
    couriersCount: number;
    adminsCount: number;
  };
}

export function UsersManager({ initialUsers, stats }: UsersManagerProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<{ id: string; text: string } | null>(null);

  // Filtrage local en temps réel
  const filteredUsers = users.filter((u) => {
    if (selectedRole !== "all" && u.role !== selectedRole) return false;
    if (selectedStatus !== "all" && u.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.full_name.toLowerCase().includes(q);
      const matchPhone = u.phone ? u.phone.toLowerCase().includes(q) : false;
      const matchRole = u.role.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRole && !matchId) return false;
    }
    return true;
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setActionMessage({ id: userId, text: `Rôle mis à jour : ${newRole.toUpperCase()}` });
        setTimeout(() => setActionMessage(null), 3000);
      }
    });
  };

  const handleStatusChange = (userId: string, newStatus: AccountStatus) => {
    startTransition(async () => {
      const res = await updateUserAccountStatus(userId, newStatus);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        setActionMessage({ id: userId, text: `Statut : ${newStatus.replace("_", " ").toUpperCase()}` });
        setTimeout(() => setActionMessage(null), 3000);
      }
    });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "client":
        return {
          label: "Client",
          color: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: User,
        };
      case "restaurant":
        return {
          label: "Restaurateur",
          color: "bg-amber-50 text-amber-700 border-amber-100",
          icon: Store,
        };
      case "livreur":
        return {
          label: "Livreur Motard",
          color: "bg-sky-50 text-sky-700 border-sky-100",
          icon: Bike,
        };
      case "admin":
        return {
          label: "Super Admin",
          color: "bg-purple-50 text-purple-700 border-purple-100",
          icon: Shield,
        };
    }
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case "actif":
        return {
          label: "Actif",
          color: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle2,
        };
      case "en_attente_validation":
        return {
          label: "En Attente",
          color: "bg-amber-50 text-amber-700 border-amber-100",
          icon: Clock,
        };
      case "suspendu":
        return {
          label: "Suspendu",
          color: "bg-rose-50 text-rose-700 border-rose-100",
          icon: Ban,
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold mb-1 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Table Unique : profiles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-purple-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Tous les utilisateurs de la plateforme Linki sont centralisés dans une table unique et différenciés par leur rôle (Client, Restaurateur, Livreur, Super Admin).
          </p>
        </div>
      </div>

      {/* Cartes Métriques par Rôle */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Total Utilisateurs
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalUsers}</div>
          <span className="text-[10px] text-slate-400">Tous rôles confondus</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Clients
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">{stats.clientsCount}</div>
          <span className="text-[10px] text-emerald-600/80">Commandent à Lubum</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            Restaurateurs
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-700">{stats.restaurantsCount}</div>
          <span className="text-[10px] text-amber-600/80">Cuisines partenaires</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-sky-700 flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-sky-600" />
            Livreurs
          </span>
          <div className="text-xl sm:text-2xl font-black text-sky-700">{stats.couriersCount}</div>
          <span className="text-[10px] text-sky-600/80">Motards actifs</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            Super Admins
          </span>
          <div className="text-xl sm:text-2xl font-black text-purple-700">{stats.adminsCount}</div>
          <span className="text-[10px] text-purple-600/80">Gestion & Supervision</span>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Recherche */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, téléphone, rôle..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtre par Statut */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Statut :</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AccountStatus | "all")}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="en_attente_validation">En attente de validation</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
        </div>

        {/* Filtres par Rôle (Pilules interactives) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">Rôles :</span>

          <button
            type="button"
            onClick={() => setSelectedRole("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedRole === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
            }`}
          >
            Tous ({users.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRole === "client"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-100"
            }`}
          >
            <User className="w-3 h-3" />
            <span>Clients ({stats.clientsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("restaurant")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRole === "restaurant"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50/70 text-amber-800 hover:bg-amber-100/70 border border-amber-100"
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Restaurateurs ({stats.restaurantsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("livreur")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRole === "livreur"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-sky-50/70 text-sky-800 hover:bg-sky-100/70 border border-sky-100"
            }`}
          >
            <Bike className="w-3 h-3" />
            <span>Livreurs ({stats.couriersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRole === "admin"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50/70 text-purple-800 hover:bg-purple-100/70 border border-purple-100"
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Super Admins ({stats.adminsCount})</span>
          </button>
        </div>
      </div>

      {/* Table des Utilisateurs */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Utilisateur</th>
                <th className="py-3.5 px-4">Rôle Attribué</th>
                <th className="py-3.5 px-4">Statut Compte</th>
                <th className="py-3.5 px-4">Inscrit le</th>
                <th className="py-3.5 px-5 text-right">Actions de Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">Aucun utilisateur correspondant trouvé</p>
                    <p className="text-[11px]">Essayez de modifier votre recherche ou les filtres de rôle.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status);
                  const RoleIcon = roleBadge.icon;
                  const StatusIcon = statusBadge.icon;
                  const isActionOnThisUser = actionMessage?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Utilisateur */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.avatar_url ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                            }
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {user.full_name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{user.phone || "Pas de numéro"}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {user.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rôle */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleBadge.color}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            <span>{roleBadge.label}</span>
                          </span>

                          {/* Sélecteur de rôle en direct */}
                          <div className="relative w-fit">
                            <select
                              value={user.role}
                              disabled={isPending}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className="text-[10px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-none focus:border-purple-500"
                            >
                              <option value="client">Rôle : Client</option>
                              <option value="restaurant">Rôle : Restaurateur</option>
                              <option value="livreur">Rôle : Livreur Motard</option>
                              <option value="admin">Rôle : Super Admin</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusBadge.label}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isActionOnThisUser && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 animate-fade-in">
                              {actionMessage.text}
                            </span>
                          )}

                          {user.status === "actif" ? (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(user.id, "suspendu")}
                              disabled={isPending}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 transition-colors cursor-pointer"
                            >
                              Suspendre
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(user.id, "actif")}
                              disabled={isPending}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 transition-colors cursor-pointer"
                            >
                              Activer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
