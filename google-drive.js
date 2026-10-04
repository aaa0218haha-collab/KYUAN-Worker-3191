const clientId = document.querySelector('meta[name="google-oauth-client-id"]')
  ?.content.trim();
const backupName = "凱倫知序工作-檢核進度.json";
const driveScope = "https://www.googleapis.com/auth/drive.file";
let tokenClient;
let accessToken = "";
let tokenExpiresAt = 0;

const driveStyles = document.createElement("style");
driveStyles.textContent = `
  #root header [data-yuan-firebase-controls="true"]{display:none!important}
  #google-drive-connect{min-height:36px;padding:0 11px;border:1px solid #d8cca8;border-radius:11px;background:#fff;color:#352f28;font:600 12px/1.3 system-ui,"Noto Sans TC",sans-serif;white-space:nowrap;cursor:pointer}
  #google-drive-connect:hover{background:#faf6ed}
  #google-drive-dialog{width:min(520px,calc(100vw - 28px));max-height:min(85vh,720px);padding:0;border:1px solid #e8e2d8;border-radius:18px;background:#fffefa;color:#352f28;box-shadow:0 20px 60px #241d1733;font:14px/1.65 system-ui,"Noto Sans TC",sans-serif}
  #google-drive-dialog::backdrop{background:#1c1711a6;backdrop-filter:blur(3px)}
  #google-drive-dialog header{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee8dd;background:#fffefa}
  #google-drive-dialog h2{margin:0;font-size:18px}
  #google-drive-dialog [data-gd-close]{width:34px;height:34px;border:0;border-radius:10px;background:#f5f1e9;font-size:20px;cursor:pointer}
  #google-drive-content{display:grid;gap:14px;padding:18px 20px 22px}
  #google-drive-status{margin:0;padding:11px 12px;border-radius:11px;background:#f5f1e9;color:#514a40;overflow-wrap:anywhere}
  #google-drive-status[data-error="true"]{background:#fff0ed;color:#9b352a}
  #google-drive-actions{display:flex;flex-wrap:wrap;gap:8px}
  #google-drive-actions button{min-height:40px;padding:8px 12px;border:1px solid #d8cca8;border-radius:10px;background:#fff;color:#352f28;font:600 13px/1.4 system-ui,"Noto Sans TC",sans-serif;cursor:pointer}
  #google-drive-actions button[data-primary="true"]{border-color:#b88e3e;background:#b88e3e;color:white}
  #google-drive-actions button:disabled{opacity:.5;cursor:not-allowed}
  #google-drive-setup{padding:12px;border:1px solid #eee2c7;border-radius:12px;background:#fff9ec}
  #google-drive-setup p{margin:0 0 8px}
  #google-drive-setup ol{margin:0;padding-left:22px}
  #google-drive-setup a{color:#76571c;text-decoration:underline}
  #google-drive-privacy{margin:0;color:#746b60;font-size:12px}
  @media(max-width:640px){#google-drive-connect{min-height:36px;padding:0 9px;font-size:11px}#google-drive-dialog header{padding:14px 16px}#google-drive-content{padding:15px 16px 18px}}
`;
document.head.append(driveStyles);

const authGroupSelector =
  'button[title^="查看 Google 雲端同步"]';

function authGroup(header) {
  return header.querySelector(authGroupSelector)?.parentElement;
}

function mountConnectButton() {
  const header = document.querySelector("#root header");
  if (!header) return;

  const existing = header.querySelector("#google-drive-connect");
  const group = authGroup(header);
  if (group) group.dataset.yuanFirebaseControls = "true";
  if (existing) return;

  const button = document.createElement("button");
  button.id = "google-drive-connect";
  button.type = "button";
  button.title = "Google 雲端進度備份";
  button.textContent = "Google 雲端";
  button.addEventListener("click", () => {
    dialog.showModal();
    updateConnectionState();
  });

  const actions = group?.parentElement ??
    header.querySelector("div.max-w-5xl > div:last-child");
  if (actions) {
    actions.insertBefore(button, group ?? null);
  } else {
    header.append(button);
  }
}

