const pages = [
  {id:'checklist',title:'職位要求',hint:'了解職位與能力',type:'profile'},
  {id:'tasks',title:'拆解任務',hint:'一步一步完成工作',type:'steps'},
  {id:'toolkit',title:'實用工具',hint:'需要時選一項工具',type:'tools'},
  {id:'rights',title:'薪水權益',hint:'查看薪資與權益',type:'article'},
];
const karenIntroduction=[
  '嗨！我是 Karen Yuan，在外縣市生活了好幾年，從事醫療資訊產業的行銷企劃，也推動自立生活倡議。',
  '我的生活與職涯像一場多面向的實驗：左手握著數據與 AI 工具，右手帶著手作的溫度與歌聲。身為重度身心障礙者，我用「在哪裡跌倒，就在哪裡躺平、順便看風景」的幽默，在醫療與生活的縫隙中走出自己的節奏。',
];
const karenProfile=[
  {id:'experience',title:'核心經歷',items:[
    {title:'助人與身障資源',text:'高師大諮商心理與復健諮商研究所碩士，具備職業輔導評量員資格。曾在大專校院擔任資源教室輔導員與個案管理師，協助身障學生，也處理需要即時支持的危機狀況。'},
    {title:'專案管理與醫資行銷',text:'目前在軟體服務業，負責醫療資訊系統導入、導入輔導，以及企業與政府機關業務（B2B／B2G）。擅長安排專案時程、管理政府計畫經費，並協調不同部門一起完成工作。'},
    {title:'數位與 AI 應用',text:'結訓於勞動部 AI 智慧商務人才培訓班，運用 ChatGPT、Gemini、Canva 等工具，讓工作流程與行政作業更順暢。'},
  ]},
  {id:'life',title:'生活與斜槓',items:[
    {title:'生命經驗與倡議',text:'與免疫肌炎共存，持有第七類重度身心障礙證明。參與自立生活倡議，希望每個人都能自己決定生活，並有無障礙環境與參與社會的機會。'},
    {title:'設計與手作',text:'實踐大學服飾設計與經營學系畢業，具備品牌視覺（CIS）與平面設計能力。也透過結緣售出的手作作品，傳遞心意。'},
    {title:'日常興趣',text:'我是女聲合唱團團員，喜歡唱歌、下廚，家裡養了一隻有心臟病的傲嬌貓。'},
  ]},
];
const karenApproach=[
  {id:'background',label:'Background',title:'多元身分與背景',description:'復健諮商碩士、職評員、重度身障證明持有者，也長期定期住院治療，陪伴自己與他人走過醫療資源的需要。',detail:'我有復健諮商碩士學位與職業輔導評量員資格，也是重度身心障礙證明持有者。長期定期住院治療的經驗，讓我熟悉醫療資源與生活支持交會時的真實需要。'},
  {id:'mindset',label:'Mindset',title:'生活哲學與日常',description:'有信仰但沒有宗教，養了一隻心臟病傲嬌貓；喜歡唱歌、下廚與手工藝，作品也透過結緣售出。',detail:'工作之外，我喜歡唱歌、下廚和做手工藝，也照顧家中有心臟病的傲嬌貓。生活裡的小事，提醒我保留自己的節奏與幽默。'},
  {id:'experience',label:'Experience',title:'倡議與實踐',description:'協助夥伴籌備 NVD 自立生活協會、參與合唱團快閃演出，並推動職場與生活的友善連結。',detail:'我協助夥伴籌備 NVD 自立生活協會，參與合唱團快閃演出，也持續投入自立生活倡議，希望每個人都能自主決定生活並參與社會。'},
  {id:'connection',label:'Connection',title:'交流與預約',description:'紫微諮詢、生涯支持、水晶訂製與故事投稿，歡迎透過 LINE 詢問與交流。',detail:'想了解紫微諮詢、生涯支持、水晶訂製或故事投稿，歡迎先透過 LINE 聯絡凱倫，討論內容與合適的交流方式。'},
];
function roleLabel(role) {
  const chineseAlias=role?.marketAliases?.find(name=>/[\u3400-\u9fff]/.test(name));
  return chineseAlias&& !/[\u3400-\u9fff]/.test(role.title)
    ? `${chineseAlias}（${role.title}）`
    : role.title;
}
export function createYuanWorkspace(React, runtime) {
  const {jsx,jsxs} = runtime;
  function Preview({type}) {
    const common={fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'};
    const shapes=type==='profile'?[
      jsx('rect',{x:8,y:17,width:32,height:24,rx:4,...common}),
      jsx('path',{d:'M16 17v-5h16v5M8 26h32M20 26v4h8v-4',...common}),
    ]:type==='steps'?[
      jsx('rect',{x:11,y:9,width:26,height:32,rx:4,...common}),
      jsx('path',{d:'M18 9V6h12v3M17 20l2 2 4-4M26 21h6M17 30l2 2 4-4M26 31h6',...common}),
    ]:type==='tools'?[
      jsx('path',{d:'M17 18v-5h14v5M9 19h30v22H9zM9 27h30M21 27v4h6v-4',...common}),
      jsx('path',{d:'M15 35h3M22.5 35h3M30 35h3',...common}),
    ]:type==='about'?[
      jsx('circle',{cx:24,cy:16,r:7,...common}),
      jsx('path',{d:'M10 40c1-9 6-14 14-14s13 5 14 14M7 11h7M10.5 7.5v7',...common}),
    ]:[
      jsx('circle',{cx:24,cy:24,r:16,...common}),
      jsx('path',{d:'M29 17c-2-3-11-3-11 2 0 6 12 2 12 9 0 5-8 7-13 3M24 13v22',...common}),
    ];
    return jsx('svg',{className:'yw-preview',viewBox:'0 0 48 48','aria-hidden':true,children:shapes});
  }
  function KarenAbout() {
    const [tab,setTab]=React.useState(0);
    return jsxs('article',{className:'yw-karen-page',children:[
      jsxs('header',{className:'yw-karen-intro',children:[
        jsx('img',{src:'./karen-header.png',alt:'凱倫與元元的插畫形象',width:1254,height:1254,loading:'eager'}),
        jsxs('div',{children:[jsx('p',{className:'yw-karen-eyebrow',children:'認識凱倫'}),jsx('h2',{children:'Karen Yuan'}),jsx('a',{className:'yw-karen-kyuan-link',href:'https://job-redesign-131419.onrender.com/',target:'_blank',rel:'noopener noreferrer',children:'KYUAN'}),jsx('p',{className:'yw-karen-tagline',children:'醫療資訊行銷企劃 · 專案協作 · 自立生活倡議'})]}),
      ]}),
      jsxs('div',{className:'yw-karen-tabs',role:'tablist','aria-label':'凱倫介紹內容',children:[
        ['自我介紹','服務與聯絡'].map((label,index)=>jsx('button',{type:'button',role:'tab',id:`yw-karen-tab-${index}`,'aria-selected':tab===index,'aria-controls':`yw-karen-panel-${index}`,tabIndex:tab===index?0:-1,onClick:()=>setTab(index),onKeyDown:event=>{
          const next=event.key==='Home'?0:event.key==='End'?1:['ArrowRight','ArrowLeft'].includes(event.key)?1-tab:undefined;
          if(next!==undefined){event.preventDefault();setTab(next);document.getElementById(`yw-karen-tab-${next}`)?.focus()}
        },children:label},label)),
      ]}),
      jsxs('section',{id:'yw-karen-panel-0',role:'tabpanel','aria-labelledby':'yw-karen-tab-0',hidden:tab!==0,children:[
        jsxs('div',{className:'yw-karen-story',children:[
          jsx('h3',{children:'嗨，我是 Karen'}),karenIntroduction.map((paragraph,index)=>jsx('p',{children:paragraph},index)),
        ]}),
        karenProfile.map(section=>jsxs('section',{className:'yw-karen-section','aria-labelledby':`yw-karen-${section.id}`,children:[
          jsx('h3',{id:`yw-karen-${section.id}`,children:section.title}),
          jsx('div',{className:'yw-karen-cards',children:section.items.map(item=>jsxs('article',{className:'yw-karen-card',children:[
            jsx('h4',{children:item.title}),jsx('p',{children:item.text}),
          ]},item.title))}),
        ]},section.id)),
      ]}),
      jsxs('section',{id:'yw-karen-panel-1',role:'tabpanel','aria-labelledby':'yw-karen-tab-1',hidden:tab!==1,children:[
        jsx('div',{className:'yw-karen-approach',children:karenApproach.map(step=>jsxs('details',{className:'yw-karen-step',children:[
          jsxs('summary',{children:[jsx('span',{className:'yw-karen-step-label',children:step.label}),jsx('strong',{children:step.title})]}),
          jsx('p',{className:'yw-karen-step-description',children:step.description}),jsx('p',{children:step.detail}),
          step.id==='connection'&&jsx('a',{className:'yw-karen-line-link',href:'https://line.me/ti/p/@951rfeit',target:'_blank',rel:'noopener noreferrer',children:'透過 LINE 聯絡凱倫 ↗'}),
        ]},step.id))}),
      ]}),
    ]});
  }
  function Navigation({activeTab,onNavigate,onResponse}) {
    return jsxs('div',{className:'yw-navigation',children:[
      jsx('p',{className:'yw-eyebrow',children:'選擇功能'}),
      jsx('nav',{'aria-label':'主要功能',children:pages.map(page=>jsxs('button',{type:'button','data-tab':page.id,'aria-current':activeTab===page.id?'page':undefined,onClick:()=>onNavigate(page.id),children:[jsx(Preview,{type:page.type}),jsxs('span',{children:[jsx('strong',{children:page.title}),jsx('small',{children:page.hint})]})]},page.id))}),
      jsxs('button',{type:'button','data-tab':'responses',className:'yw-response-link',onClick:onResponse,children:[jsx('span',{className:'yw-response-icon','aria-hidden':true,children:'↗'}),jsxs('span',{children:[jsx('strong',{children:'應對範本'}),jsx('small',{children:'職場溝通回覆參考'})]})]}),
    ]});
  }
  function RolePicker({domains,role,onSelectDomain,onSelectRole}) {
    if(!Array.isArray(domains)||!role)return null;
    return jsxs('label',{className:'yw-role-picker',children:[
      jsx('select',{
        value:role.id,
        'aria-label':'選擇行業與職位',
        onChange:event=>{
          const selectedId=event.target.value;
          const selectedDomain=domains.find(item=>item.roles?.some(itemRole=>itemRole.id===selectedId));
          const selectedRole=selectedDomain?.roles.find(itemRole=>itemRole.id===selectedId);
          if(selectedDomain&&selectedRole){onSelectDomain(selectedDomain.id);onSelectRole(selectedRole)}
        },
        children:domains.map((item,index)=>jsx('optgroup',{
          label:`${index+1}. ${item.name}`,
          children:item.roles.map((itemRole,roleIndex)=>jsx('option',{
            value:itemRole.id,
            children:`${roleIndex+1}. ${roleLabel(itemRole)}`,
          },itemRole.id)),
        },item.id)),
      }),
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
  return function YuanWorkspace({activeTab,role,domain,domains,onSelectDomain,onSelectRole,session,taskNotes,children}) {
    const [sidebarVisible,setSidebarVisible]=React.useState(false);
    const [notesVisible,setNotesVisible]=React.useState(false);
    const [aboutVisible,setAboutVisible]=React.useState(false);
    const [roleSelectionVisible,setRoleSelectionVisible]=React.useState(false);
    const [wideSidebar,setWideSidebar]=React.useState(()=>matchMedia('(min-width:768px)').matches);
    const [wideNotes,setWideNotes]=React.useState(()=>matchMedia('(min-width:1200px)').matches);
    const navDialog=React.useRef(null),notesDialog=React.useRef(null),bar=React.useRef(null),positions=React.useRef({}),previous=React.useRef(activeTab);
    const page=aboutVisible?{id:'about',title:'認識凱倫',hint:'經歷、專長與生活',type:'about'}:pages.find(p=>p.id===activeTab)||pages[0];
    React.useEffect(()=>{
      const side=matchMedia('(min-width:768px)'),notes=matchMedia('(min-width:1200px)');
      const sync=()=>{setWideSidebar(side.matches);setWideNotes(notes.matches);setSidebarVisible(false);setNotesVisible(false)};
      side.addEventListener('change',sync);notes.addEventListener('change',sync);
      window.addEventListener('resize',sync);
      return()=>{side.removeEventListener('change',sync);notes.removeEventListener('change',sync);window.removeEventListener('resize',sync)};
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
      const record=()=>{if(!aboutVisible)positions.current[activeTab]=window.scrollY};
      window.addEventListener('scroll',record,{passive:true});
      return()=>window.removeEventListener('scroll',record);
    },[activeTab,aboutVisible]);
    React.useEffect(()=>{
      const toggleAbout=()=>{
        setAboutVisible(current=>{
          if(current){
            requestAnimationFrame(()=>window.scrollTo({top:positions.current[activeTab]||0,behavior:'instant'}));
            return false;
          }
          positions.current[activeTab]=window.scrollY;
          window.scrollTo({top:0,behavior:'instant'});
          return true;
        });
      };
      window.addEventListener('yuan:toggle-about',toggleAbout);
      return()=>window.removeEventListener('yuan:toggle-about',toggleAbout);
    },[activeTab]);
    React.useEffect(()=>{
      if(previous.current===activeTab)return;
      previous.current=activeTab;setSidebarVisible(false);setNotesVisible(false);
      let restore;
      const timer=requestAnimationFrame(()=>{restore=requestAnimationFrame(()=>window.scrollTo({top:positions.current[activeTab]||0,behavior:'instant'}))});
      return()=>{cancelAnimationFrame(timer);if(restore)cancelAnimationFrame(restore)};
    },[activeTab]);
    const navigate=id=>{
      const wasAbout=aboutVisible;
      setAboutVisible(false);
      if(!aboutVisible)positions.current[activeTab]=window.scrollY;
      setSidebarVisible(false);
      const original=document.querySelector(`[data-yuan-original-navigation] button[data-yuan-tab="${id}"]`);
      original?.click();
      if(wasAbout)requestAnimationFrame(()=>window.scrollTo({top:positions.current[id]||0,behavior:'instant'}));
    };
    const sectionKey=`kyuan-section-note-v1:${activeTab}:${['checklist','tasks'].includes(activeTab)?role.id:'general'}`;
    const showNotes=activeTab!=='toolkit';
    const notes=session&&activeTab==='tasks'?taskNotes:jsx(SectionNotes,{noteKey:sectionKey,label:`${page.title}的備註`},sectionKey);
    const context=session&&activeTab==='tasks'?session.taskTitle:['checklist','tasks'].includes(activeTab)?roleLabel(role):page.hint;
    const notesBody=jsxs('div',{className:'yw-notes-body',children:[jsx('p',{className:'yw-notes-context',children:context}),notes]});
    const openResponse=()=>{
      setSidebarVisible(false);
      setAboutVisible(false);
      const openTemplate=()=>{
        const trigger=Array.from(document.querySelectorAll('#root main button')).find(button=>button.textContent.trim()==='應對範本');
        if(trigger)trigger.click();
        else console.error('Unable to open workplace response templates: the checklist button is unavailable.');
      };
      if(activeTab==='checklist'&&!aboutVisible){openTemplate();return}
      document.querySelector('[data-yuan-original-navigation] button[data-yuan-tab="checklist"]')?.click();
      window.setTimeout(openTemplate,80);
    };
    React.useEffect(()=>{
      const selector=document.querySelector('[data-yuan-selector]');
      if(!selector||roleSelectionVisible)return;
      const hideLegacyFields=()=>{
        const selects=Array.from(selector.querySelectorAll('select'));
        if(selects.length<2)return;
        let container=selects[0].parentElement;
        while(container&&container!==selector&&!container.contains(selects[1]))container=container.parentElement;
        if(container&&container!==selector)container.hidden=true;
      };
      hideLegacyFields();
      const observer=new MutationObserver(hideLegacyFields);
      observer.observe(selector,{childList:true,subtree:true});
      return()=>observer.disconnect();
    },[activeTab,roleSelectionVisible]);
    React.useEffect(()=>{
      if(activeTab!=='checklist'||aboutVisible)return;
      const main=document.querySelector('#root main');
      const picker=document.querySelector('#root [data-yuan-selector]');
      if(!main||!picker)return;
      const selects=Array.from(picker.querySelectorAll('select'));
      const closeAfterRoleSelection=event=>{
        if(event.target===selects[1])setRoleSelectionVisible(false);
      };
      picker.addEventListener('change',closeAfterRoleSelection);
      const handleReselect=event=>{
        const button=event.target instanceof Element?event.target.closest('button'):null;
        if(!button||!(button.textContent.trim()==='重選'||(button.getAttribute('aria-label')||'').includes('返回行業領域與職位挑選')))return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if(selects.length<2){
          console.error('Unable to return to role selection: the industry and role selectors are unavailable.');
          return;
        }
        setRoleSelectionVisible(true);
        picker.open=true;
        let fields=selects[0].parentElement;
        while(fields&&fields!==picker&&!fields.contains(selects[1]))fields=fields.parentElement;
        if(!fields||fields===picker){
          console.error('Unable to return to role selection: the selector fields are unavailable.');
          return;
        }
        fields.hidden=false;
        requestAnimationFrame(()=>{
          picker.scrollIntoView({block:'center',behavior:'smooth'});
          selects[0].focus({preventScroll:true});
          selects[0].click();
        });
      };
      main.addEventListener('click',handleReselect,true);
      return()=>{
        main.removeEventListener('click',handleReselect,true);
        picker.removeEventListener('change',closeAfterRoleSelection);
      };
    },[activeTab,aboutVisible,roleSelectionVisible]);
    React.useEffect(()=>{
      const main=document.querySelector('#root main');
      if(!main)return;
      const markQuickNavigation=()=>{
        const previous=Array.from(main.querySelectorAll('button')).find(button=>button.textContent.trim()==='上一頁');
        previous?.parentElement?.parentElement?.classList.add('yw-quick-nav');
      };
      markQuickNavigation();
      const observer=new MutationObserver(markQuickNavigation);
      observer.observe(main,{childList:true,subtree:true});
      return()=>observer.disconnect();
    },[activeTab]);
    React.useEffect(()=>{
      document.querySelectorAll('#root main .yw-common-titles, #root main .yw-checklist-progress, #root main .yw-progress-detail').forEach(disclosure=>{disclosure.open=false});
    },[activeTab,role?.id]);
    return jsxs('div',{id:'yuan-workspace',className:roleSelectionVisible?'yw-role-selection-open':undefined,children:[
      jsxs('section',{className:'yw-topbar',ref:bar,'aria-label':'目前瀏覽位置',children:[
        jsxs('div',{className:'yw-current',children:[jsx('span',{className:'yw-eyebrow',children:'現在瀏覽'}),jsx('h2',{id:'yuan-current-page',children:page.title}),jsx('p',{className:'yw-context',title:context,children:context})]}),
        jsxs('div',{className:'yw-top-actions',children:[        !wideSidebar&&jsx('button',{id:'yuan-navigation-open',type:'button','aria-haspopup':'dialog','aria-controls':'yuan-navigation-dialog','aria-expanded':sidebarVisible,onClick:()=>setSidebarVisible(true),children:'功能'}),showNotes&&!wideNotes&&jsx('button',{id:'yuan-notes-open',type:'button','aria-haspopup':'dialog','aria-controls':'yuan-notes-dialog','aria-expanded':notesVisible,onClick:()=>setNotesVisible(true),children:'備註'})]}),
      ]}),
      jsxs('div',{className:wideNotes&&showNotes?'yw-columns yw-columns-with-notes':'yw-columns yw-columns-no-notes',children:[
        wideSidebar&&jsx('aside',{className:'yw-sidebar','aria-label':'功能側欄',children:jsx(Navigation,{activeTab,onNavigate:navigate,onResponse:openResponse})}),
        jsxs('div',{className:aboutVisible?'yw-content yw-about-content':'yw-content',children:[
          !aboutVisible&&activeTab==='checklist'&&jsx('figure',{className:'yw-home-illustration',children:jsx('img',{src:'./karen-menu01.png',alt:'凱倫工作助理與檢核清單',width:1536,height:1024,loading:'eager'})}),
          !aboutVisible&&['checklist','tasks'].includes(activeTab)&&jsx(RolePicker,{domains,role,onSelectDomain,onSelectRole}),
          aboutVisible?jsx(KarenAbout,{}):children,
        ]}),
        showNotes&&wideNotes&&jsxs('aside',{className:'yw-notes','aria-label':'備註欄',children:[jsx('h2',{children:'備註'}),notesBody]}),
      ]}),
      !wideSidebar&&jsxs('dialog',{id:'yuan-navigation-dialog',className:'yw-drawer yw-navigation-drawer',ref:navDialog,'aria-labelledby':'yuan-navigation-title',onClose:()=>setSidebarVisible(false),children:[jsxs('div',{className:'yw-drawer-heading',children:[jsx('h2',{id:'yuan-navigation-title',children:'功能側欄'}),jsx('button',{type:'button','data-close':true,onClick:()=>setSidebarVisible(false),children:'關閉'})]}),jsx(Navigation,{activeTab,onNavigate:navigate,onResponse:openResponse})]}),
      showNotes&&!wideNotes&&jsxs('dialog',{id:'yuan-notes-dialog',className:'yw-drawer yw-notes-drawer',ref:notesDialog,'aria-labelledby':'yuan-notes-title',onClose:()=>setNotesVisible(false),children:[jsxs('div',{className:'yw-drawer-heading',children:[jsx('h2',{id:'yuan-notes-title',children:'備註'}),jsx('button',{type:'button','data-close':true,onClick:()=>setNotesVisible(false),children:'關閉'})]}),notesBody]}),
    ]});
  };
}
