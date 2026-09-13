const test = require("node:test");
const assert = require("node:assert");

// Simulateur de vérification des règles RLS définies dans 20260913_000002_rls_policies.sql
function canAccessOrder(user, order) {
  // 1. Admin a accès complet
  if (user.role === "admin") return true;

  // 2. Client ne voit que ses commandes
  if (user.role === "client") {
    return user.id === order.client_id;
  }

  // 3. Restaurant ne voit que ses commandes
  if (user.role === "restaurant") {
    return user.restaurant_id === order.restaurant_id;
  }

  // 4. Livreur voit les commandes prêtes sans livreur OU celles qui lui sont assignées
  if (user.role === "livreur") {
    return (
      order.livreur_id === user.id ||
      (order.statut === "prete" && !order.livreur_id)
    );
  }

  return false;
}

test("RLS: Le client ne peut voir que ses propres commandes", () => {
  const clientA = { id: "client-1", role: "client" };
  const orderA = { id: "ord-1", client_id: "client-1", restaurant_id: "resto-1" };
  const orderB = { id: "ord-2", client_id: "client-2", restaurant_id: "resto-1" };

  assert.strictEqual(canAccessOrder(clientA, orderA), true);
  assert.strictEqual(canAccessOrder(clientA, orderB), false);
});

test("RLS: Le restaurateur ne voit que les commandes de son restaurant", () => {
  const restoChef = { id: "owner-1", role: "restaurant", restaurant_id: "resto-1" };
  const myRestoOrder = { id: "ord-1", client_id: "client-1", restaurant_id: "resto-1" };
  const competitorOrder = { id: "ord-3", client_id: "client-1", restaurant_id: "resto-2" };

  assert.strictEqual(canAccessOrder(restoChef, myRestoOrder), true);
  assert.strictEqual(canAccessOrder(restoChef, competitorOrder), false);
});

test("RLS: Le livreur ne voit que les commandes prêtes disponibles ou assignées à lui", () => {
  const courier = { id: "livreur-1", role: "livreur" };

  const readyAvailable = { id: "ord-1", statut: "prete", livreur_id: null };
  const assignedToMe = { id: "ord-2", statut: "en_livraison", livreur_id: "livreur-1" };
  const assignedToOther = { id: "ord-3", statut: "en_livraison", livreur_id: "livreur-2" };
  const stillCooking = { id: "ord-4", statut: "en_preparation", livreur_id: null };

  assert.strictEqual(canAccessOrder(courier, readyAvailable), true, "Doit voir les courses prêtes disponibles");
  assert.strictEqual(canAccessOrder(courier, assignedToMe), true, "Doit voir ses courses assignées");
  assert.strictEqual(canAccessOrder(courier, assignedToOther), false, "Ne doit pas voir les courses d'un autre livreur");
  assert.strictEqual(canAccessOrder(courier, stillCooking), false, "Ne doit pas voir les plats encore en cuisson");
});

test("RLS: L'administrateur a une visibilité globale sur toutes les commandes", () => {
  const admin = { id: "admin-1", role: "admin" };
  const anyOrder = { id: "ord-any", client_id: "c-x", restaurant_id: "r-x", livreur_id: "l-x" };

  assert.strictEqual(canAccessOrder(admin, anyOrder), true);
});
