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

function replaceFunction(source, startMarker, nextMarker, replacement) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(nextMarker, start + startMarker.length);
  if (start < 0 || end < 0 || source.indexOf(startMarker, start + 1) >= 0) {
    throw new Error(`Could not uniquely find ${startMarker}; bundle unchanged.`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

function replaceOrVerify(source, original, replacement, description) {
  if (source.includes(original)) {
    return replaceOnce(source, original, replacement, description);
  }
  if (source.includes(replacement)) return source;
  throw new Error(`Could not verify ${description}; bundle unchanged.`);
}

function replaceFunctionOrVerify(
  source,
  startMarker,
  nextMarker,
  replacement,
) {
  if (source.includes(startMarker)) {
    return replaceFunction(source, startMarker, nextMarker, replacement);
  }
  if (source.includes(replacement)) return source;
  throw new Error(`Could not verify ${startMarker}; bundle unchanged.`);
}

function replaceRegionOrVerify(
  source,
  startMarker,
  endMarker,
  replacement,
  verificationMarker,
  description,
) {
  if (source.includes(verificationMarker)) return source;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (
    start < 0 ||
    end < 0 ||
    source.indexOf(startMarker, start + startMarker.length) >= 0
  ) {
    throw new Error(`Could not uniquely find ${description}; bundle unchanged.`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

const localChecklist =
  '(0,S.useEffect)(()=>{let loadProgress=user=>{let key=user?"checklist_"+user.uid+"_"+e.id:"checklist_"+e.id;try{let saved=localStorage.getItem(key);if(!saved&&user){saved=localStorage.getItem("checklist_"+e.id);if(saved)localStorage.setItem(key,saved)}o(saved?JSON.parse(saved):{})}catch(error){console.error("載入職務檢核進度失敗：",error);o({})}};loadProgress(window.YUAN_GOOGLE_ACCOUNT||null);let handleAccount=e=>loadProgress(e.detail?.user||null);window.addEventListener("yuan-google-account-change",handleAccount);return()=>window.removeEventListener("yuan-google-account-change",handleAccount)},[e.id]),(0,S.useEffect)(()=>{m(0)},[s,e.id]);let h=t=>{o(n=>{let r={...n,[t]:!n[t]};let user=window.YUAN_GOOGLE_ACCOUNT;localStorage.setItem(user?"checklist_"+user.uid+"_"+e.id:"checklist_"+e.id,JSON.stringify(r));return r})}';
const localOnlyChecklist =
  '(0,S.useEffect)(()=>{try{let t=localStorage.getItem("checklist_"+e.id);o(t?JSON.parse(t):{})}catch(error){console.error("載入職務檢核進度失敗：",error);o({})}},[e.id]),(0,S.useEffect)(()=>{m(0)},[s,e.id]);let h=t=>{o(n=>{let r={...n,[t]:!n[t]};return localStorage.setItem("checklist_"+e.id,JSON.stringify(r)),r})}';

if (bundle.includes(localOnlyChecklist)) {
  bundle = replaceOnce(
    bundle,
    localOnlyChecklist,
    localChecklist,
    "guest-only checklist progress handler",
  );
} else if (!bundle.includes("loadProgress=user=>{let key=user?")) {
  throw new Error("Could not verify the checklist account partition.");
}

const firebaseAccountEffects =
  '(0,S.useEffect)(()=>{let e=KC.onAuthStateChanged(async e=>{ce(e),e&&(_e(`已登入：${e.displayName||e.email}，已啟用跨裝置即時同步`),setTimeout(()=>_e(null),5e3))});return()=>e()},[]),(0,S.useEffect)(()=>{if(!se)return;ue(!0);let e=QC(se.uid,e=>{if(ue(!1),e&&e.length>0)Ce(e),!E&&e[0]&&be(e[0]);else{let e=localStorage.getItem(tw);if(e)try{let t=JSON.parse(e);Array.isArray(t)&&t.length>0&&t.forEach(e=>{$C(se.uid,e)})}catch{}}},e=>{ue(!1),console.warn(`雲端同步錯誤:`,e)});return()=>e()},[se]),';
const googleAccountEffect =
  '(0,S.useEffect)(()=>{let handleAccount=e=>ce(e.detail?.user||null);window.addEventListener("yuan-google-account-change",handleAccount);handleAccount({detail:{user:window.YUAN_GOOGLE_ACCOUNT||null}});return()=>window.removeEventListener("yuan-google-account-change",handleAccount)},[]),';
if (bundle.includes(firebaseAccountEffects)) {
  bundle = replaceOnce(
    bundle,
    firebaseAccountEffects,
    googleAccountEffect,
    "Firebase sign-in and task sync effects",
  );
} else if (bundle.includes("QC(se.uid")) {
  throw new Error("Found an unknown Firebase task sync effect; bundle unchanged.");
}

const automaticTaskWrite = ",se&&$C(se.uid,E)";
if (bundle.includes(automaticTaskWrite)) {
  bundle = replaceOnce(
    bundle,
    automaticTaskWrite,
    "",
    "automatic Firestore task write",
  );
} else if (bundle.includes("se&&$C(se.uid,E)")) {
  throw new Error("Found an unexpected task sync expression; bundle unchanged.");
}
bundle = replaceOrVerify(
  bundle,
  "if(be(t=>t?.id===E.id?{...t,memo:e}:t),se)try{await ew(se.uid,E.id,e)}catch(e){console.error(`Firebase 備忘錄雲端儲存錯誤:`,e)}",
  "be(t=>t?.id===E.id?{...t,memo:e}:t)",
  "automatic Firestore memo write",
);

bundle = replaceFunctionOrVerify(
  bundle,
  "async function XC(){",
  "async function ZC(){",
  "async function XC(){return null}",
);
bundle = replaceFunctionOrVerify(
  bundle,
  "function QC(e,t,n){",
  "async function $C(e,t){",
  "function QC(){return()=>{}}",
);
bundle = replaceFunctionOrVerify(
  bundle,
  "async function $C(e,t){",
  "async function ew(e,t,n){",
  "async function $C(){}",
);
bundle = replaceFunctionOrVerify(
  bundle,
  "async function ew(e,t,n){",
  "var tw=",
  "async function ew(){}",
);

const taskSyncTail = "localStorage.setItem(tw,JSON.stringify(n)),n}),}";
if (bundle.includes(taskSyncTail)) {
  bundle = replaceOnce(
    bundle,
    taskSyncTail,
    "localStorage.setItem(tw,JSON.stringify(n)),n})}",
    "trailing comma after removing automatic task sync",
  );
}

const scenarioCardReplacement = String.raw`children:Ie.map(e=>(0,k.jsxs)("article",{className:"scenario-card",children:[
  (0,k.jsxs)("div",{className:"scenario-card-header",children:[
    (0,k.jsxs)("div",{className:"scenario-card-heading",children:[
      (0,k.jsx)("span",{className:"scenario-card-term",children:e.term}),
      (0,k.jsxs)("div",{className:"scenario-card-badges",children:[
        (0,k.jsx)("span",{className:"scenario-card-category",children:e.categoryLabel}),
        e.relatedDomainIds&&e.relatedDomainIds.includes(l.domainId)&&(0,k.jsx)("span",{className:"scenario-card-required",children:"必懂"})
      ]})
    ]}),
    (0,k.jsxs)("p",{className:"scenario-card-summary","aria-hidden":!0,children:["白話：",e.plainMeaning]})
  ]}),
  (0,k.jsxs)("details",{className:"scenario-card-details scenario-card-details-v2",children:[
    (0,k.jsx)("summary",{children:"看工作例子與安全回覆"}),
    (0,k.jsxs)("div",{className:"scenario-card-detail-list",children:[
      (0,k.jsxs)("p",{className:"scenario-card-detail scenario-card-definition",children:[(0,k.jsx)("strong",{children:"完整說明"}),e.plainMeaning]}),
      (0,k.jsxs)("p",{className:"scenario-card-detail scenario-card-example",children:[(0,k.jsx)("strong",{children:"工作情境"}),e.workplaceContext]}),
      (0,k.jsxs)("p",{className:"scenario-card-detail scenario-card-safe",children:[(0,k.jsx)("strong",{children:"安全回覆"}),e.newcomerSafeResponse]}),
      e.pitfallWarning&&(0,k.jsxs)("p",{className:"scenario-card-detail scenario-card-warning",children:[(0,k.jsx)("strong",{children:"注意事項"}),e.pitfallWarning]})
    ]})
  ]})
]},e.id))})]})`;
bundle = replaceRegionOrVerify(
  bundle,
  "children:Ie.map(e=>",
  ",a===" + String.fromCharCode(96) + "resources" + String.fromCharCode(96),
  scenarioCardReplacement,
  'className:"scenario-card-details scenario-card-details-v2"',
  "work glossary card renderer",
);

if (
  !bundle.includes('localStorage.getItem(key);if(!saved&&user)') ||
  !bundle.includes('localStorage.setItem(user?"checklist_"+user.uid+"_"+e.id:"checklist_"+e.id,JSON.stringify(r))')
) {
  throw new Error("Could not verify account-scoped local checklist storage.");
}
for (const marker of [
  "RC(kC(f_(GC,`users`,e,`tasks`))",
  "LC(p_(GC,`users`,e,`tasks`,t.id)",
  "LC(p_(GC,`users`,e,`tasks`,t)",
  "syncChecklistProgressToCloud",
  "se&&$C(se.uid,E)",
  "ew(se.uid,E.id,e)",
]) {
  if (bundle.includes(marker)) {
    throw new Error(`Cloud sync remains active in the app bundle: ${marker}`);
  }
}

writeFileSync(bundlePath, bundle);
console.log(`Verified account-scoped local progress and no automatic Firestore task sync in ${bundles[0]}.`);