const dialog = document.createElement("dialog");
dialog.id = "google-drive-dialog";
dialog.setAttribute("aria-labelledby", "google-drive-title");
dialog.innerHTML = `
  <header>
    <h2 id="google-drive-title">Google 雲端進度</h2>
    <button type="button" data-gd-close aria-label="關閉">×</button>
  </header>
  <div id="google-drive-content">
    <p id="google-drive-status" role="status" aria-live="polite">尚未連結 Google 帳號。</p>
    <div id="google-drive-actions">
      <button type="button" data-gd-connect data-primary="true">使用 Google 登入</button>
      <button type="button" data-gd-save disabled>備份到 Google 雲端</button>
      <button type="button" data-gd-import disabled>從 Google 雲端匯入</button>
      <button type="button" data-gd-disconnect hidden>解除連結</button>
    </div>
    <section id="google-drive-setup">
      <p><strong>首次使用需由網站管理者設定 Google OAuth 用戶端 ID：</strong></p>
      <ol>
        <li>啟用 Google Drive API，並完成 OAuth 同意畫面設定；測試階段須加入測試帳號。</li>
        <li>建立 OAuth 2.0「網頁應用程式」用戶端，將 <code>https://aaa0218haha-collab.github.io</code> 加入「已授權的 JavaScript 來源」。</li>
        <li>把用戶端 ID 設定到網站 <code>index.html</code> 的 <code>google-oauth-client-id</code> meta 標籤。</li>
      </ol>
      <p><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">開啟 Google Cloud OAuth 憑證設定</a></p>
      <p>OAuth 用戶端 ID 可公開；請勿把 Client Secret 放進網頁。</p>
    </section>
    <p id="google-drive-privacy">檢核進度直接備份到 Google Drive，不透過 Firebase；僅讀寫此 App 建立或使用者授權的備份檔。匯入會以雲端進度取代此瀏覽器的檢核進度，並重新載入頁面。</p>
  </div>
`;
document.body.append(dialog);

const status = dialog.querySelector("#google-drive-status");
const setup = dialog.querySelector("#google-drive-setup");
const connectButton = dialog.querySelector("[data-gd-connect]");
const saveButton = dialog.querySelector("[data-gd-save]");
const importButton = dialog.querySelector("[data-gd-import]");
const disconnectButton = dialog.querySelector("[data-gd-disconnect]");

dialog.querySelector("[data-gd-close]").addEventListener("click", () =>
  dialog.close()
);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

function setStatus(message, isError = false) {
  status.textContent = message;
  status.dataset.error = String(isError);
}

function hasLiveToken() {
  return Boolean(accessToken && Date.now() < tokenExpiresAt);
}

function updateConnectionState() {
  const connected = hasLiveToken();
  const connectTrigger = document.querySelector("#google-drive-connect");
  if (connectTrigger) {
    connectTrigger.textContent = connected ? "Google 已連結" : "Google 雲端";
  }
  connectButton.disabled = !clientId || connected;
  connectButton.hidden = connected;
  saveButton.disabled = !connected;
  importButton.disabled = !connected;
  disconnectButton.hidden = !connected;
  setup.hidden = Boolean(clientId);
  if (!clientId) {
    setStatus("Google 登入尚未啟用：請網站管理者先設定 OAuth 用戶端 ID。");
  } else if (connected) {
    setStatus("Google 帳號已連結。你可以備份目前進度，或匯入先前的備份。");
  } else if (status.dataset.error !== "true") {
    setStatus("尚未連結 Google 帳號。");
  }
}

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google 登入元件載入失敗。")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google 登入元件載入失敗。"));
    document.head.append(script);
  });
}

function reportGoogleError(error) {
  console.error("Google Drive 進度備份失敗：", error);
  setStatus(error instanceof Error ? error.message : String(error), true);
}

connectButton.addEventListener("click", async () => {
  if (!clientId) {
    updateConnectionState();
    return;
  }

  connectButton.disabled = true;
  setStatus("正在開啟 Google 登入…");
  try {
    await loadGoogleIdentityServices();
    tokenClient ??= window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: driveScope,
      callback: (response) => {
        connectButton.disabled = false;
        if (response.error) {
          reportGoogleError(
            new Error(`Google 授權失敗：${response.error_description || response.error}`),
          );
          return;
        }
        accessToken = response.access_token;
        tokenExpiresAt = Date.now() +
          Math.max(0, Number(response.expires_in || 0) - 60) * 1000;
        updateConnectionState();
        window.setTimeout(
          updateConnectionState,
          Math.max(0, tokenExpiresAt - Date.now()),
        );
      },
      error_callback: (error) => {
        connectButton.disabled = false;
        reportGoogleError(new Error(`Google 登入視窗無法開啟：${error.type}`));
      },
    });
    tokenClient.requestAccessToken({ prompt: "select_account" });
  } catch (error) {
    connectButton.disabled = false;
    reportGoogleError(error);
  }
});

