import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error("Error: .env.local file not found.");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!serviceKey && !anonKey)) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey || anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const adminEmail = process.env.ADMIN_EMAIL || process.argv[2] || "amaniishimwe36@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || process.argv[3] || "";
const adminName = process.env.ADMIN_NAME || "Amani Ishimwe";

async function ensureAdminProfile(userId, email) {
  const { error } = await admin.from("admin_profiles").upsert(
    {
      id: userId,
      full_name: adminName,
      role: "admin",
      email,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Failed to upsert admin_profiles:", error.message);
    console.log("\nRun this SQL in Supabase SQL Editor:\n");
    console.log(`INSERT INTO admin_profiles (id, full_name, role, email)`);
    console.log(`VALUES ('${userId}', '${adminName}', 'admin', '${email}')`);
    console.log(`ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;`);
    process.exit(1);
  }

  console.log(`✓ admin_profiles row ready for ${email} (${userId}) with role=admin`);
}

async function main() {
  console.log(`Setting up admin: ${adminEmail}`);

  // Prefer finding existing user via admin API
  if (serviceKey) {
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
    if (listErr) {
      console.warn("listUsers failed:", listErr.message);
    } else {
      const existing = list.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());
      if (existing) {
        await ensureAdminProfile(existing.id, existing.email || adminEmail);
        console.log("\nDone. Log in at /admin/login with this email.");
        return;
      }
    }

    if (!adminPassword) {
      console.error("User not found. Pass a password to create them:");
      console.error('  npm run setup-admin -- "email@example.com" "YourPassword"');
      process.exit(1);
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (createErr) {
      console.error("createUser failed:", createErr.message);
      process.exit(1);
    }

    await ensureAdminProfile(created.user.id, adminEmail);
    console.log("\nDone. Log in at /admin/login with this email.");
    return;
  }

  // Fallback without service role: sign in / sign up then print SQL
  if (!adminPassword) {
    console.error("Set ADMIN_PASSWORD or pass password as argv when service role is missing.");
    process.exit(1);
  }

  const pub = createClient(supabaseUrl, anonKey);
  let userId = null;

  const { data: signedIn, error: signInErr } = await pub.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (!signInErr && signedIn.user) {
    userId = signedIn.user.id;
  } else {
    const { data: signedUp, error: signUpErr } = await pub.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    if (signUpErr) {
      console.error(signUpErr.message);
      process.exit(1);
    }
    userId = signedUp.user?.id;
  }

  if (!userId) {
    console.error("Could not resolve user id.");
    process.exit(1);
  }

  await ensureAdminProfile(userId, adminEmail);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
