const styles = document.createElement('style');
styles.textContent = `
#welcome-dialog{width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 32px);overflow:auto;margin:auto;padding:22px;border:1px solid #e3d6bd;border-radius:20px;background:#fffefa;color:#352f28;box-shadow:0 20px 60px #241d1733;font:15px/1.6 system-ui,"Noto Sans TC",sans-serif}
#welcome-dialog::backdrop{background:#241d1780}
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
@media(max-width:360px){#welcome-dialog{padding:16px}#welcome-dialog h2{font-size:20px}}
`;
document.head.append(styles);
const welcome = document.createElement('dialog');
welcome.id = 'welcome-dialog';
welcome.setAttribute('aria-labelledby','welcome-title');
welcome.setAttribute('aria-describedby','welcome-description');
welcome.innerHTML = `
<h2 id="welcome-title">歡迎使用凱倫知序工作</h2>
<p id="welcome-description">選職位、拆步驟、勾進度，讓工作更容易開始。</p>
<ul>
<li><strong>職位要求：</strong>搜尋職位，了解工作內容與需要的能力。</li>
<li><strong>拆解任務：</strong>把工作拆成小步驟，逐項檢核進度。</li>
<li><strong>實用工具：</strong>運用工作輔助工具，協助整理與執行任務。</li>
<li><strong>薪水權益：</strong>查看薪資與勞動權益資訊。</li>
<li><strong>更多功能：</strong>調整文字大小、查看歷史紀錄、匯出 PDF，或連接自己的 AI。</li>
<li><strong>Google 雲端：</strong>備份進度或匯入備份；需要時再連結即可。</li>
</ul>
<strong>要連結 Google 帳號嗎？</strong>
<p class="welcome-note">可以選擇不要，直接使用網站。之後仍可從右上角「Google 雲端」連結。</p>
<div class="welcome-actions">
<button type="button" data-welcome-google>綁定 Google</button>
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
  const trigger=document.querySelector('#google-drive-connect');
  if(!trigger){welcome.querySelector('#welcome-google-status').textContent='連結功能正在準備中，請稍後再試，或先開始使用。';return}
  welcome.close();trigger.click();
});
if(!document.querySelector('meta[name="google-oauth-client-id"]')?.content.trim()){
  welcome.querySelector('#welcome-google-status').textContent='Google 登入目前尚未開放。你可以先使用所有本機功能。';
}
function mountHelp(){
  const menu=document.querySelector('#reading-more-menu');
  if(!menu||menu.querySelector('#welcome-help'))return;
  const button=document.createElement('button');button.id='welcome-help';button.type='button';button.textContent='功能介紹';button.addEventListener('click',showWelcome);menu.prepend(button);
}
new MutationObserver(mountHelp).observe(document.body,{childList:true,subtree:true});
mountHelp();
let seen=false;try{seen=localStorage.getItem(seenKey)==='true'}catch{}
if(!seen)showWelcome();
