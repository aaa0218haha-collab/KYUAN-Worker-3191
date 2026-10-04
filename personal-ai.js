const providers = {
  gemini: {
    label: "Gemini",
    keyUrl: "https://aistudio.google.com/app/apikey",
    guideUrl: "https://ai.google.dev/gemini-api/docs/api-key",
    guideLabel: "Google AI Studio 申請 API Key",
    model: "gemini-2.5-flash",
    steps: [
      "登入 Google AI Studio，開啟「API keys」。",
      "按「Create API key」建立金鑰；若看不到專案，先匯入或建立 Google Cloud 專案。",
      "複製金鑰貼到下方。Gemini 用量與可用額度依 Google 帳戶及方案為準。",
    ],
  },
  openai: {
    label: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
    guideUrl:
      "https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key",
    guideLabel: "OpenAI Platform 申請 API Key",
    model: "gpt-4.1-mini",
    steps: [
      "登入 OpenAI Platform，開啟 API keys 並建立新的 secret key。",
      "建立時複製金鑰；離開頁面後通常無法再次查看完整金鑰。",
      "API 使用額度／付費設定與 ChatGPT 訂閱分開；確認 Platform 的 billing 設定。",
    ],
  },
};

const styles = document.createElement("style");
styles.textContent = `
  #personal-ai-trigger{position:fixed;right:20px;bottom:20px;z-index:2147483647;border:0;border-radius:999px;background:#2e3d37;color:#fff;padding:12px 18px;font:600 14px system-ui,sans-serif;box-shadow:0 8px 24px #0003;cursor:pointer}
  #personal-ai-trigger:hover{background:#1e2b26}
  #personal-ai-dialog{width:min(560px,calc(100vw - 24px));max-width:none;max-height:min(85vh,760px);padding:0;border:1px solid #e7e1d8;border-radius:20px;color:#241d17;background:#fffdf9;box-shadow:0 24px 80px #0004;font:14px/1.55 system-ui,"Noto Sans TC",sans-serif}
  #personal-ai-dialog::backdrop{background:#171a18a8;backdrop-filter:blur(2px)}
  .pai-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #eee8df}
  .pai-head h2{margin:0;font-size:18px}.pai-close{border:0;background:transparent;font-size:22px;cursor:pointer;color:#514b44}
  .pai-body{padding:18px 20px;display:grid;gap:14px}
  .pai-guide{padding:13px 14px;background:#f5f2eb;border-radius:12px}
  .pai-guide ol{margin:8px 0 0;padding-left:22px}.pai-guide li+li{margin-top:5px}
  .pai-guide a,.pai-links a{color:#315e50;text-decoration:underline;text-underline-offset:2px;font-weight:600}
  .pai-row{display:grid;gap:6px}.pai-row label{font-weight:600}
  .pai-row select,.pai-row input,.pai-chat-form textarea{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d9d2c9;border-radius:10px;background:#fff;color:#241d17;font:inherit}
  .pai-note{margin:0;color:#625c55;font-size:12px}
  .pai-warning{padding:10px 12px;border-left:3px solid #bd8b37;background:#fff8e9;color:#59451f;font-size:12px}
  .pai-check{display:flex;gap:8px;align-items:flex-start;font-size:12px}
  .pai-check input{margin-top:4px}
  .pai-chat{display:grid;gap:8px;max-height:230px;overflow:auto;padding:2px}
  .pai-msg{white-space:pre-wrap;overflow-wrap:anywhere;padding:10px 12px;border-radius:12px;max-width:92%}
  .pai-msg.user{justify-self:end;background:#e9f0ec}.pai-msg.assistant{justify-self:start;background:#f3f0eb}.pai-msg.error{background:#fff0ed;color:#8b3023}
  .pai-chat-form{display:grid;gap:8px}.pai-chat-form textarea{min-height:76px;resize:vertical}
  .pai-actions{display:flex;justify-content:flex-end;gap:8px}
  .pai-actions button:not(.pai-primary){border:1px solid #d9d2c9;border-radius:10px;background:#fff;color:#514b44;padding:9px 12px;font:500 13px system-ui,sans-serif;cursor:pointer}
  .pai-primary{border:0;border-radius:10px;background:#2e3d37;color:#fff;padding:10px 15px;font:600 14px system-ui,sans-serif;cursor:pointer}
  .pai-primary:disabled{opacity:.55;cursor:wait}
  #personal-ai-status{min-height:1.3em;color:#625c55;font-size:12px}
  @media(max-width:520px){#personal-ai-trigger{right:12px;bottom:12px}.pai-body{padding:14px}.pai-head{padding:14px}}
`;
document.head.append(styles);