disconnectButton.addEventListener("click", () => {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken, () => {});
  }
  accessToken = "";
  tokenExpiresAt = 0;
  updateConnectionState();
});

async function driveRequest(url, options = {}) {
  if (!hasLiveToken()) {
    accessToken = "";
    tokenExpiresAt = 0;
    updateConnectionState();
    throw new Error("Google 授權已逾時，請重新連結帳號。");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      accessToken = "";
      tokenExpiresAt = 0;
      updateConnectionState();
    }
    const detail = (await response.text()).slice(0, 400);
    throw new Error(
      `Google Drive 回應 ${response.status}${detail ? `：${detail}` : ""}`,
    );
  }
  return response.status === 204 ? null : response;
}

async function findBackup() {
  const query = new URLSearchParams({
    q: `name = '${backupName}' and trashed = false`,
    spaces: "drive",
    fields: "files(id,name,modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: "10",
  });
  const response = await driveRequest(
    `https://www.googleapis.com/drive/v3/files?${query}`,
  );
  const result = await response.json();
  return result.files?.[0] ?? null;
}

function readLocalProgress() {
  const progress = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("checklist_")) continue;
    const value = JSON.parse(localStorage.getItem(key));
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`本機進度「${key}」格式異常，未建立備份。`);
    }
    progress[key] = value;
  }
  return progress;
}

function backupPayload(progress) {
  return JSON.stringify({
    format: "yuan-checklist-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    progress,
  });
}

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  try {
    const progress = readLocalProgress();
    if (Object.keys(progress).length === 0) {
      throw new Error("目前沒有可備份的檢核進度。");
    }

    const existing = await findBackup();
    const content = backupPayload(progress);
    if (existing) {
      await driveRequest(
        `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(existing.id)}?uploadType=media`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: content,
        },
      );
    } else {
      const boundary = `yuan_${crypto.randomUUID()}`;
      const metadata = JSON.stringify({
        name: backupName,
        mimeType: "application/json",
      });
      const body = [
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        metadata,
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        content,
        `--${boundary}--`,
        "",
      ].join("\r\n");
      await driveRequest(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",
        {
          method: "POST",
          headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
          body,
        },
      );
    }
    setStatus("進度已備份到 Google Drive。下次可在此登入後匯入。");
  } catch (error) {
    reportGoogleError(error);
  } finally {
    saveButton.disabled = !hasLiveToken();
  }
});

importButton.addEventListener("click", async () => {
  importButton.disabled = true;
  try {
    const backup = await findBackup();
    if (!backup) {
      setStatus("Google Drive 中找不到此 App 的檢核進度備份。", true);
      return;
    }

    const response = await driveRequest(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(backup.id)}?alt=media`,
    );
    const payload = await response.json();
    if (
      payload?.format !== "yuan-checklist-backup" ||
      payload?.version !== 1 ||
      !payload.progress ||
      typeof payload.progress !== "object" ||
      Array.isArray(payload.progress)
    ) {
      throw new Error("雲端檔案不是有效的檢核進度備份，未變更本機資料。");
    }

    const entries = Object.entries(payload.progress);
    if (
      entries.some(([key, value]) =>
        !key.startsWith("checklist_") ||
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.values(value).some((checked) => typeof checked !== "boolean")
      )
    ) {
      throw new Error("雲端檔案的進度格式不正確，未變更本機資料。");
    }

    if (
      !window.confirm(
        `將匯入 ${entries.length} 份職務檢核進度，並取代這個瀏覽器目前保存的檢核進度。是否繼續？`,
      )
    ) {
      setStatus("已取消匯入，本機進度未變更。");
      return;
    }

    const currentKeys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("checklist_")) currentKeys.push(key);
    }
    currentKeys.forEach((key) => localStorage.removeItem(key));
    entries.forEach(([key, value]) =>
      localStorage.setItem(key, JSON.stringify(value))
    );
    window.location.reload();
  } catch (error) {
    reportGoogleError(error);
  } finally {
    importButton.disabled = !hasLiveToken();
  }
});

const observer = new MutationObserver(mountConnectButton);
observer.observe(document.body, { childList: true, subtree: true });
mountConnectButton();
updateConnectionState();
window.addEventListener("resize", mountConnectButton);
