const clientId = document.querySelector('meta[name="google-oauth-client-id"]')
  ?.content.trim();
let tokenClient;
const accountStorageKey = "yuan-google-account";
let identityScriptPromise;

function readSavedAccount() {
  try {
    const saved = localStorage.getItem(accountStorageKey);
    if (!saved) return null;
    const user = JSON.parse(saved);
    if (typeof user.uid !== "string" || !user.uid) {
      throw new Error("Saved Google account is missing its user ID.");
    }
    return {
      uid: user.uid,
      email: typeof user.email === "string" ? user.email : "",
      displayName: typeof user.displayName === "string"
        ? user.displayName
        : "",
      photoURL: typeof user.photoURL === "string" ? user.photoURL : "",
    };
  } catch (error) {
    console.error("Could not restore the saved Google account:", error);
    return null;
  }
}

let account = readSavedAccount();
window.YUAN_GOOGLE_ACCOUNT = account;

const accountStyles = document.createElement("style");
accountStyles.textContent = `
  #yuan-google-sign-in{min-height:38px;padding:0 12px;border:1px solid #d8cca8;border-radius:11px;background:#fff;color:#352f28;font:600 15px/1.4 system-ui,"Noto Sans TC",sans-serif;white-space:nowrap;cursor:pointer}
  #yuan-google-sign-in:hover:not(:disabled){background:#faf6ed}
  #yuan-google-sign-in:disabled{border-color:#ded6c8;background:#f5f1e9;color:#514a40;opacity:1;cursor:not-allowed}
  #yuan-google-account-dialog{width:min(480px,calc(100vw - 28px));max-height:min(85vh,680px);padding:0;border:1px solid #ded6c8;border-radius:18px;background:#fffefa;color:#352f28;box-shadow:0 20px 60px #241d1733;font:16px/1.7 system-ui,"Noto Sans TC",sans-serif}
  #yuan-google-account-dialog::backdrop{background:#1c1711a6;backdrop-filter:blur(3px)}
  #yuan-google-account-dialog header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e5ded2;background:#fffefa}
  #yuan-google-account-dialog h2{margin:0;font-size:22px}
  #yuan-google-account-dialog [data-account-close]{width:38px;height:38px;border:0;border-radius:10px;background:#f5f1e9;font-size:22px;cursor:pointer}
  #yuan-google-account-content{display:grid;gap:14px;padding:18px 20px 22px}
  #yuan-google-account-status{margin:0;padding:13px 14px;border-radius:11px;background:#f5f1e9;color:#352f28;overflow-wrap:anywhere}
  #yuan-google-account-status[data-error="true"]{background:#fff0ed;color:#8b3023}
  #yuan-google-account-identity{margin:0;color:#514a40}
  #yuan-google-account-actions{display:grid;gap:9px}
  #yuan-google-account-actions button{width:100%;min-height:46px;padding:10px 14px;border:1px solid #ded6c8;border-radius:11px;background:#fff;color:#352f28;font:600 17px/1.4 system-ui,"Noto Sans TC",sans-serif;cursor:pointer}
  #yuan-google-account-actions [data-account-login]{border-color:#3a4e44;background:#3a4e44;color:#fff}
  #yuan-google-account-actions button:focus-visible,#yuan-google-account-dialog [data-account-close]:focus-visible,#yuan-google-sign-in:focus-visible{outline:3px solid #9b762f;outline-offset:2px}
  #yuan-google-account-explanation{margin:0;color:#514a40;font-size:16px}
  #yuan-google-account-guide{margin:12px 0;padding:12px 14px;border:1px solid #e6d9c8;border-radius:12px;background:#fffaf0;color:#514a40;font-size:15px;line-height:1.6}#yuan-google-account-guide ol{margin:6px 0 0;padding-left:20px}
  @media(max-width:640px){#yuan-google-sign-in{min-height:38px;padding:0 9px;font-size:14px}#yuan-google-account-dialog header{padding:14px 16px}#yuan-google-account-content{padding:15px 16px 18px}}
`;
document.head.append(accountStyles);

const dialog = document.createElement("dialog");
dialog.id = "yuan-google-account-dialog";
dialog.setAttribute("aria-labelledby", "yuan-google-account-title");
dialog.innerHTML = `
  <header>
    <h2 id="yuan-google-account-title">Google 帳號登入</h2>
    <button type="button" data-account-close aria-label="關閉">×</button>
  </header>
  <div id="yuan-google-account-content">
    <p id="yuan-google-account-status" role="status" aria-live="polite">訪客進度保存在這台裝置。</p>
    <p id="yuan-google-account-identity" hidden></p>
    <p id="yuan-google-account-explanation">登入後，檢核進度會依 Google 帳號分開保存在這台裝置。第一次登入會先複製目前的訪客進度；之後兩邊分開保存。登入只確認帳號，不會連結 Google 雲端硬碟，也不會連接 AI。要在其他裝置使用進度，請另外選擇「雲端備份」。</p>
    <div id="yuan-google-account-guide" data-account-guide>
      <strong>登入前先看這裡（1 分鐘）</strong>
      <ol>
        <li>按「使用 Google 登入」後，會跳出 Google 的選擇帳號視窗，請選你自己的 Gmail。</li>
        <li>本站只確認你是誰，不會讀取信件、雲端硬碟或密碼。</li>
        <li>若出現「已封鎖存取權：授權錯誤」或「錯誤 400：origin_mismatch」，代表網站管理員尚未在 Google 登記此網址，<b>不是你的帳號或操作有問題</b>。請關閉該頁回到本站，不用重試。</li>
        <li>不登入也能完整使用，進度會保存在這台裝置；請把此錯誤畫面截圖回報管理員，修好後即可登入。</li>
      </ol>
    </div>
    <div id="yuan-google-account-actions">
      <button type="button" data-account-login>使用 Google 登入</button>
      <button type="button" data-account-logout hidden>登出 Google</button>
    </div>
  </div>
`;
document.body.append(dialog);

