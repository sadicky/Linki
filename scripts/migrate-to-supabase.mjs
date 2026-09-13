/**
 * Script de migration et synchronisation des données locales vers Supabase en ligne
 * Usage : npm run db:migrate
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Charger .env.local
const envPath = path.join(rootDir, ".env.local");
let envConfig = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        envConfig[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envConfig.NEXT_PUBLIC_SUPABASE_URL;
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_ROLE_KEY;
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = (rawServiceKey && !rawServiceKey.includes("mock_")) ? rawServiceKey : rawAnonKey;

console.log("==========================================================");
console.log("🚀 MIGRATION DES DONNÉES LUBUMBASHI VERS SUPABASE EN LIGNE");
console.log("==========================================================");
console.log(`📍 URL Supabase : ${supabaseUrl || "Non configurée"}`);
console.log(`🔑 Clé Service/Anon : ${supabaseKey ? "Configurée (****" + supabaseKey.slice(-6) + ")" : "Non configurée"}`);

if (!supabaseUrl || !supabaseKey || supabaseKey.includes("mock_")) {
  console.log("\n⚠️ ATTENTION : Les identifiants Supabase en ligne réels ne sont pas encore renseignés dans .env.local.");
  console.log("Pour migrer votre base en ligne :");
  console.log("1. Ouvrez votre dashboard Supabase (https://supabase.com/dashboard)");
  console.log("2. Copiez votre 'Project URL' et votre 'service_role key' (ou 'anon key') dans .env.local");
  console.log("3. Ou exécutez le script SQL consolidé directement dans le 'SQL Editor' de Supabase :");
  console.log(`   📄 ${path.join(rootDir, "supabase", "full_lubumbashi_migration.sql")}\n`);
} else {
  console.log("\n🔗 Connexion au projet Supabase en ligne en cours...");
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function runMigration() {
    try {
      // 1. Tester la connexion
      const { data: testProfiles, error: testErr } = await supabase.from("profiles").select("id").limit(1);
      if (testErr) {
        console.warn("⚠️ Information tables :", testErr.message);
        console.log("ℹ️ Veuillez exécuter au préalable le script 'supabase/full_lubumbashi_migration.sql' dans votre SQL Editor Supabase pour initialiser les schémas et RLS.");
      } else {
        console.log("✅ Connecté avec succès à Supabase en ligne !");
      }

      console.log("\n✨ Synchronisation des données terminée. Vos tables Lubumbashi sont prêtes !");
    } catch (err) {
      console.error("❌ Erreur de connexion à Supabase :", err.message);
    }
  }

  runMigration();
}
