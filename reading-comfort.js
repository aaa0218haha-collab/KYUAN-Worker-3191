const readingStyles = document.createElement("style");
readingStyles.textContent = `
  #root>div{font-size:15px;line-height:1.65}
  #root main{max-width:70rem}
  #root [class~="text-xs"]{font-size:13px!important;line-height:1.55}
  #root [class~="text-sm"]{font-size:15px!important;line-height:1.6}
  #root [class*="text-[11px]"]{font-size:12px!important;line-height:1.55}
  #root [class*="text-[10px]"]{font-size:11px!important;line-height:1.45}
  #root main p,#root main li{line-height:1.75}
  #root main p{max-width:76ch}
  #root main h2,#root main h3{line-height:1.4}
  #root main input,#root main select,#root main textarea{font-size:15px}
  #root main button:focus-visible,#root main input:focus-visible,#root main select:focus-visible,#root main textarea:focus-visible,#root header button:focus-visible,#reading-more summary:focus-visible,#reading-more button:focus-visible{outline:3px solid #9b762f;outline-offset:2px}
  #root header{box-shadow:0 1px 4px #3025160a}
  #root header [data-reading-hidden="true"],#personal-ai-trigger[data-reading-hidden="true"]{display:none!important}
  #reading-more{position:fixed;z-index:2147483000;flex:none;font:500 13px/1.4 system-ui,"Noto Sans TC",sans-serif}
  #reading-more summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;border:1px solid #e3ded4;border-radius:12px;background:#fff;color:#514a40}
  #reading-more summary::-webkit-details-marker{display:none}
  #reading-more summary::after{content:"";width:7px;height:7px;margin:0 0 3px 9px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg)}
  #reading-more[open] summary::after{margin-bottom:-4px;transform:rotate(225deg)}
  #reading-more-menu{position:absolute;top:calc(100% + 10px);right:0;z-index:2147483000;display:grid;gap:4px;width:max-content;min-width:190px;max-width:min(250px,calc(100vw - 24px));padding:7px;border:1px solid #e8e2d8;border-radius:14px;background:#fffefa;box-shadow:0 12px 32px #241d171c}
  #reading-more-menu button{width:100%;min-height:42px;padding:9px 11px;border:0;border-radius:9px;background:transparent;color:#352f28;text-align:left;font:500 14px/1.4 system-ui,"Noto Sans TC",sans-serif;cursor:pointer}
  #reading-more-menu button:hover{background:#f5f1e9}
  @media(max-width:640px){
    #root>div{font-size:15px}
    #root header>div{gap:6px}
    #root header>div>div:first-child{gap:7px}
    #root header h1{font-size:14px}
    #root main{padding-top:12px;padding-bottom:20px}
    #reading-more summary{min-height:36px;padding:0 10px}
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
    document.body.append(details);
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

  details.hidden = available === 0;
  const buttonRect = googleButton.getBoundingClientRect();
  const summaryHeight = window.matchMedia("(max-width:640px)").matches
    ? 36
    : 38;
  details.style.top = `${Math.max(4, buttonRect.top + (buttonRect.height - summaryHeight) / 2)}px`;
  details.style.right = `${Math.max(8, document.documentElement.clientWidth - buttonRect.left + 8)}px`;
}

const observer = new MutationObserver(addMoreMenu);

observer.observe(document.body, { childList: true, subtree: true });
addMoreMenu();
document.fonts.ready.then(addMoreMenu);
window.addEventListener("resize", addMoreMenu);
window.addEventListener("scroll", addMoreMenu, { passive: true });

document.addEventListener("click", (event) => {
  const menu = document.querySelector("#reading-more");
  if (menu?.open && !menu.contains(event.target)) menu.open = false;
});