const status = dialog.querySelector("#yuan-google-account-status");
const identity = dialog.querySelector("#yuan-google-account-identity");
const loginButton = dialog.querySelector("[data-account-login]");
const logoutButton = dialog.querySelector("[data-account-logout]");
const trigger = document.createElement("button");
trigger.id = "yuan-google-sign-in";
trigger.type = "button";
trigger.textContent = "Google 登入";
trigger.disabled = true;
trigger.addEventListener("click", () => {
  updateDialog();
  if (!dialog.open) dialog.showModal();
});

dialog.querySelector("[data-account-close]").addEventListener("click", () =>
  dialog.close()
);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

function showStatus(message, isError = false) {
  status.textContent = message;
  status.dataset.error = String(isError);
}

function updateDialog() {
  const signedIn = Boolean(account);
  loginButton.hidden = signedIn;
  logoutButton.hidden = !signedIn;
  identity.hidden = !signedIn;
  identity.textContent = signedIn
    ? `目前登入：${account.displayName || account.email || "Google 帳號"}`
    : "";
  trigger.textContent = signedIn ? "已登入" : "Google 登入";
  if (signedIn) {
    showStatus("已登入。此帳號的檢核進度與訪客進度分開保存在這台裝置。");
  } else if (status.dataset.error !== "true") {
    showStatus("訪客進度保存在這台裝置。");
  }
}

function setAccount(user) {
  if (user) {
    localStorage.setItem(accountStorageKey, JSON.stringify(user));
  } else {
    localStorage.removeItem(accountStorageKey);
  }
  account = user;
  window.YUAN_GOOGLE_ACCOUNT = user;
  window.dispatchEvent(
    new CustomEvent("yuan-google-account-change", { detail: { user } }),
  );
  updateDialog();
}

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (identityScriptPromise) return identityScriptPromise;

  identityScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.oauth2) resolve();
      else reject(new Error("Google 登入暫時無法使用。"));
    };
    script.onerror = () => reject(new Error("Google 登入暫時無法使用。"));
    document.head.append(script);
  });
  return identityScriptPromise;
}

function reportLoginFailure(errorType = "") {
  const message = String(errorType).includes("origin_mismatch")
    ? "Google 尚未允許這個網站登入。請網站管理員設定登入來源；你的進度仍保存在這台裝置。"
    : "Google 登入未完成。如畫面顯示授權錯誤，請聯絡網站管理員；你的進度仍保存在這台裝置。";
  showStatus(message, true);
  if (!dialog.open) dialog.showModal();
}

function requestSignIn() {
  if (!clientId || !window.google?.accounts?.oauth2) {
    showStatus("目前無法連線至 Google，尚未登入；你的進度仍保存在這台裝置。", true);
    return;
  }

  loginButton.disabled = true;
  showStatus("正在連線至 Google…");
  tokenClient ??= window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "openid email profile",
    callback: async (response) => {
      if (response.error || !response.access_token) {
        reportLoginFailure(response.error);
        loginButton.disabled = false;
        return;
      }

      try {
        const userResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          },
        );
        if (!userResponse.ok) {
          throw new Error(`Google account lookup failed (${userResponse.status})`);
        }
        const user = await userResponse.json();
        if (!user.sub) throw new Error("Google did not return an account ID.");

        setAccount({
          uid: user.sub,
          email: user.email || "",
          displayName: user.name || "",
          photoURL: user.picture || "",
        });
        dialog.close();
      } catch (error) {
        console.error("Google account sign-in failed:", error);
        reportLoginFailure();
      } finally {
        loginButton.disabled = false;
      }
    },
    error_callback: (error) => {
      loginButton.disabled = false;
      reportLoginFailure(error?.type || "");
    },
  });

  tokenClient.requestAccessToken({ prompt: "select_account" });
}

function signOut() {
  try {
    setAccount(null);
    if (dialog.open) dialog.close();
  } catch (error) {
    console.error("Could not clear the saved Google account:", error);
    showStatus("登出失敗，尚未變更目前帳號。請稍後再試。", true);
  }
}

loginButton.addEventListener("click", requestSignIn);
logoutButton.addEventListener("click", signOut);

function mountAccountButton() {
  const header = document.querySelector("#root header");
  if (!header || header.querySelector("#yuan-google-sign-in")) return;

  const cloudButton = header.querySelector("#google-drive-connect");
  const legacyLogin = [...header.querySelectorAll("button")].find((button) =>
    button.title.includes("了解同步目的") ||
    button.title.includes("登出 Google"),
  );
  const legacyGroup = legacyLogin?.parentElement;
  const actions = cloudButton?.parentElement ??
    legacyGroup?.parentElement;
  if (!actions) return;
  if (cloudButton) {
    cloudButton.before(trigger);
  } else if (legacyGroup) {
    actions.insertBefore(trigger, legacyGroup);
  } else {
    actions.append(trigger);
  }
}

const headerObserver = new MutationObserver(mountAccountButton);
headerObserver.observe(document.body, { childList: true, subtree: true });
mountAccountButton();
updateDialog();

if (clientId) {
  loadGoogleIdentityServices().then(
    () => {
      trigger.disabled = false;
    },
    (error) => {
      console.error("Google sign-in library failed to load:", error);
      trigger.textContent = "Google 暫不可用";
    },
  );
} else {
  trigger.textContent = "Google 暫不可用";
}