const trigger = document.createElement("button");
trigger.id = "personal-ai-trigger";
trigger.type = "button";
trigger.textContent = "連接我的 AI";
trigger.setAttribute("aria-haspopup", "dialog");
trigger.setAttribute("aria-controls", "personal-ai-dialog");

const dialog = document.createElement("dialog");
dialog.id = "personal-ai-dialog";
dialog.setAttribute("aria-labelledby", "personal-ai-title");
dialog.innerHTML = `
  <div class="pai-head">
    <h2 id="personal-ai-title">連接自己的 AI 助理</h2>
    <button class="pai-close" type="button" aria-label="關閉">&times;</button>
  </div>
  <div class="pai-body">
    <section class="pai-guide" aria-label="API Key 使用步驟">
      <strong id="pai-guide-heading">申請步驟</strong>
      <ol id="pai-guide-steps"></ol>
      <p class="pai-note">複製金鑰貼到下方後按「在本機使用」，再輸入問題送出。金鑰直接傳給所選 AI 服務，不會上傳到本 App 的 Firebase。</p>
    </section>
    <div class="pai-row">
      <label for="pai-provider">AI 服務</label>
      <select id="pai-provider">
        <option value="gemini">Google Gemini</option>
        <option value="openai">OpenAI</option>
      </select>
      <div class="pai-links"><a id="pai-key-link" target="_blank" rel="noopener noreferrer"></a> · <a id="pai-guide-link" target="_blank" rel="noopener noreferrer">API Key 說明</a></div>
    </div>
    <div class="pai-row">
      <label for="pai-key">您的 API Key</label>
      <input id="pai-key" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false" placeholder="貼上您自己的 API Key">
      <div class="pai-actions"><button id="pai-clear-key" type="button">清除金鑰</button><button id="pai-save-key" class="pai-primary" type="button">在本機使用</button></div>
      <label class="pai-check"><input id="pai-remember" type="checkbox"><span>在這台裝置記住金鑰（儲存在此瀏覽器；公用裝置請勿勾選）</span></label>
    </div>
    <p class="pai-warning">API Key 等同帳號憑證。本功能在瀏覽器直接連線，金鑰不會上傳到本 App 的 Firebase；但若勾選「記住」，會以瀏覽器儲存，並非伺服器代管的保管方式。不要在公用裝置使用或輸入個資、雇主機密。提問會送交所選 AI 服務，可能產生費用並依供應商政策處理。</p>
    <div id="pai-chat" class="pai-chat" aria-live="polite"></div>
    <form id="pai-chat-form" class="pai-chat-form">
      <label for="pai-prompt"><strong>想請 AI 協助什麼？</strong></label>
      <textarea id="pai-prompt" maxlength="4000" placeholder="例如：請協助我把目前的工作任務拆成可執行的小步驟。"></textarea>
      <div class="pai-actions"><button id="pai-send" class="pai-primary" type="submit">送出給 AI</button></div>
    </form>
    <div id="personal-ai-status" role="status"></div>
  </div>
`;

document.body.append(trigger, dialog);

