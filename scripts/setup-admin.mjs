import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Resolve directories to load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error("Error: .env.local file not found. Please create it first before running this script.");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase environment variables are missing in .env.local.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const adminEmail = "amaniishimwe36@gmail.com";
const adminPassword = "Tequiero@2024";

async function registerAdmin() {
  console.log(`Attempting to sign up auth user: ${adminEmail}...`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        console.log(`\nUser is already registered in Supabase Auth.`);
        // Try to sign in to fetch user id
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (signInError) {
          console.error("Sign-in verification failed. If password differs, change it in your Supabase Auth dashboard.");
          process.exit(1);
        }

        const userId = signInData.user.id;
        printSqlInstructions(userId);
        return;
      }
      throw error;
    }

    if (data.user) {
      console.log(`\nSuccess: User successfully created in Supabase Auth!`);
      printSqlInstructions(data.user.id);
    }
  } catch (err) {
    console.error("Sign up failed:", err.message);
    console.log("\nAlternative option: Create the user directly in your Supabase Dashboard under Authentication -> Users, get their User ID, and run the SQL below.");
  }
}

function printSqlInstructions(userId) {
  console.log("\n==================================================");
  console.log("SQL TO RUN IN YOUR SUPABASE SQL EDITOR");
  console.log("==================================================");
  console.log(`Run this query in Supabase to make this user an Admin:\n`);
  console.log(`INSERT INTO admin_profiles (id, full_name, role)`);
  console.log(`VALUES ('${userId}', 'Amani Ishimwe', 'admin')`);
  console.log(`ON CONFLICT (id) DO UPDATE SET role = 'admin';\n`);
  console.log("==================================================");
}

registerAdmin();
