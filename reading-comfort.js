const readingStyles = document.createElement("style");
readingStyles.textContent = `
  #root>div{font-family:"Noto Sans TC",system-ui,sans-serif;font-size:16px;line-height:1.75}
  #root main{max-width:70rem}
  #root [class~="text-xs"]{font-size:14px!important;line-height:1.7}
  #root [class~="text-sm"]{font-size:16px!important;line-height:1.65}
  #root [class*="text-[11px]"]{font-size:13px!important;line-height:1.65}
  #root [class*="text-[10px]"]{font-size:12px!important;line-height:1.55}
  #root main p,#root main li{line-height:1.8}
  #root main p{max-width:76ch}
  #root main h2,#root main h3{line-height:1.4}
  #root main input,#root main select,#root main textarea{font-size:15px}
  #root main [class~="overflow-x-auto"]{overflow-x:visible!important;overflow-y:visible!important;flex-wrap:wrap!important;flex-shrink:1!important;min-width:0;max-width:100%}
  #root main button:focus-visible,#root main input:focus-visible,#root main select:focus-visible,#root main textarea:focus-visible,#root header button:focus-visible,#reading-more summary:focus-visible,#reading-more button:focus-visible{outline:3px solid #9b762f;outline-offset:2px}
  #root header{box-shadow:0 1px 4px #3025160a}
  #root header [data-reading-hidden="true"],#personal-ai-trigger[data-reading-hidden="true"]{display:none!important}
  #reading-more{position:relative;flex:none;font:500 13px/1.4 system-ui,"Noto Sans TC",sans-serif}
  #reading-more summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;border:1px solid #e3ded4;border-radius:12px;background:#fff;color:#514a40}
  #reading-more summary::-webkit-details-marker{display:none}
  #reading-more summary::after{content:"";width:7px;height:7px;margin:0 0 3px 9px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg)}
  #reading-more[open] summary::after{margin-bottom:-4px;transform:rotate(225deg)}
  #root .scenario-card{display:flex;min-width:0;flex-direction:column;align-self:start;gap:12px;padding:16px;border:1px solid #d9d2c7;border-radius:18px;background:#fffefa;color:#352f28;box-shadow:0 2px 8px #241d1708;font-size:15px;line-height:1.75}
  #root .scenario-card-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
  #root .scenario-card-term{min-width:0;color:#282f2a;font-size:17px;font-weight:700;line-height:1.5;overflow-wrap:anywhere}
  #root .scenario-card-badges{display:flex;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:5px}
  #root .scenario-card-category,#root .scenario-card-required{padding:4px 7px;border-radius:8px;font-size:12px;font-weight:700;line-height:1.35}
  #root .scenario-card-category{background:#edf1ed;color:#34483d}
  #root .scenario-card-required{background:#f7edce;color:#624d1d}
  #root .scenario-card-summary{display:-webkit-box;margin:8px 0 0;overflow:hidden;color:#3f4b43;font-size:15px;line-height:1.8;-webkit-box-orient:vertical;-webkit-line-clamp:3}
  #root .scenario-card-details{border-top:1px solid #e3ded4}
  #root .scenario-card-details>summary{display:flex;min-height:44px;align-items:center;justify-content:space-between;gap:10px;padding:7px 2px;color:#31533f;font-size:14px;font-weight:700;line-height:1.5;cursor:pointer;list-style:none}
  #root .scenario-card-details>summary::-webkit-details-marker{display:none}
  #root .scenario-card-details>summary::after{content:"";display:inline-flex;width:24px;height:24px;flex-shrink:0;border:1px solid #d7e0d8;border-radius:50%;background:linear-gradient(#31533f,#31533f) center/11px 2px no-repeat,linear-gradient(#31533f,#31533f) center/2px 11px no-repeat,#f2f6f2}
  #root .scenario-card-details[open]>summary::after{background:linear-gradient(#31533f,#31533f) center/11px 2px no-repeat,#f2f6f2}
  #root .scenario-card-details>summary:focus-visible{outline:3px solid #9b762f;outline-offset:2px;border-radius:6px}
  #root .scenario-card-detail-list{display:grid;gap:9px;padding:2px 0 4px}
  #root .scenario-card-detail{margin:0;padding:10px 12px;border-radius:12px;color:#3e4841;font-size:14px;line-height:1.8;overflow-wrap:anywhere}
  #root .scenario-card-detail strong{display:block;margin:0 0 3px;color:#31533f;font-size:13px;line-height:1.5}
  #root .scenario-card-definition{background:#f7f3e9}
  #root .scenario-card-example{background:#f1f4f2}
  #root .scenario-card-safe{background:#edf4ee}
  #root .scenario-card-warning{background:#fbf2e4}
  #root .scenario-list-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding:12px 14px;border:1px solid #e1dbd0;border-radius:14px;background:#fffefa}
  #root .scenario-list-count{color:#5a675f;font-size:13px;line-height:1.5}
  #root .scenario-list-controls button{min-height:44px;padding:9px 14px;border:1px solid #31533f;border-radius:11px;background:#31533f;color:#fff;font:700 14px/1.4 "Noto Sans TC",system-ui,sans-serif;cursor:pointer}
  #root .scenario-list-controls button:hover{background:#243f30}
  #root .scenario-list-controls button:focus-visible{outline:3px solid #9b762f;outline-offset:2px}
  #reading-more-menu{position:absolute;top:calc(100% + 10px);right:0;z-index:40;display:grid;gap:4px;width:max-content;min-width:190px;max-width:min(250px,calc(100vw - 24px));padding:7px;border:1px solid #e8e2d8;border-radius:14px;background:#fffefa;box-shadow:0 12px 32px #241d171c}
  #reading-more-menu button{width:100%;min-height:42px;padding:9px 11px;border:0;border-radius:9px;background:transparent;color:#352f28;text-align:left;font:500 14px/1.4 system-ui,"Noto Sans TC",sans-serif;cursor:pointer}
  #reading-more-menu button:hover{background:#f5f1e9}
  #reading-more-menu button.reading-about-card{display:flex;align-items:center;gap:10px;margin-top:3px;padding:10px;border:1px solid #d9e3da;background:#f3f7f3}
  #reading-more-menu button.reading-about-card:hover{border-color:#aebfae;background:#eaf1eb}
  #reading-more-menu .reading-about-mark{display:grid;width:36px;height:36px;flex:none;place-items:center;border:1px solid #d8cca8;border-radius:10px;background:#fffefa;color:#846429;font-family:Georgia,serif;font-size:19px}
  #reading-more-menu .reading-about-copy{display:grid;gap:2px}
  #reading-more-menu .reading-about-copy strong{font-size:13px}
  #reading-more-menu .reading-about-copy small{color:#756c60;font-size:11px}
  @media(max-width:640px){
    #root>div{font-size:16px}
    #root header>div:first-child{gap:6px;flex-wrap:wrap}
    #root header>div:first-child>div:last-child{margin-left:auto}
    #root header>div:first-child>div:last-child:has(#reading-more[open]){flex:1 1 100%;min-width:0;flex-wrap:wrap}
    #root header>div:first-child>div:last-child>div:has(#reading-more[open]){flex:1 1 100%;min-width:0;flex-wrap:wrap}
    #root header>div>div:first-child{gap:7px}
    #root header h1{font-size:14px}
    #root main{padding-top:12px;padding-bottom:20px}
    #reading-more[open]{position:static;flex:1 1 100%;min-width:0}
    #reading-more-menu{position:static;top:auto;right:auto;width:100%;min-width:0;max-width:none;box-sizing:border-box;box-shadow:0 4px 14px #241d170a}
    #root main [class~="grid-cols-3"][class~="max-h-[500px]"]{grid-template-columns:minmax(0,1fr)!important;max-height:none!important;overflow:visible!important;padding-right:0!important}
    #root .scenario-card{gap:10px;padding:14px;border-radius:16px}
    #root .scenario-card-term{font-size:16px}
    #root .scenario-card-summary{font-size:14px;line-height:1.8;-webkit-line-clamp:2}
    #root .scenario-card-details>summary{min-height:48px;font-size:14px}
    #root .scenario-card-detail{font-size:14px}
    #root .scenario-list-controls{align-items:flex-start;flex-direction:column;padding:12px}
    #root .scenario-list-controls button{width:100%;min-height:48px}
    #reading-more summary{min-height:36px;padding:0 10px}
  }
  @media(min-width:641px) and (max-width:900px){
    #root main div[class~="md:flex-row"]:has(h2){flex-direction:column!important;align-items:stretch!important}
    #root main div[class~="md:flex-row"]:has(h2)>*{width:100%;min-width:0}
    #root main [class~="grid-cols-3"][class~="max-h-[500px]"]{grid-template-columns:minmax(0,1fr)!important;max-height:none!important;overflow:visible!important;padding-right:0!important}
  }
  @media(prefers-reduced-motion:reduce){#root *,#reading-more-menu *{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;
document.head.append(readingStyles);

const originalControls = [
  {
    selector: 'button[title^="切換文字大小"]',
    label: "文字大小",
  },
  {
    selector: 'button[title="查看歷史紀錄"]',
    label: "歷史紀錄",
  },
  {
    selector: 'button[title^="開啟另存 PDF"]',
    label: "匯出與存檔",
  },
  {
    selector: "#personal-ai-trigger",
    label: "連接自己的 AI",
  },
];

function addMoreMenu() {
  const header = document.querySelector("#root header");
  if (!header) return;
  const googleButton = header.querySelector("#google-drive-connect") ||
    [...header.querySelectorAll("button")].find((button) =>
      button.innerText.includes("Google 同步") ||
      button.title.includes("了解同步目的") ||
      button.innerText.trim() === "登入" ||
      button.title.includes("登出 Google"),
    );
  if (!googleButton) return;

  let details = document.querySelector("#reading-more");
  if (!details) {
    details = document.createElement("details");
    details.id = "reading-more";
    details.innerHTML =
      '<summary aria-label="開啟更多功能">更多</summary><div id="reading-more-menu"></div>';
    googleButton.before(details);
  }

  const menu = details.querySelector("#reading-more-menu");
  let available = 0;
  for (const [index, item] of originalControls.entries()) {
    const original = header.querySelector(item.selector) ||
      document.querySelector(item.selector);
    if (!original) continue;
    original.dataset.readingHidden = "true";
    const controlId = `reading-action-${index}`;
    let action = menu.querySelector(`#${controlId}`);
    if (!action) {
      action = document.createElement("button");
      action.id = controlId;
      action.type = "button";
      action.textContent = item.label;
      action.addEventListener("click", () => {
        const target = header.querySelector(item.selector) ||
          document.querySelector(item.selector);
        details.open = false;
        target?.click();
      });
      menu.append(action);
    }
    available += 1;
  }

  let aboutCard=menu.querySelector("#reading-about-karen");
  if(!aboutCard){
    aboutCard=document.createElement("button");
    aboutCard.id="reading-about-karen";
    aboutCard.type="button";
    aboutCard.className="reading-about-card";
    aboutCard.innerHTML='<span class="reading-about-mark" aria-hidden="true">K</span><span class="reading-about-copy"><strong>認識凱倫</strong><small>經歷、專長與生活</small></span>';
    aboutCard.addEventListener("click",()=>{
      details.open=false;
      window.dispatchEvent(new CustomEvent("yuan:toggle-about"));
    });
    menu.append(aboutCard);
  }
  available += 1;

  details.hidden = available === 0;
  if (details.parentElement !== googleButton.parentElement ||
      details.nextElementSibling !== googleButton) {
    googleButton.before(details);
  }
}

