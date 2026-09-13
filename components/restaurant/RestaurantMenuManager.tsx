"use client";

import React, { useState, useTransition } from "react";
import {
  saveCategory,
  deleteCategory,
  saveMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
} from "@/lib/actions/restaurant.actions";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import type { Category, MenuItem, Restaurant } from "@/lib/mock-data";

interface RestaurantMenuManagerProps {
  restaurant: Restaurant;
  initialCategories: Category[];
  initialMenuItems: MenuItem[];
}

export function RestaurantMenuManager({
  restaurant,
  initialCategories,
  initialMenuItems,
}: RestaurantMenuManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Forms state
  const [newCatName, setNewCatName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemAvailable, setItemAvailable] = useState(true);

  const [isPending, startTransition] = useTransition();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    startTransition(async () => {
      const res = await saveCategory({
        nom: newCatName,
        ordre: categories.length + 1,
        restaurant_id: restaurant.id,
      });

      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data as Category]);
        setNewCatName("");
        setShowCategoryModal(false);
      }
    });
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;

    startTransition(async () => {
      const res = await deleteCategory(catId);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
      }
    });
  };

  const openAddItemModal = (itemToEdit?: MenuItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setItemName(itemToEdit.nom);
      setItemDesc(itemToEdit.description || "");
      setItemPrice(itemToEdit.prix.toString());
      setItemCategory(itemToEdit.category_id || "");
      setItemImage(itemToEdit.image_url || "");
      setItemAvailable(itemToEdit.disponible);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setItemCategory(categories[0]?.id || "");
      setItemImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600");
      setItemAvailable(true);
    }
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice) return;

    startTransition(async () => {
      const res = await saveMenuItem({
        id: editingItem ? editingItem.id : undefined,
        restaurant_id: restaurant.id,
        category_id: itemCategory || null,
        nom: itemName,
        description: itemDesc || null,
        prix: parseFloat(itemPrice),
        image_url: itemImage || null,
        disponible: itemAvailable,
      });

      if (res.success && res.data) {
        if (editingItem) {
          setMenuItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? (res.data as MenuItem) : it))
          );
        } else {
          setMenuItems((prev) => [...prev, res.data as MenuItem]);
        }
        setShowItemModal(false);
      }
    });
  };

  const handleToggleAvailability = async (itemId: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleMenuItemAvailability(itemId, !current);
      if (res.success) {
        setMenuItems((prev) =>
          prev.map((it) => (it.id === itemId ? { ...it, disponible: !current } : it))
        );
      }
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Supprimer ce plat définitivement ?")) return;

    startTransition(async () => {
      const res = await deleteMenuItem(itemId);
      if (res.success) {
        setMenuItems((prev) => prev.filter((it) => it.id !== itemId));
      }
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-amber-500" />
            Gestion du Menu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos catégories, ajoutez des plats et contrôlez les ruptures de stock en 1 clic.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-100 shadow-2xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-amber-600" />
            <span>Nouvelle catégorie</span>
          </button>

          <button
            onClick={() => openAddItemModal()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un plat</span>
          </button>
        </div>
      </div>

      {/* Catégories tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group flex items-center gap-2 bg-white border border-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-800 whitespace-nowrap shadow-2xs"
          >
            <span>{cat.nom}</span>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Supprimer la catégorie"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Grille des plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((dish) => {
          const category = categories.find((c) => c.id === dish.category_id);

          return (
            <div
              key={dish.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs hover:border-slate-200 transition-all"
            >
              <div className="flex gap-3">
                {dish.image_url ? (
                  <img
                    src={dish.image_url}
                    alt={dish.nom}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold text-amber-700 truncate">
                      {category?.nom || "Sans catégorie"}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {formatPrice(dish.prix)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                    {dish.nom}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Contrôles de disponibilité et édition */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {/* Switch disponibilité */}
                <button
                  onClick={() => handleToggleAvailability(dish.id, dish.disponible)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    dish.disponible
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {dish.disponible ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>En stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rupture</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openAddItemModal(dish)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(dish.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ajout Catégorie */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Nouvelle catégorie de menu</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nom de la catégorie</label>
                <input
                  type="text"
                  placeholder="Ex: Maboke & Poissons, Grillades, Accompagnements..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {isPending ? "Création..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajout / Modification Plat */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              {editingItem ? "Modifier le plat" : "Ajouter un plat au menu"}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nom du plat</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  placeholder="Ex: Liboke de Capitaine Braisé"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Prix en Francs Congolais (FC)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                    placeholder="35000"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Catégorie</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 cursor-pointer"
                  >
                    <option value="">Aucune</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Ingrédients, provenance, cuisson..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">URL Photo du plat</label>
                <input
                  type="url"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="disp-check"
                  checked={itemAvailable}
                  onChange={(e) => setItemAvailable(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="disp-check" className="text-slate-700 font-medium cursor-pointer">
                  Plat immédiatement disponible en cuisine
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer le plat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
