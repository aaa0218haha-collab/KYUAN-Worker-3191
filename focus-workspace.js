import {taiwanIndustryDomains,taiwanIndustryOccupations} from './taiwan-industry-roles.js?v=20261020-taiwan-ui-order';
window.kyuanTaiwanIndustryRoles=taiwanIndustryDomains.flatMap(domain=>domain.roles);
const pages = [
  {id:'checklist',title:'職位要求',hint:'了解職位與能力',type:'profile'},
  {id:'tasks',title:'拆解任務',hint:'一步一步完成工作',type:'steps'},
  {id:'toolkit',title:'實用工具',hint:'需要時選一項工具',type:'tools'},
  {id:'rights',title:'薪水權益',hint:'查看薪資與權益',type:'article'},
];
const karenProfile=[
  {id:'experience',title:'核心經歷',items:[
    {title:'助人與身障資源',text:'諮商心理與復健諮商碩士、職業輔導評量員。曾任大專資源教室輔導員與個案管理師，陪伴身障學生。'},
    {title:'醫療資訊與專案協作',text:'負責醫療資訊系統導入、客戶輔導及企業／政府專案，擅長時程安排、經費管理與跨部門溝通。'},
    {title:'數位與 AI 應用',text:'完成勞動部 AI 智慧商務人才培訓，運用 ChatGPT、Gemini、Canva 改善工作與行政流程。'},
  ]},
  {id:'life',title:'生活與斜槓',items:[
    {title:'自立生活倡議',text:'以自身經驗參與倡議，關注自主選擇、無障礙環境與身心障礙者的社會參與。'},
    {title:'設計與手作',text:'畢業於實踐大學服飾設計與經營學系，擅長品牌視覺、平面設計與手作。'},
    {title:'日常興趣',text:'喜歡唱歌、下廚與手工藝，也是女聲合唱團團員，和一隻傲嬌貓一起生活。'},
  ]},
];
const taiwanOccupations=[
  {code:'43-6014.00',group:'行政與辦公',onetTitle:'Secretaries and Administrative Assistants'},
  {code:'43-3031.00',group:'財務與會計',onetTitle:'Bookkeeping, Accounting, and Auditing Clerks'},
  {code:'43-4051.00',group:'客服與顧客支援',onetTitle:'Customer Service Representatives'},
  {code:'41-2031.00',group:'門市與零售',onetTitle:'Retail Salespersons'},
  {code:'35-3031.00',group:'餐飲與旅宿',onetTitle:'Waiters and Waitresses'},
  {code:'31-1120.00',group:'照顧與生活支持',onetTitle:'Home Health and Personal Care Aides'},
  {code:'37-2011.00',group:'清潔與場務',onetTitle:'Janitors and Cleaners, Except Maids and Housekeeping Cleaners'},
  {code:'51-2092.00',group:'製造與組裝',onetTitle:'Team Assemblers'},
  {code:'43-6013.00',group:'醫療行政',onetTitle:'Medical Secretaries and Administrative Assistants'},
  {code:'43-5071.00',group:'物流與倉儲',onetTitle:'Shipping, Receiving, and Inventory Clerks'},
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
  function KarenAbout({onBack}) {
    return jsxs('article',{className:'yw-karen-page',children:[
      jsx('button',{type:'button',className:'yw-karen-back',onClick:onBack,children:'← 回到首頁'}),
      jsxs('header',{className:'yw-karen-intro',children:[
        jsx('img',{src:'./Karen menu02.png',alt:'凱倫與元元的插畫形象',width:1254,height:1254}),
        jsxs('div',{children:[
          jsx('h2',{children:'Karen Yuan'}),
          jsx('p',{className:'yw-karen-tagline',children:'醫療資訊行銷企劃 · 專案協作 · 自立生活倡議'}),
          jsx('a',{className:'yw-karen-kyuan-link',href:'https://job-redesign-131419.onrender.com/',target:'_blank',rel:'noopener noreferrer',children:'前往凱倫工作需求評估頁面'}),
        ]}),
      ]}),
      jsxs('section',{className:'yw-karen-story',children:[
        jsx('h3',{children:'關於凱倫'}),
        jsx('p',{children:'我投入醫療資訊行銷、系統導入與跨部門專案，也參與自立生活倡議。喜歡把複雜工作整理成清楚可行的步驟，陪伴每個人找到適合自己的節奏。'}),
      ]}),
      karenProfile.map(section=>jsxs('section',{className:'yw-karen-section',children:[
        jsx('h3',{children:section.title}),
        jsx('div',{className:'yw-karen-cards',children:section.items.map(item=>jsxs('article',{className:'yw-karen-card',children:[jsx('h4',{children:item.title}),jsx('p',{children:item.text})]},item.title))}),
      ]},section.id)),
      jsxs('section',{className:'yw-karen-contact',children:[
        jsx('h3',{children:'交流與聯繫'}),
        jsx('p',{children:'歡迎交流生涯支持、紫微諮詢、水晶訂製與故事投稿。'}),
        jsx('a',{className:'yw-karen-line-link',href:'https://line.me/ti/p/@951rfeit',target:'_blank',rel:'noopener noreferrer',children:'透過 LINE 聯繫凱倫 ↗'}),
      ]}),
    ]});
  }
  function Navigation({activeTab,onNavigate,onResponse,roleReady=true}) {
    return jsxs('div',{className:'yw-navigation',children:[
      jsx('p',{className:'yw-eyebrow',children:'選擇功能'}),
      jsx('nav',{'aria-label':'主要功能',children:pages.map(page=>jsxs('button',{type:'button','data-tab':page.id,disabled:!roleReady&&page.id!=='rights','aria-current':activeTab===page.id?'page':undefined,onClick:()=>onNavigate(page.id),children:[jsx(Preview,{type:page.type}),jsxs('span',{children:[jsx('strong',{children:page.title}),jsx('small',{children:page.hint})]})]},page.id))}),
      jsxs('button',{type:'button','data-tab':'responses',disabled:!roleReady,className:'yw-response-link',onClick:onResponse,children:[jsx('span',{className:'yw-response-icon','aria-hidden':true,children:'↗'}),jsxs('span',{children:[jsx('strong',{children:'應對範本'}),jsx('small',{children:'職場溝通回覆參考'})]})]}),
    ]});
  }
  function FeaturedOccupations({domains,onChoose}) {
    const rolesByCode=new Map((domains||[]).flatMap(domain=>(domain.roles||[]).map(role=>[role.onetCode,{domain,role}])));
    const featuredOccupations=[
      ...taiwanOccupations.map(item=>({...item,industry:'台灣常見產業代表職務'})),
      ...taiwanIndustryOccupations,
    ];
    return jsxs('section',{className:'yw-featured-occupations','aria-labelledby':'yw-featured-title',children:[
      jsxs('header',{className:'yw-featured-heading',children:[
        jsx('div',{children:[jsx('p',{className:'yw-eyebrow',children:'台灣職業與產業範本'}),jsx('h3',{id:'yw-featured-title',children:'從常見工作到在地產業職務'})]}),
        jsx('p',{children:'前 10 項是參照主計總處職業類別挑選的代表職務，不是熱門排名；後續範本補入台灣汽車美容、金融、職安、回收與紡織工作。'}),
      ]}),
      jsx('div',{className:'yw-featured-grid',children:featuredOccupations.map((item,index)=>{
        const match=rolesByCode.get(item.code);
        const role=item.role||match?.role;
        const taskTitles=role?.typicalTasks?.slice(0,3).map(task=>task.title)||[];
        const skills=role?.checklist?.filter(entry=>entry.category==='skill').slice(0,3)||[];
        return jsxs('details',{className:'yw-featured-card',children:[
          jsxs('summary',{children:[
            jsx('span',{className:'yw-featured-number',children:String(index+1).padStart(2,'0')}),
            jsxs('span',{className:'yw-featured-card-title',children:[
              jsx('strong',{children:role?roleLabel(role):'職業資料載入中'}),
              jsx('small',{children:item.group}),
            ]}),
          ]}),
          role?jsxs('div',{className:'yw-featured-details',children:[
            jsx('p',{className:'yw-featured-industry',children:item.industry}),
            jsx('p',{className:'yw-featured-summary',children:role.summary}),
            jsx('h4',{children:'典型工作任務'}),
            jsx('ul',{children:taskTitles.map((title,taskIndex)=>jsx('li',{children:title},`${item.code}-task-${taskIndex}`))}),
            jsx('h4',{children:'常見技能'}),
            jsx('ul',{children:skills.map((skill,skillIndex)=>jsx('li',{children:skill.name},`${item.code}-skill-${skillIndex}`))}),
            role.credentialNotice&&jsxs(React.Fragment,{children:[
              jsx('h4',{children:'台灣證照／訓練提醒'}),
              jsx('p',{className:'yw-featured-credential',children:role.credentialNotice}),
              role.credentialSource&&jsx('a',{className:'yw-featured-credential-link',href:role.credentialSource,target:'_blank',rel:'noopener noreferrer',children:'查閱相關法規或官方資料 ↗'}),
            ]}),
            jsx('p',{className:'yw-featured-onet-title',children:`O*NET 對照：${item.onetTitle}`}),
            jsxs('div',{className:'yw-featured-actions',children:[
              jsx('a',{href:`https://www.onetonline.org/link/summary/${item.code}`,target:'_blank',rel:'noopener noreferrer',children:`O*NET ${item.code} ↗`}),
              jsx('button',{type:'button',onClick:()=>onChoose(match?.domain,role),children:'用此職業開始工作拆解'}),
            ]}),
          ]}):jsx('p',{className:'yw-featured-unavailable',role:'status',children:`目前無法載入 O*NET ${item.code} 對應的職業資料，請稍後重試。`}),
        ]},item.code);
      })}),
      jsxs('p',{className:'yw-featured-sources',children:[
        jsx('span',{children:'資料參考：'}),
        jsx('a',{href:'https://www.stat.gov.tw/News_Content.aspx?n=4001&s=236078',target:'_blank',rel:'noopener noreferrer',children:'主計總處 114 年人力資源調查統計 ↗'}),
        jsx('span',{children:'；'}),
        jsx('a',{href:'https://www.stat.gov.tw/standardoccupationalclassification.aspx?n=3145&sms=0&rid=6',target:'_blank',rel:'noopener noreferrer',children:'職業標準分類 ↗'}),
        jsx('span',{children:'；'}),
        jsx('a',{href:'https://www.stat.gov.tw/standardindustrialclassification.aspx?n=3144&sms=0',target:'_blank',rel:'noopener noreferrer',children:'行業統計分類 ↗'}),
        jsx('span',{children:'；工作內容與技能依 O*NET 對照，台灣資格及法規提醒附官方查詢連結；實際要求依主管機關、雇主及職務內容為準。'}),
      ]}),
    ]});
  }
  function RolePicker({domains,role,onSelectDomain,onSelectRole,industry,setIndustry,chosenRole}) {
    if(!Array.isArray(domains)||!role)return null;
    const selected=domains.find(item=>item.id===industry);
    return jsxs('div',{className:'yw-role-picker',children:[
      jsxs('label',{children:['1. 選擇行業',jsxs('select',{'aria-label':'選擇行業',value:industry,onChange:event=>{
        setIndustry(event.target.value);
      },children:[jsx('option',{value:'',children:'請先選擇行業'}),domains.map(item=>jsx('option',{value:item.id,children:item.name},item.id))]})]}),
      jsxs('label',{children:['2. 選擇職業',jsxs('select',{'aria-label':'選擇職業',disabled:!selected,value:chosenRole,onChange:event=>{
        const next=selected?.roles.find(item=>item.id===event.target.value);
        if(next){onSelectDomain(selected.id);onSelectRole(next)}
      },children:[jsx('option',{value:'',disabled:true,children:selected?'請選擇職業':'先選行業，再選職業'}),selected?.roles.map(item=>jsx('option',{value:item.id,children:roleLabel(item)},item.id))]})]}),
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
  return function YuanWorkspace({activeTab,role,domain,domains,onSelectDomain,onSelectRole,onNavigate,session,taskNotes,children}) {
    const workspaceDomains=[...(domains||[]),...taiwanIndustryDomains];
    const [aboutVisible,setAboutVisible]=React.useState(false);
    const [homeVisible,setHomeVisible]=React.useState(true);
    const [industry,setIndustry]=React.useState('');
    const [chosenRole,setChosenRole]=React.useState('');
    const bar=React.useRef(null),positions=React.useRef({}),previous=React.useRef(activeTab),previousRole=React.useRef(role.id);
    const page=aboutVisible?{id:'about',title:'認識凱倫',hint:'經歷、專長與生活'}:homeVisible?{id:'home',title:'選擇職業',hint:'選好職業，再選擇需要的協助'}:pages.find(p=>p.id===activeTab)||pages[0];
    React.useEffect(()=>{
      if(previousRole.current===role.id)return;
      previousRole.current=role.id;
      const nextDomain=domains.find(item=>item.roles.some(itemRole=>itemRole.id===role.id));
      if(nextDomain){setIndustry(nextDomain.id);setChosenRole(role.id)}
    },[role.id,domains]);
    React.useEffect(()=>{
      const enter=()=>{setAboutVisible(false);setHomeVisible(true)};
      window.addEventListener('yuan:enter-workspace',enter);
      return()=>window.removeEventListener('yuan:enter-workspace',enter);
    },[]);
    React.useEffect(()=>{
      const header=document.querySelector('#root header');
      const update=()=>{document.documentElement.style.setProperty('--yw-header-height',`${header?.getBoundingClientRect().height||54}px`);document.documentElement.style.setProperty('--yw-bar-height',`${bar.current?.getBoundingClientRect().height||80}px`)};
      const observer=new ResizeObserver(update);if(header)observer.observe(header);if(bar.current)observer.observe(bar.current);update();return()=>observer.disconnect();
    },[]);
    React.useEffect(()=>{
      const record=()=>{if(!aboutVisible&&!homeVisible)positions.current[activeTab]=window.scrollY};
      window.addEventListener('scroll',record,{passive:true});
      return()=>window.removeEventListener('scroll',record);
    },[activeTab,aboutVisible,homeVisible]);
    React.useEffect(()=>{
      const showAbout=()=>{
        positions.current[activeTab]=window.scrollY;
        setHomeVisible(false);
        setAboutVisible(true);
        window.scrollTo({top:0,behavior:'instant'});
      };
      window.addEventListener('yuan:toggle-about',showAbout);
      return()=>window.removeEventListener('yuan:toggle-about',showAbout);
    },[activeTab]);
    React.useEffect(()=>{
      if(previous.current===activeTab)return;
      previous.current=activeTab;
      let restore;
      const timer=requestAnimationFrame(()=>{restore=requestAnimationFrame(()=>window.scrollTo({top:positions.current[activeTab]||0,behavior:'instant'}))});
      return()=>{cancelAnimationFrame(timer);if(restore)cancelAnimationFrame(restore)};
    },[activeTab]);
    const navigate=id=>{
      if(id!=='rights'&&(!chosenRole||chosenRole!==role.id))return;
      setHomeVisible(false);
      setAboutVisible(false);
      positions.current[activeTab]=window.scrollY;
      onNavigate(id);
      requestAnimationFrame(()=>window.scrollTo({top:positions.current[id]||0,behavior:'instant'}));
    };
    const useFeaturedOccupation=(nextDomain,nextRole)=>{
      setIndustry(nextDomain.id);
      setChosenRole(nextRole.id);
      onSelectDomain(nextDomain.id);
      onSelectRole(nextRole);
      setHomeVisible(false);
      setAboutVisible(false);
      onNavigate('checklist');
      window.scrollTo({top:0,behavior:'instant'});
    };
    const sectionKey=`kyuan-section-note-v1:${activeTab}:${['checklist','tasks'].includes(activeTab)?role.id:'general'}`;
    const notes=session&&activeTab==='tasks'?taskNotes:jsx(SectionNotes,{noteKey:sectionKey,label:`${page.title}的備註`},sectionKey);
    const context=aboutVisible?page.hint:homeVisible?page.hint:session&&activeTab==='tasks'?session.taskTitle:['checklist','tasks'].includes(activeTab)?roleLabel(role):page.hint;
    const notesBody=jsxs('div',{className:'yw-notes-body',children:[jsx('p',{className:'yw-notes-context',children:context}),notes]});
    const openResponse=()=>{
      if(!chosenRole||chosenRole!==role.id)return;
      setHomeVisible(false);
      setAboutVisible(false);
      const openTemplate=()=>{
        const trigger=Array.from(document.querySelectorAll('#root main button')).find(button=>button.textContent.trim()==='應對範本');
        if(trigger)trigger.click();
        else console.error('Unable to open workplace response templates: the checklist button is unavailable.');
      };
      if(activeTab==='checklist'&&!aboutVisible&&!homeVisible){openTemplate();return}
      onNavigate('checklist');
      window.setTimeout(openTemplate,80);
    };
    return jsxs('div',{id:'yuan-workspace',children:[
      jsxs('section',{className:'yw-topbar',ref:bar,'aria-label':'目前瀏覽位置',children:[
        jsxs('div',{className:'yw-current',children:[jsx('span',{className:'yw-eyebrow',children:'現在瀏覽'}),jsx('h2',{id:'yuan-current-page',children:page.title}),jsx('p',{className:'yw-context',title:context,children:context})]}),
        jsx('div',{className:'yw-top-actions',children:!homeVisible&&jsx('button',{type:'button','data-home':true,onClick:()=>{setAboutVisible(false);setHomeVisible(true);window.scrollTo({top:0,behavior:'instant'})},children:'回首頁'})}),
      ]}),
      jsxs('div',{className:'yw-columns',children:[
        jsxs('div',{className:'yw-content',children:[
          aboutVisible?jsx(KarenAbout,{onBack:()=>{setAboutVisible(false);setHomeVisible(true);window.scrollTo({top:0,behavior:'instant'})}}):homeVisible?jsxs('section',{className:'yw-home','aria-label':'職業與工作協助',children:[
            jsx('figure',{className:'yw-home-illustration',children:jsx('img',{src:'./karen-welcome.png',alt:'凱倫與元元一起查看工作檢核清單的插畫',width:1536,height:1024,loading:'lazy'})}),
            jsx('h2',{children:'今天需要什麼協助？'}),
            jsx('p',{children:'先選擇行業與職業，再點選一項協助。'}),
            jsx(RolePicker,{domains:workspaceDomains,role,onSelectDomain,onSelectRole:next=>{onSelectRole(next);setChosenRole(next.id)},industry,setIndustry:value=>{setIndustry(value);setChosenRole('')},chosenRole}),
            !chosenRole&&jsx('p',{className:'yw-home-hint',children:'選好職業後，即可使用下方工作協助；薪水權益可直接查看。'}),
            jsx(Navigation,{activeTab:null,onNavigate:navigate,onResponse:openResponse,roleReady:!!chosenRole&&chosenRole===role.id}),
            jsx(FeaturedOccupations,{domains:workspaceDomains,onChoose:useFeaturedOccupation}),
          ]}):jsxs(React.Fragment,{children:[
            children,
            jsxs('details',{className:'yw-inline-notes',children:[jsx('summary',{children:'我的備註'}),notesBody]}),
          ]}),
        ]}),
      ]}),
    ]});
  };
}