const providerSelect = dialog.querySelector("#pai-provider");
const keyInput = dialog.querySelector("#pai-key");
const rememberInput = dialog.querySelector("#pai-remember");
const keyLink = dialog.querySelector("#pai-key-link");
const guideLink = dialog.querySelector("#pai-guide-link");
const guideSteps = dialog.querySelector("#pai-guide-steps");
const saveButton = dialog.querySelector("#pai-save-key");
const clearButton = dialog.querySelector("#pai-clear-key");
const chatForm = dialog.querySelector("#pai-chat-form");
const promptInput = dialog.querySelector("#pai-prompt");
const sendButton = dialog.querySelector("#pai-send");
const chat = dialog.querySelector("#pai-chat");
const status = dialog.querySelector("#personal-ai-status");
const historyByProvider = { gemini: [], openai: [] };
let activeKey = "";

function savedKey(provider) {
  try {
    return (
      sessionStorage.getItem(`personal-ai-key-${provider}`) ||
      localStorage.getItem(`personal-ai-key-${provider}`) ||
      ""
    );
  } catch (error) {
    console.error("讀取本機 AI 設定失敗：", error);
    status.textContent = "無法讀取瀏覽器儲存空間，請檢查隱私或儲存設定。";
    return "";
  }
}

function updateProvider() {
  const provider = providers[providerSelect.value];
  keyLink.href = provider.keyUrl;
  keyLink.textContent = provider.guideLabel;
  guideLink.href = provider.guideUrl;
  guideSteps.replaceChildren(
    ...provider.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }),
  );
  activeKey = savedKey(providerSelect.value);
  keyInput.value = activeKey;
  try {
    rememberInput.checked =
      localStorage.getItem(`personal-ai-key-${providerSelect.value}`) !== null;
  } catch (error) {
    console.error("讀取 AI 金鑰保存偏好失敗：", error);
    rememberInput.checked = false;
  }
}

function appendMessage(text, role) {
  const message = document.createElement("div");
  message.className = `pai-msg ${role}`;
  message.textContent = text;
  chat.append(message);
  chat.scrollTop = chat.scrollHeight;
}

async function askGemini(key, messages) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${providers.gemini.model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "你是繁體中文職場任務助理。回答務實、清楚、友善；需要時將工作拆解為可執行步驟。提醒使用者避免提供個資或機密。",
            },
          ],
        },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: { temperature: 0.6 },
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini 回應錯誤（${response.status}）。`);
  }
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("");
  if (!text) {
    throw new Error("Gemini 沒有回傳文字，請調整問題後再試。");
  }
  return text;
}

async function askOpenAI(key, messages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: providers.openai.model,
      messages: [
        {
          role: "system",
          content:
            "你是繁體中文職場任務助理。回答務實、清楚、友善；需要時將工作拆解為可執行步驟。提醒使用者避免提供個資或機密。",
        },
        ...messages,
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI 回應錯誤（${response.status}）。`);
  }
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenAI 沒有回傳文字，請調整問題後再試。");
  }
  return text;
}

trigger.addEventListener("click", () => {
  updateProvider();
  dialog.showModal();
  keyInput.focus();
});

