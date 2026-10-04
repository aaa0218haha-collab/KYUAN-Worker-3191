import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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

function replaceOnce(source, original, replacement, description) {
  const first = source.indexOf(original);
  if (first < 0 || source.indexOf(original, first + original.length) >= 0) {
    throw new Error(`Could not uniquely find ${description}; bundle unchanged.`);
  }
  return (
    source.slice(0, first) +
    replacement +
    source.slice(first + original.length)
  );
}

const storageHelper = "async function $C(e,t)";
const helperCode =
  'function syncChecklistProgressToCloud(uid,roleId,progress){let path="users/"+uid+"/checklists/"+roleId;return LC(p_(GC,"users",uid,"checklists",roleId),{userId:uid,roleId,progress,updatedAt:new Date().toISOString()},{merge:true}).catch(error=>{console.error("職務檢核進度雲端同步失敗：",error);window.dispatchEvent(new CustomEvent("yuan-progress-sync-error",{detail:{path}}))})}function subscribeChecklistProgress(uid,roleId,onProgress){let path="users/"+uid+"/checklists/"+roleId;return RC(p_(GC,"users",uid,"checklists",roleId),snapshot=>onProgress(snapshot.exists()?snapshot.data().progress:null),error=>{console.error("職務檢核進度雲端讀取失敗："+path,error);window.dispatchEvent(new CustomEvent("yuan-progress-sync-error",{detail:{path}}))})}';
const localChecklist = '(0,S.useEffect)(()=>{try{let t=localStorage.getItem(`checklist_${e.id}`);o(t?JSON.parse(t):{})}catch{o({})}},[e.id]),(0,S.useEffect)(()=>{m(0)},[s,e.id]);let h=t=>{o(n=>{let r={...n,[t]:!n[t]};return localStorage.setItem(`checklist_${e.id}`,JSON.stringify(r)),r})}';
const cloudChecklist =
  '(0,S.useEffect)(()=>{try{let t=localStorage.getItem("checklist_"+e.id);o(t?JSON.parse(t):{})}catch(error){console.error("載入職務檢核進度失敗：",error);o({})}},[e.id]),(0,S.useEffect)(()=>{let stopProgress=()=>{},stopAuth=KC.onAuthStateChanged(user=>{stopProgress();if(!user)return;stopProgress=subscribeChecklistProgress(user.uid,e.id,progress=>{if(progress&&typeof progress==="object"){o(progress);localStorage.setItem("checklist_"+e.id,JSON.stringify(progress));return}let saved=localStorage.getItem("checklist_"+e.id);if(saved){let localProgress=JSON.parse(saved);if(Object.keys(localProgress).length)void syncChecklistProgressToCloud(user.uid,e.id,localProgress)}})});return()=>{stopAuth();stopProgress()}},[e.id]),(0,S.useEffect)(()=>{m(0)},[s,e.id]);let h=t=>{o(n=>{let r={...n,[t]:!n[t]};localStorage.setItem("checklist_"+e.id,JSON.stringify(r));let user=KC.currentUser;if(user)void syncChecklistProgressToCloud(user.uid,e.id,r);return r})}';
if (!bundle.includes("function syncChecklistProgressToCloud")) {
  bundle = replaceOnce(
    bundle,
    storageHelper,
    helperCode + storageHelper,
    "Firestore task storage helper",
  );
  bundle = replaceOnce(
    bundle,
    localChecklist,
    cloudChecklist,
    "local-only checklist progress handler",
  );
}

const genericAuthError =
  'e?.message?.includes(`popup-closed-by-user`)?`登入視窗已關閉。`:`Google 登入時遇到問題，請確認已允許彈出式視窗並再試一次。`';
const specificAuthError =
  'e?.code===`auth/unauthorized-domain`||e?.message?.includes(`auth/unauthorized-domain`)?`此網站網域尚未加入 Firebase 授權清單，請管理員將 aaa0218haha-collab.github.io 加入 Firebase Authentication 的「授權網域」。`:e?.message?.includes(`popup-closed-by-user`)?`登入視窗已關閉。`:`Google 登入時遇到問題，請確認已允許彈出式視窗並再試一次。`';
if (!bundle.includes("此網站網域尚未加入 Firebase 授權清單")) {
  bundle = replaceOnce(
    bundle,
    genericAuthError,
    specificAuthError,
    "generic Google login error message",
  );
}

writeFileSync(bundlePath, bundle);
console.log(`Verified Google login guidance and checklist sync in ${bundles[0]}.`);
