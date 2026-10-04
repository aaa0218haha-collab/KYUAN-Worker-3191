import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const workspaceDir = process.cwd();
const assetsDir = existsSync(join(workspaceDir, "assets"))
  ? join(workspaceDir, "assets")
  : workspaceDir;
const bundles = readdirSync(assetsDir).filter((name) =>
  /^index-.*\.js$/.test(name),
);
if (bundles.length !== 1) {
  throw new Error(`Expected one built app bundle, found ${bundles.length}.`);
}

const bundlePath = join(assetsDir, bundles[0]);
let bundle = readFileSync(bundlePath, "utf8");

const disabledCloudMarkers = [
  "function syncChecklistProgressToCloud",
  "function subscribeChecklistProgress",
  "stopAuth=KC.onAuthStateChanged(user=>{stopProgress();",
];
const remainingMarker = disabledCloudMarkers.find((marker) =>
  bundle.includes(marker)
);
if (remainingMarker) {
  throw new Error(
    `Found a cloud checklist sync hook (${remainingMarker}); expected local-only progress.`,
  );
}
if (
  !bundle.includes('localStorage.getItem("checklist_"+e.id)') ||
  !bundle.includes('localStorage.setItem("checklist_"+e.id,JSON.stringify(r))')
) {
  throw new Error("Could not verify local checklist storage in the app bundle.");
}

console.log(`Verified local-only checklist progress in ${bundles[0]}.`);
