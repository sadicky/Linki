const test = require("node:test");
const assert = require("node:assert");

// Machine à états des commandes
const ALLOWED_RESTAURANT_TRANSITIONS = {
  en_attente: ["acceptee", "annulee"],
  acceptee: ["en_preparation", "annulee"],
  en_preparation: ["prete", "annulee"],
  prete: ["annulee"],
};

const ALLOWED_COURIER_TRANSITIONS = {
  prete: ["en_livraison"],
  en_livraison: ["livree"],
};

function canRestaurantTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_RESTAURANT_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(nextStatus));
}

function canCourierTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_COURIER_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(nextStatus));
}

test("Workflow valide : du passage de commande à la livraison finale", () => {
  let status = "en_attente";

  // 1. Restaurant accepte
  assert.strictEqual(canRestaurantTransition(status, "acceptee"), true);
  status = "acceptee";

  // 2. Restaurant démarre préparation
  assert.strictEqual(canRestaurantTransition(status, "en_preparation"), true);
  status = "en_preparation";

  // 3. Restaurant marque prêt
  assert.strictEqual(canRestaurantTransition(status, "prete"), true);
  status = "prete";

  // 4. Livreur prend en charge la course
  assert.strictEqual(canCourierTransition(status, "en_livraison"), true);
  status = "en_livraison";

  // 5. Livreur valide la livraison
  assert.strictEqual(canCourierTransition(status, "livree"), true);
  status = "livree";
});

test("Rejet des transitions illégales ou sauts d'étapes", () => {
  // Une commande 'en_attente' ne peut pas sauter directement à 'livree'
  assert.strictEqual(canRestaurantTransition("en_attente", "livree"), false);
  assert.strictEqual(canCourierTransition("en_attente", "livree"), false);

  // Une commande 'en_preparation' ne peut pas être livrée sans passer par 'prete' et 'en_livraison'
  assert.strictEqual(canCourierTransition("en_preparation", "livree"), false);

  // Une commande 'livree' ne peut plus être modifiée
  assert.strictEqual(canRestaurantTransition("livree", "en_attente"), false);
  assert.strictEqual(canCourierTransition("livree", "prete"), false);
});

test("Annulation autorisée en cuisine en cas de problème de stock", () => {
  assert.strictEqual(canRestaurantTransition("en_attente", "annulee"), true);
  assert.strictEqual(canRestaurantTransition("acceptee", "annulee"), true);
  assert.strictEqual(canRestaurantTransition("en_preparation", "annulee"), true);
});