dialog.querySelector(".pai-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
providerSelect.addEventListener("change", updateProvider);

saveButton.addEventListener("click", () => {
  const key = keyInput.value.trim();
  if (!key) {
    status.textContent = "請先貼上 API Key。";
    keyInput.focus();
    return;
  }
  const provider = providerSelect.value;
  try {
    sessionStorage.setItem(`personal-ai-key-${provider}`, key);
    if (rememberInput.checked) {
      localStorage.setItem(`personal-ai-key-${provider}`, key);
    } else {
      localStorage.removeItem(`personal-ai-key-${provider}`);
    }
    activeKey = key;
    status.textContent = `${providers[provider].label} API Key 已在此瀏覽器啟用。`;
  } catch (error) {
    console.error("儲存本機 AI 設定失敗：", error);
    status.textContent =
      "無法儲存 API Key，請檢查瀏覽器儲存空間設定後再試。";
  }
});

clearButton.addEventListener("click", () => {
  const provider = providerSelect.value;
  try {
    sessionStorage.removeItem(`personal-ai-key-${provider}`);
    localStorage.removeItem(`personal-ai-key-${provider}`);
    activeKey = "";
    keyInput.value = "";
    rememberInput.checked = false;
    historyByProvider[provider].length = 0;
    chat.replaceChildren();
    status.textContent = `${providers[provider].label} API Key 已從此瀏覽器清除。`;
  } catch (error) {
    console.error("清除本機 AI 設定失敗：", error);
    status.textContent = "無法清除 API Key，請檢查瀏覽器儲存空間設定。";
  }
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!activeKey) {
    status.textContent = "請先輸入 API Key，並按「在本機使用」。";
    keyInput.focus();
    return;
  }
  if (!prompt) {
    status.textContent = "請輸入想詢問 AI 的內容。";
    promptInput.focus();
    return;
  }

  const provider = providerSelect.value;
  const history = historyByProvider[provider];
  history.push({ role: "user", content: prompt });
  appendMessage(prompt, "user");
  promptInput.value = "";
  sendButton.disabled = true;
  status.textContent = `正在連線至 ${providers[provider].label}…`;

  try {
    const messages = history.slice(-12);
    const answer =
      provider === "gemini"
        ? await askGemini(activeKey, messages)
        : await askOpenAI(activeKey, messages);
    history.push({ role: "assistant", content: answer });
    appendMessage(answer, "assistant");
    status.textContent = `已收到 ${providers[provider].label} 回覆。`;
  } catch (error) {
    console.error(`${providers[provider].label} API 呼叫失敗：`, error);
    history.pop();
    appendMessage(
      error instanceof Error
        ? error.message
        : "AI 連線失敗，請確認 API Key、網路與供應商額度。",
      "error",
    );
    status.textContent = "連線失敗；請依錯誤訊息檢查設定後再試。";
  } finally {
    sendButton.disabled = false;
    promptInput.focus();
  }
});

window.addEventListener("yuan-progress-sync-error", (event) => {
  const notice = document.createElement("div");
  notice.setAttribute("role", "alert");
  const message = document.createElement("p");
  message.textContent =
    "雲端進度同步失敗；目前進度仍保存在這台裝置。請確認 Firebase Firestore 規則允許登入者存取自己的 users/{uid}/checklists/{roleId}。";
  const link = document.createElement("a");
  link.href =
    "https://console.firebase.google.com/project/lucky-agility-38gvj/firestore/databases/ai-studio-ai-dfb05f7b-225a-4fac-b095-eac45c1951ab/rules";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "開啟 Firestore 規則設定";
  const rulesHelp = document.createElement("details");
  rulesHelp.style.marginTop = "8px";
  const rulesSummary = document.createElement("summary");
  rulesSummary.textContent = "檢核進度規則範例";
  rulesSummary.style.cursor = "pointer";
  const rules = document.createElement("pre");
  rules.textContent =
    "match /users/{userId}/checklists/{roleId} {\n  allow read, write: if request.auth != null && request.auth.uid == userId;\n}";
  Object.assign(rules.style, {
    margin: "6px 0 0",
    padding: "8px",
    background: "#fffaf1",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    font: "11px/1.5 ui-monospace, monospace",
  });
  rulesHelp.append(rulesSummary, rules);
  Object.assign(notice.style, {
    position: "fixed",
    left: "20px",
    bottom: "20px",
    zIndex: "1001",
    maxWidth: "min(520px, calc(100vw - 40px))",
    padding: "12px 16px",
    background: "#fff0ed",
    color: "#8b3023",
    border: "1px solid #e6b6ac",
    borderRadius: "12px",
    boxShadow: "0 8px 24px #0002",
    font: "13px/1.5 system-ui, sans-serif",
  });
  Object.assign(message.style, { margin: "0 0 6px" });
  Object.assign(link.style, { color: "#315e50", fontWeight: "600" });
  notice.append(message, link, rulesHelp);
  document.body.append(notice);
  window.setTimeout(() => notice.remove(), 20000);
});
