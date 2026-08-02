import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootAssets = path.resolve(__dirname, "../assets");
const appsDir = path.resolve(__dirname, "../apps");

// Map each app to where its assets should be linked
const appTargets = {
  admin: "public",
  web: "public"
  // add non-Next apps here, e.g. mobile: "src"
};

if (!fs.existsSync(rootAssets)) {
  console.error("❌ Root assets folder does not exist:", rootAssets);
  process.exit(1);
}

let hadError = false;

for (const [app, subdir] of Object.entries(appTargets)) {
  const target = path.join(appsDir, app, subdir, "assets");

  try {
    // Remove existing symlink/folder if present
    if (
      fs.existsSync(target) ||
      fs.lstatSync(target, { throwIfNoEntry: false })
    ) {
      fs.rmSync(target, { recursive: true, force: true });
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });

    // On macOS/Linux, symlink type is ignored but "dir" is the correct semantic value.
    // Junctions (Windows-only) require an ABSOLUTE target, so branch if you ever need Windows support.
    const isWindows = process.platform === "win32";
    const linkTarget = isWindows
      ? rootAssets
      : path.relative(path.dirname(target), rootAssets);
    const symlinkType = isWindows ? "junction" : "dir";

    fs.symlinkSync(linkTarget, target, symlinkType);

    const stats = fs.lstatSync(target);
    console.log(
      `✅ Linked assets to ${target} (symlink: ${stats.isSymbolicLink() ? "yes" : "no"})`
    );
  } catch (err) {
    hadError = true;
    console.error(`❌ Failed to link for ${app}:`, err.message);
  }
}

if (hadError) process.exit(1);