function updateScenarioLists() {
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  const grids = new Set(
    [...document.querySelectorAll("#root .scenario-card")]
      .map((card) => card.parentElement)
      .filter(Boolean),
  );

  for (const [index, grid] of [...grids].entries()) {
    const cards = [...grid.children].filter((child) =>
      child.classList.contains("scenario-card")
    );
    if (cards.length === 0) continue;

    let controls = grid.nextElementSibling;
    if (!controls?.classList.contains("scenario-list-controls")) {
      controls = document.createElement("div");
      controls.className = "scenario-list-controls";
      const count = document.createElement("span");
      count.className = "scenario-list-count";
      count.setAttribute("role", "status");
      count.setAttribute("aria-live", "polite");
      const button = document.createElement("button");
      button.type = "button";
      button.addEventListener("click", () => {
        const current = Number(grid.dataset.scenarioVisibleCount) || 0;
        const pageSize = Number(grid.dataset.scenarioPageSize) || 8;
        const total = [...grid.children].filter((child) =>
          child.classList.contains("scenario-card")
        ).length;
        grid.dataset.scenarioVisibleCount = String(
          current >= total ? pageSize : Math.min(total, current + pageSize),
        );
        updateScenarioLists();
      });
      controls.append(count, button);
      grid.after(controls);
    }

    if (!grid.id) grid.id = `scenario-results-${index + 1}`;
    const signature = cards.map((card) =>
      card.querySelector(".scenario-card-term")?.textContent || ""
    ).join("|");
    const pageSize = mobile ? 8 : 12;
    if (grid.dataset.scenarioSignature !== signature) {
      grid.dataset.scenarioSignature = signature;
      grid.dataset.scenarioVisibleCount = String(pageSize);
    }
    if (grid.dataset.scenarioPageSize !== String(pageSize)) {
      if (grid.dataset.scenarioPageSize) {
        grid.dataset.scenarioVisibleCount = String(pageSize);
      }
      grid.dataset.scenarioPageSize = String(pageSize);
    }
    const visibleCount = Math.min(
      cards.length,
      Number(grid.dataset.scenarioVisibleCount) || pageSize,
    );
    cards.forEach((card, cardIndex) => {
      card.hidden = cardIndex >= visibleCount;
    });
    controls.hidden = cards.length <= pageSize;
    const count = `目前顯示 ${visibleCount} / ${cards.length} 筆`;
    const countElement = controls.querySelector(".scenario-list-count");
    if (countElement.textContent !== count) countElement.textContent = count;
    const button = controls.querySelector("button");
    const buttonText = visibleCount >= cards.length
      ? `收合清單，只看前 ${pageSize} 筆`
      : `再顯示 ${Math.min(pageSize, cards.length - visibleCount)} 筆`;
    if (button.textContent !== buttonText) button.textContent = buttonText;
    button.setAttribute("aria-controls", grid.id);
  }
}

const observer = new MutationObserver(() => {
  addMoreMenu();
  updateScenarioLists();
});

observer.observe(document.body, { childList: true, subtree: true });
addMoreMenu();
updateScenarioLists();
document.fonts.ready.then(addMoreMenu);
window.addEventListener("resize", addMoreMenu);
window.addEventListener("scroll", addMoreMenu, { passive: true });
window.addEventListener("resize", updateScenarioLists);

document.addEventListener("click", (event) => {
  const menu = document.querySelector("#reading-more");
  if (menu?.open && !menu.contains(event.target)) menu.open = false;
});
