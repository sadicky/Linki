const test = require("node:test");
const assert = require("node:assert");

function calculateOrderFinancials(subtotal, commissionPct, deliveryFee = 3500) {
  const total = Math.round(subtotal + deliveryFee);
  const commission = Math.round((subtotal * commissionPct) / 100);
  const netRestaurantPayout = Math.round(subtotal - commission);
  return { total, commission, netRestaurantPayout };
}

test("Calcul précis de la commission Linki en CDF (15% par défaut)", () => {
  // Ex: Commande de T-Bone Katangais à 50 000 FC
  const { total, commission, netRestaurantPayout } = calculateOrderFinancials(50000, 15.0);

  assert.strictEqual(total, 53500, "Le montant total doit inclure les 3 500 FC de livraison");
  assert.strictEqual(commission, 7500, "La commission de 15% sur 50 000 FC doit être de 7 500 FC");
  assert.strictEqual(netRestaurantPayout, 42500, "Le restaurateur lushois reçoit 42 500 FC");
  assert.strictEqual(
    netRestaurantPayout + commission,
    50000,
    "La somme reversée + commission doit égaler le sous-total"
  );
});

test("Calcul avec commission préférentielle restaurant lushois (12.5%)", () => {
  // Ex: Grande commande traiteur à 80 000 FC
  const { total, commission, netRestaurantPayout } = calculateOrderFinancials(80000, 12.5);

  assert.strictEqual(total, 83500);
  assert.strictEqual(commission, 10000);
  assert.strictEqual(netRestaurantPayout, 70000);
});

test("Gestion des montants et commissions sur petit panier (18 000 FC)", () => {
  // Ex: Portion de Poulet Bicyclette à 18 000 FC
  const { total, commission, netRestaurantPayout } = calculateOrderFinancials(18000, 15.0);
  assert.strictEqual(total, 21500);
  assert.strictEqual(commission, 2700);
  assert.strictEqual(netRestaurantPayout, 15300);
});
