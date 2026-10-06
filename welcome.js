const styles = document.createElement('style');
styles.textContent = `
#welcome-dialog{width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 32px);overflow:auto;margin:auto;padding:16px;border:1px solid #e3d6bd;border-radius:20px;background:#fffefa;color:#352f28;box-shadow:0 20px 60px #241d1733;font:15px/1.6 system-ui,"Noto Sans TC",sans-serif}
#welcome-dialog::backdrop{background:#241d1780}
#welcome-dialog .welcome-hero{display:block;width:100%;height:auto;max-height:220px;aspect-ratio:3/2;object-fit:cover;object-position:center 48%;border-radius:12px;margin:0 0 16px}
#welcome-dialog h2{font-size:22px;font-weight:700;margin:0 0 5px}
#welcome-dialog p{margin:0 0 14px}
#welcome-dialog ul{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:8px}
#welcome-dialog li{padding:9px 12px;border-radius:10px;background:#f6f1e8;font-size:14px}
#welcome-dialog strong{font-weight:700}
#welcome-dialog .welcome-actions{display:grid;gap:9px;margin-top:14px}
#welcome-dialog button{min-height:44px;padding:10px 14px;border:1px solid #d8cca8;border-radius:11px;background:white;cursor:pointer;font-weight:600}
#welcome-dialog [data-welcome-google]{background:#3a4e44;color:white;border-color:#3a4e44}
#welcome-dialog .welcome-note{font-size:13px;color:#746b60;margin:9px 0 0}
#welcome-dialog button:focus-visible{outline:3px solid #9b762f;outline-offset:2px}
@media(max-width:360px){#welcome-dialog{padding:12px}#welcome-dialog h2{font-size:20px}#welcome-dialog .welcome-hero{max-height:170px;margin-bottom:12px}}
#welcome-landing{box-sizing:border-box;min-height:100svh;display:grid;place-items:center;padding:clamp(20px,5vw,56px);background:radial-gradient(ellipse at 50% 12%,#fffefa 0,#f7f1e6 72%,#f1eadc 100%);color:#352f28;font-family:system-ui,"Noto Sans TC",sans-serif}
#welcome-landing[hidden],#root[hidden]{display:none!important}
.welcome-landing-card{width:min(100%,820px);display:grid;justify-items:center;gap:14px;padding:clamp(18px,4vw,34px);border:1px solid #e3d6bd;border-radius:26px;background:#fffefa;box-shadow:0 18px 55px #241d1712;text-align:center}
.welcome-landing-image{display:block;width:min(100%,620px);height:auto;object-fit:contain}
.welcome-landing-title{margin:0;color:#30453a;font-size:clamp(25px,5vw,38px);line-height:1.25}
.welcome-landing-copy{max-width:38ch;margin:0;color:#655d53;font-size:clamp(14px,2.5vw,17px);line-height:1.75}
.welcome-landing-start{min-height:48px;padding:11px 25px;border:0;border-radius:12px;background:#30453a;color:#fffefa;font:700 16px/1.4 system-ui,"Noto Sans TC",sans-serif;cursor:pointer}
.welcome-landing-start:hover{background:#24372d}
.welcome-landing-start:focus-visible{outline:3px solid #9b762f;outline-offset:3px}
@media(max-width:480px){#welcome-landing{padding:16px}.welcome-landing-card{gap:11px;padding:15px;border-radius:20px}.welcome-landing-image{width:100%}}
`;
document.head.append(styles);
const landing=document.querySelector('#welcome-landing');
const root=document.querySelector('#root');
if(!landing||!root)throw new Error('迎賓頁或應用程式容器不存在，無法初始化首頁。');
landing.querySelector('[data-welcome-enter]').addEventListener('click',()=>{
  landing.hidden=true;
  root.hidden=false;
});
const welcome = document.createElement('dialog');
welcome.id = 'welcome-dialog';
welcome.setAttribute('aria-labelledby','welcome-title');
welcome.setAttribute('aria-describedby','welcome-description');
welcome.innerHTML = `
<img class="welcome-hero" src="./karen-welcome.png" alt="凱倫與戴著耳機的老虎夥伴，一起查看工作檢核清單">
<h2 id="welcome-title">歡迎使用凱倫知序工作</h2>
<p id="welcome-description">選職位、拆步驟、勾進度，讓工作更容易開始。</p>
<ul>
<li><strong>職位要求：</strong>搜尋職位，了解工作內容與需要的能力。</li>
<li><strong>拆解任務：</strong>把工作拆成小步驟，逐項檢核進度。</li>
<li><strong>實用工具：</strong>運用工作輔助工具，協助整理與執行任務。</li>
<li><strong>薪水權益：</strong>查看薪資與勞動權益資訊。</li>
<li><strong>Google 雲端備份：</strong>按「連結 Google 雲端」並在 Google 視窗按「允許」，再按「備份進度」。換裝置時連結同一帳號後按「匯入進度」。</li>
<li><strong>連接自己的 AI：</strong>按「Google AI Studio 申請 API Key」取得金鑰，貼到 AI 視窗並按「在本機使用」。金鑰不需要、也不要傳給網站管理員；使用可能產生供應商費用。</li>
<li><strong>更多功能：</strong>調整文字大小、查看歷史紀錄或匯出 PDF。</li>
<li><strong>Google 登入：</strong>把檢核進度依帳號分開保存在這台裝置；不會自動連結雲端或 AI。</li>
</ul>
<strong>登入 Google 帳號</strong>
<p class="welcome-note">登入只用來分開管理此裝置上的個人進度，不會授權 Google 雲端或 AI。要在其他裝置使用，請另外選擇「雲端備份」。</p>
<div class="welcome-actions">
<button type="button" data-welcome-google>Google 登入</button>
<button type="button" data-welcome-drive>設定 Google 雲端備份</button>
<button type="button" data-welcome-ai>連接自己的 AI</button>
<button type="button" data-welcome-skip autofocus>暫時不要，直接開始</button>
</div>
<p class="welcome-note" id="welcome-google-status"></p>
`;
document.body.append(welcome);
const seenKey = 'kyuan-welcome-seen-v1';
function rememberChoice(){try{localStorage.setItem(seenKey,'true')}catch{}}
function showWelcome(){const more=document.querySelector('#reading-more');if(more)more.open=false;if(!welcome.open)welcome.showModal()}
welcome.querySelector('[data-welcome-skip]').addEventListener('click',()=>welcome.close());
welcome.addEventListener('close',rememberChoice);
welcome.querySelector('[data-welcome-google]').addEventListener('click',()=>{
  const trigger=document.querySelector('#yuan-google-sign-in');
  if(!trigger){welcome.querySelector('#welcome-google-status').textContent='Google 登入正在準備中，請稍後再試，或先開始使用。';return}
  if(trigger.disabled){welcome.querySelector('#welcome-google-status').textContent='Google 登入目前無法連線，請稍後再試；進度仍會保存在這台裝置。';return}
  welcome.close();trigger.click();
});
welcome.querySelector('[data-welcome-drive]').addEventListener('click',()=>{
  const trigger=document.querySelector('#google-drive-connect');
  if(!trigger){welcome.querySelector('#welcome-google-status').textContent='雲端備份正在準備中，請稍後再試。';return}
  welcome.close();trigger.click();
});
welcome.querySelector('[data-welcome-ai]').addEventListener('click',()=>{
  const trigger=document.querySelector('#personal-ai-trigger');
  if(!trigger){welcome.querySelector('#welcome-google-status').textContent='AI 連線功能正在準備中，請稍後再試。';return}
  welcome.close();trigger.click();
});
if(!document.querySelector('meta[name="google-oauth-client-id"]')?.content.trim()){
  welcome.querySelector('#welcome-google-status').textContent='Google 登入目前尚未開放。你可以先使用所有本機功能。';
}else{
  welcome.querySelector('#welcome-google-status').textContent='登入若未成功，進度仍會保存在這台裝置。';
}
function mountHelp(){
  const menu=document.querySelector('#reading-more-menu');
  if(!menu||menu.querySelector('#welcome-help'))return;
  const button=document.createElement('button');button.id='welcome-help';button.type='button';button.textContent='功能介紹';button.addEventListener('click',showWelcome);menu.prepend(button);
}
new MutationObserver(mountHelp).observe(document.body,{childList:true,subtree:true});
mountHelp();
