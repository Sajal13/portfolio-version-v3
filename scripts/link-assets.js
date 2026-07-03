const fs = require("fs");
const path = require("path");

const rootAssets = path.resolve(__dirname, "../assets");
const appsDir = path.resolve(__dirname, "../apps");

const apps = [
  "next-ts",
  "next-js",
  "next-ts-starter",
  "next-js-starter",
  "vite-ts",
  "vite-js",
  "vite-ts-starter",
  "vite-js-starter",
];

const nextApps = new Set([
  "next-ts",
  "next-js",
  "next-ts-starter",
  "next-js-starter",
]);

if (!fs.existsSync(rootAssets)) {
  console.error("❌ Root assets folder does not exist:", rootAssets);
  process.exit(1);
}

apps.forEach((app) => {
  const target = path.join(
    appsDir,
    app,
    nextApps.has(app) ? "public" : "src",
    "assets"
  );

  try {
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });

    const relativePath = path.relative(path.dirname(target), rootAssets);

    fs.symlinkSync(relativePath, target, "junction");

    if (app === "next-ts" || app === "next-js") {
      try {
        const stats = fs.lstatSync(target);
        console.log("Symlink created?:", stats.isSymbolicLink() ? "Yes" : "No");
      } catch (err) {
        console.log("Symlink verification failed:", err.message);
      }
    }

    console.log(`✅ Linked assets to ${target}`);
  } catch (err) {
    console.error(`❌ Failed to link for ${app}:`, err);
  }
});