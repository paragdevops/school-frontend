// =============================================================================
// school-frontend/build.js
// =============================================================================
// Build-time checks — NO .env required.
//
// In CI/CD (GitHub Actions, etc.), .env is NOT in the repo.
// Environment variables are injected at RUNTIME (by Docker, K8s, etc.).
// So this build script only checks CODE, not runtime config.
//
// What it checks:
//   ✅ All required source files exist (server.js, index.html, script.js, style.css)
//   ✅ index.html has the __BACKEND_URL__ placeholder
//   ✅ All npm dependencies are installed (node_modules)
//   ✅ package.json has the required scripts
//
// What it does NOT check (that's runtime):
//   ⏭️  .env file — not needed at build time
//   ⏭️  BACKEND_URL — injected at runtime
//   ⏭️  Backend reachable — not available in CI/CD
// =============================================================================

const fs = require("fs");
const path = require("path");

let hasErrors = false;

console.log("");
console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║     SCHOOL FRONTEND — BUILD CHECK                       ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("");

// ── Check 1: Required source files exist ──────────────────────────────────────
console.log("📌 Checking source files...");
const requiredFiles = [
  "server.js",
  "public/index.html",
  "public/script.js",
  "public/style.css",
  "package.json",
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.error(`   ❌ ${file} NOT found!`);
    hasErrors = true;
  }
}

// ── Check 2: index.html has __BACKEND_URL__ placeholder ──────────────────────
console.log("📌 Checking __BACKEND_URL__ placeholder...");
const htmlPath = path.join(__dirname, "public", "index.html");
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, "utf8");
  if (html.includes("__BACKEND_URL__")) {
    console.log("   ✅ __BACKEND_URL__ placeholder found in index.html");
  } else {
    console.error("   ❌ __BACKEND_URL__ placeholder NOT found in index.html!");
    hasErrors = true;
  }
}

// ── Check 3: node_modules exists (dependencies installed) ────────────────────
console.log("📌 Checking dependencies...");
const nodeModulesPath = path.join(__dirname, "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  console.log("   ✅ node_modules found (dependencies installed)");
} else {
  console.error("   ❌ node_modules NOT found! Run: npm install");
  hasErrors = true;
}

// ── Check 4: package.json has required scripts ────────────────────────────────
console.log("📌 Checking package.json scripts...");
const pkgPath = path.join(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const requiredScripts = ["start", "build"];

for (const script of requiredScripts) {
  if (pkg.scripts && pkg.scripts[script]) {
    console.log(`   ✅ "npm run ${script}" → ${pkg.scripts[script]}`);
  } else {
    console.error(`   ❌ "${script}" script NOT found in package.json!`);
    hasErrors = true;
  }
}

// ── Check 5: Required npm packages are in package.json ────────────────────────
console.log("📌 Checking package.json dependencies...");
const requiredDeps = ["express", "dotenv"];

for (const dep of requiredDeps) {
  if (pkg.dependencies && pkg.dependencies[dep]) {
    console.log(`   ✅ ${dep}: ${pkg.dependencies[dep]}`);
  } else {
    console.error(`   ❌ ${dep} NOT found in dependencies! Run: npm install ${dep}`);
    hasErrors = true;
  }
}

// ── Note about .env ──────────────────────────────────────────────────────────
console.log("📌 Checking .env...");
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log("   ✅ .env file found (will be used at runtime)");
} else {
  console.log("   ⏭️  .env file NOT found (OK for CI/CD — will be injected at runtime)");
  console.log("      For local dev, create it with: PORT=3000 and BACKEND_URL=http://localhost:4000");
}

// ── Result ────────────────────────────────────────────────────────────────────
console.log("");
if (hasErrors) {
  console.error("╔══════════════════════════════════════════════════════════╗");
  console.error("║     ❌ BUILD FAILED — fix the errors above              ║");
  console.error("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  process.exit(1);
} else {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     ✅ BUILD PASSED — code is ready!                    ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Next step: npm start");
  console.log("");
  process.exit(0);
}