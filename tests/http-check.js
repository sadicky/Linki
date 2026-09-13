const http = require("http");

const testCases = [
  { path: "/", cookie: null, expected: 200 },
  { path: "/login", cookie: null, expected: 200 },
  { path: "/register", cookie: null, expected: 200 },
  { path: "/pending-approval", cookie: null, expected: 200 },

  // Sans cookie -> 307 Redirect vers /login
  { path: "/dashboard/restaurant", cookie: null, expected: 307 },
  { path: "/dashboard/livreur", cookie: null, expected: 307 },
  { path: "/admin", cookie: null, expected: 307 },

  // Espace Restaurant avec cookie role restaurant
  { path: "/dashboard/restaurant", cookie: "linki_user_role=restaurant", expected: 200 },
  { path: "/dashboard/restaurant/orders", cookie: "linki_user_role=restaurant", expected: 200 },
  { path: "/dashboard/restaurant/menu", cookie: "linki_user_role=restaurant", expected: 200 },

  // Espace Livreur avec cookie role livreur
  { path: "/dashboard/livreur", cookie: "linki_user_role=livreur", expected: 200 },
  { path: "/dashboard/livreur/earnings", cookie: "linki_user_role=livreur", expected: 200 },

  // Espace Admin avec cookie role admin
  { path: "/admin", cookie: "linki_user_role=admin", expected: 200 },
  { path: "/admin/validations", cookie: "linki_user_role=admin", expected: 200 },
  { path: "/admin/restaurants", cookie: "linki_user_role=admin", expected: 200 },
  { path: "/admin/orders", cookie: "linki_user_role=admin", expected: 200 },
];

async function check() {
  let hasErrors = false;
  for (const { path, cookie, expected } of testCases) {
    await new Promise((resolve) => {
      const headers = cookie ? { Cookie: cookie } : {};
      http
        .get("http://localhost:3000" + path, { headers }, (res) => {
          const match = res.statusCode === expected;
          console.log(
            `[${match ? "PASS" : "FAIL"}] ${path} (cookie: ${cookie || "none"}) -> Status: ${res.statusCode} (expected: ${expected})`
          );
          if (!match) hasErrors = true;
          resolve();
        })
        .on("error", (err) => {
          console.error(`[ERROR] ${path}: ${err.message}`);
          hasErrors = true;
          resolve();
        });
    });
  }
  if (hasErrors) {
    console.error("Some tests failed!");
    process.exit(1);
  }
  console.log("All 16 route security and accessibility checks PASSED!");
}

check();
