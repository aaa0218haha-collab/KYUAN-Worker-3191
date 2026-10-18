// Welcome page, then the dismissible introduction, then the workspace.
const landing=document.querySelector('#welcome-landing');
const root=document.querySelector('#root');
if(landing&&root){
  landing.hidden=false;
  root.hidden=true;
  landing.querySelector('[data-welcome-enter]').addEventListener('click',()=>{
    landing.hidden=true;
    root.hidden=false;
    root.dataset.entered='true';
    window.dispatchEvent(new CustomEvent('yuan:enter-workspace'));
  });
}
