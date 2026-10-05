const pages = [
  {id:'checklist',title:'職位要求',hint:'了解職位與能力',type:'profile'},
  {id:'tasks',title:'拆解任務',hint:'一步一步完成工作',type:'steps'},
  {id:'toolkit',title:'實用工具',hint:'需要時選一項工具',type:'tools'},
  {id:'rights',title:'薪水權益',hint:'查看薪資與權益',type:'article'},
];
export function createYuanWorkspace(React, runtime) {
  const {jsx,jsxs} = runtime;
  function Preview({type}) {
    const common={fill:'none',stroke:'currentColor',strokeWidth:1.5};
    const shapes=type==='profile'?[jsx('rect',{x:8,y:8,width:56,height:9,rx:2,...common}),jsx('rect',{x:8,y:22,width:56,height:9,rx:2,...common}),jsx('path',{d:'M9 38h42M9 44h31',...common})]:type==='steps'?[8,23,38].flatMap(y=>[jsx('rect',{x:9,y,width:9,height:9,rx:2,...common}),jsx('path',{d:`M25 ${y+4}h36`,...common})]):type==='tools'?[8,37].flatMap(x=>[jsx('rect',{x,y:8,width:26,height:17,rx:3,...common}),jsx('rect',{x,y:31,width:26,height:17,rx:3,...common})]):[jsx('path',{d:'M10 10h34M10 20h52M10 28h52M10 36h43M10 44h48',...common})];
    return jsxs('svg',{className:'yw-preview',viewBox:'0 0 72 56','aria-hidden':true,children:shapes.map((shape,i)=>jsx('g',{children:shape},i))});
  }
  function Navigation({activeTab,onNavigate}) {
    return jsxs('div',{className:'yw-navigation',children:[
      jsx('p',{className:'yw-eyebrow',children:'選擇功能'}),
      jsx('nav',{'aria-label':'主要功能',children:pages.map(page=>jsxs('button',{type:'button','data-tab':page.id,'aria-label':`${page.title}，${page.hint}`,'aria-current':activeTab===page.id?'page':undefined,title:page.title,onClick:()=>onNavigate(page.id),children:[jsx(Preview,{type:page.type}),jsxs('span',{children:[jsx('strong',{children:page.title}),jsx('small',{children:page.hint})]})]},page.id))}),
    ]});
  }
  function SectionNotes({noteKey,label}) {
    const [value,setValue]=React.useState(()=>{try{return localStorage.getItem(noteKey)||''}catch{return ''}});
    const [status,setStatus]=React.useState('備註儲存在此瀏覽器');
    return jsxs('div',{className:'yw-section-notes',children:[
      jsx('label',{htmlFor:'yuan-section-note',children:label}),
      jsx('textarea',{id:'yuan-section-note',rows:9,value,placeholder:'記下稍後要做的事、疑問或重點…',onChange:e=>{const text=e.target.value;setValue(text);try{localStorage.setItem(noteKey,text);setStatus('已儲存在此瀏覽器')}catch{setStatus('無法儲存；離開前請先複製備註')}}}),
      jsx('p',{className:'yw-save-status',role:'status',children:status}),
    ]});
  }
  return function YuanWorkspace({activeTab,role,domain,session,taskNotes,children}) {
    const [sidebarVisible,setSidebarVisible]=React.useState(false);
    const [notesVisible,setNotesVisible]=React.useState(false);
    const [wideSidebar,setWideSidebar]=React.useState(()=>matchMedia('(min-width:768px)').matches);
    const [wideNotes,setWideNotes]=React.useState(()=>matchMedia('(min-width:1200px)').matches);
    const navDialog=React.useRef(null),notesDialog=React.useRef(null),bar=React.useRef(null),positions=React.useRef({}),previous=React.useRef(activeTab);
    const page=pages.find(p=>p.id===activeTab)||pages[0];
    React.useEffect(()=>{
      const side=matchMedia('(min-width:768px)'),notes=matchMedia('(min-width:1200px)');
      const sync=()=>{setWideSidebar(side.matches);setWideNotes(notes.matches);setSidebarVisible(false);setNotesVisible(false)};
      side.addEventListener('change',sync);notes.addEventListener('change',sync);
      return()=>{side.removeEventListener('change',sync);notes.removeEventListener('change',sync)};
    },[]);
    React.useEffect(()=>{
      const header=document.querySelector('#root header');
      const update=()=>{document.documentElement.style.setProperty('--yw-header-height',`${header?.getBoundingClientRect().height||54}px`);document.documentElement.style.setProperty('--yw-bar-height',`${bar.current?.getBoundingClientRect().height||80}px`)};
      const observer=new ResizeObserver(update);if(header)observer.observe(header);if(bar.current)observer.observe(bar.current);update();return()=>observer.disconnect();
    },[]);
    React.useEffect(()=>{
      const dialog=navDialog.current;
      if(dialog){if(sidebarVisible&&!dialog.open)dialog.showModal();else if(!sidebarVisible&&dialog.open)dialog.close()}
    },[sidebarVisible,wideSidebar]);
    React.useEffect(()=>{
      const dialog=notesDialog.current;
      if(dialog){if(notesVisible&&!dialog.open)dialog.showModal();else if(!notesVisible&&dialog.open)dialog.close()}
    },[notesVisible,wideNotes]);
    React.useEffect(()=>{
      const record=()=>{positions.current[activeTab]=window.scrollY};
      window.addEventListener('scroll',record,{passive:true});
      return()=>window.removeEventListener('scroll',record);
    },[activeTab]);
    React.useEffect(()=>{
      if(previous.current===activeTab)return;
      previous.current=activeTab;setSidebarVisible(false);setNotesVisible(false);
      let restore;
      const timer=requestAnimationFrame(()=>{restore=requestAnimationFrame(()=>window.scrollTo({top:positions.current[activeTab]||0,behavior:'instant'}))});
      return()=>{cancelAnimationFrame(timer);if(restore)cancelAnimationFrame(restore)};
    },[activeTab]);
    const navigate=id=>{
      positions.current[activeTab]=window.scrollY;
      setSidebarVisible(false);
      const original=document.querySelector(`[data-yuan-original-navigation] button[data-yuan-tab="${id}"]`);
      original?.click();
    };
    const sectionKey=`kyuan-section-note-v1:${activeTab}:${['checklist','tasks'].includes(activeTab)?role.id:'general'}`;
    const notes=session&&activeTab==='tasks'?taskNotes:jsx(SectionNotes,{noteKey:sectionKey,label:`${page.title}的備註`},sectionKey);
    const context=session&&activeTab==='tasks'?session.taskTitle:['checklist','tasks'].includes(activeTab)?role.title:page.hint;
    const notesBody=jsxs('div',{className:'yw-notes-body',children:[jsx('p',{className:'yw-notes-context',children:context}),notes]});
    return jsxs('div',{id:'yuan-workspace',children:[
      jsxs('section',{className:'yw-topbar',ref:bar,'aria-label':'目前瀏覽位置',children:[
        jsxs('div',{className:'yw-current',children:[jsx('span',{className:'yw-eyebrow',children:'現在瀏覽'}),jsx('h2',{id:'yuan-current-page',children:page.title}),jsx('p',{className:'yw-context',title:context,children:context})]}),
        jsxs('div',{className:'yw-top-actions',children:[!wideSidebar&&jsx('button',{id:'yuan-navigation-open',type:'button','aria-haspopup':'dialog','aria-controls':'yuan-navigation-dialog','aria-expanded':sidebarVisible,onClick:()=>setSidebarVisible(true),children:'功能'}),!wideNotes&&jsx('button',{id:'yuan-notes-open',type:'button','aria-haspopup':'dialog','aria-controls':'yuan-notes-dialog','aria-expanded':notesVisible,onClick:()=>setNotesVisible(true),children:'備註'})]}),
      ]}),
      jsxs('div',{className:'yw-columns',children:[
        wideSidebar&&jsx('aside',{className:'yw-sidebar','aria-label':'功能側欄',children:jsx(Navigation,{activeTab,onNavigate:navigate})}),
        jsx('div',{className:'yw-content',children}),
        wideNotes&&jsxs('aside',{className:'yw-notes','aria-label':'備註欄',children:[jsx('h2',{children:'備註'}),notesBody]}),
      ]}),
      !wideSidebar&&jsxs('dialog',{id:'yuan-navigation-dialog',className:'yw-drawer yw-navigation-drawer',ref:navDialog,'aria-labelledby':'yuan-navigation-title',onClose:()=>setSidebarVisible(false),children:[jsxs('div',{className:'yw-drawer-heading',children:[jsx('h2',{id:'yuan-navigation-title',children:'功能側欄'}),jsx('button',{type:'button','data-close':true,onClick:()=>setSidebarVisible(false),children:'關閉'})]}),jsx(Navigation,{activeTab,onNavigate:navigate})]}),
      !wideNotes&&jsxs('dialog',{id:'yuan-notes-dialog',className:'yw-drawer yw-notes-drawer',ref:notesDialog,'aria-labelledby':'yuan-notes-title',onClose:()=>setNotesVisible(false),children:[jsxs('div',{className:'yw-drawer-heading',children:[jsx('h2',{id:'yuan-notes-title',children:'備註'}),jsx('button',{type:'button','data-close':true,onClick:()=>setNotesVisible(false),children:'關閉'})]}),notesBody]}),
    ]});
  };
}
