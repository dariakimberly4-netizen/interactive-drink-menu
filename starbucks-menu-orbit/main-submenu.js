(()=>{
if(window.__moMainMenu)return;window.__moMainMenu=true;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const style=document.createElement('style');style.textContent=`
.mo-mainmenu-wrap{position:relative;z-index:130;padding:8px 12px 0;background:linear-gradient(180deg,rgba(4,24,17,.96),rgba(4,24,17,.82));border-bottom:1px solid rgba(255,255,255,.08)}
.mo-mainmenu{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;max-width:1180px;margin:0 auto}
.mo-main-btn{min-height:48px;border:1px solid rgba(255,255,255,.12);border-radius:15px;background:rgba(255,255,255,.05);color:#fff;font-weight:950;font-size:12px;letter-spacing:.02em;padding:7px 8px;position:relative}
.mo-main-btn span{display:block;font-size:17px;margin-bottom:2px}.mo-main-btn.active{background:#f4efe6;color:#07331f;border-color:#f4c86f;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.mo-suborbit-shell{display:none;max-width:1180px;margin:8px auto 0;padding:8px 0 10px}.mo-suborbit-shell.open{display:block}
.mo-suborbit{display:flex;gap:8px;overflow:auto;scrollbar-width:none;padding:2px 1px}.mo-suborbit::-webkit-scrollbar{display:none}
.mo-sub-btn{white-space:nowrap;min-height:40px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.06);color:#e8f1ed;padding:0 13px;font-weight:850;font-size:11px}
.mo-sub-btn:hover{background:rgba(255,255,255,.12)}.mo-sub-btn strong{color:#f4c86f;margin-right:5px}
.mo-mainmenu-note{font-size:10px;color:#93a99f;text-align:center;padding:1px 0 2px}
body.mo-mainmenu-ready .toolbar{padding-top:7px}
body.mo-mainmenu-ready .stage{top:184px}
@media(max-width:800px){.mo-mainmenu{grid-template-columns:repeat(3,1fr)}.mo-main-btn{min-height:46px;font-size:10px}.mo-main-btn span{font-size:15px}.mo-suborbit-shell{padding-bottom:7px}.mo-sub-btn{font-size:10px}.mo-mainmenu-wrap{padding-left:8px;padding-right:8px}body.mo-mainmenu-ready .stage{top:242px}}
@media(max-width:430px){.mo-mainmenu{gap:6px}.mo-main-btn{padding:6px 4px}.mo-mainmenu-note{display:none}body.mo-mainmenu-ready .stage{top:232px}}
`;document.head.appendChild(style);

const menus={
 'MENU':[
  ['Featured',()=>clickCat('Featured')],['Drinks',()=>clickFirstCat(['Espresso','Brewed Coffee','Refreshers','Chocolate','Frappuccino'])],['Food',()=>clickFirstCat(['Featured','Bakery','Food'])],['Favorites',()=>clickCat('Favorites')],['Search',()=>click('#searchBtn')],['Trending',()=>click('#moTrending')],['Visual Search',()=>click('#moVisualSearch')],['Diet Filters',()=>click('#moDiet')],['Compare Drinks',()=>click('#moCompare')]
 ],
 'MY ORDER':[
  ['Cart',()=>click('#cartBtn')],['Saved for Later',()=>click('#moSavedLater')],['Your Usual',()=>click('#moUsual')],['Scheduled Order',()=>click('#moSchedule')],['Gift Order',()=>click('#moGiftOrder')],['Group Order',()=>click('#moGroupOrder')],['Share Cart',()=>click('#moShareCart')],['Pickup ETA',()=>click('#moDynamicEta')],['Receipts',()=>click('#moReceiptsBtn')],['Order Chat',()=>click('#moOrderChat')],['Order Help',()=>click('#moProblem')]
 ],
 'STORES':[
  ['Find a Store',()=>click('#pickupBtn')],['Selected Branch',()=>click('#moBranch')],['Compare Branches',()=>click('#moBranchCompare')],['Branch Profile',()=>click('#moBranch')],['Branch Deals',()=>click('#moBranch')],['Follow Branch',()=>click('#moBranch')]
 ],
 'REWARDS':[
  ['Star Rewards',()=>click('#rewardsBtn')],['Milestones',()=>click('#moLoyalty')],['Voucher Countdown',()=>click('#moVoucherTimer')],['Deal Reminders',()=>click('#moDealReminders')],['Pairings',()=>click('#moPairings')],['Inbox',()=>click('#moInbox')]
 ],
 'MY ACCOUNT':[
  ['Profile',()=>click('#moProfileDash')],['Order History',()=>click('#moReceiptsBtn')],['Favorites',()=>clickCat('Favorites')],['Saved Payments',()=>click('#moPayments')],['Search History',()=>click('#moSearchHistory')],['Notifications',()=>click('#moNotifPrefs')],['Review Filters',()=>click('#moReviewFilters')]
 ],
 'SETTINGS':[
  ['Reduce Motion',()=>click('#motionBtn')],['Gestures',()=>click('#gestureBtn')],['Voice Control',()=>click('#voiceCta')],['Help & Support',()=>click('#helpBtn')],['Presentation Mode',()=>click('#moPresentationBtn')]
 ]
};
const icons={'MENU':'☕','MY ORDER':'🛒','STORES':'📍','REWARDS':'★','MY ACCOUNT':'👤','SETTINGS':'⚙'};

function click(sel){const el=$(sel);if(el){el.click();return true}toast('This feature is loading. Try again in a moment.');return false}
function clickCat(name){const b=[...document.querySelectorAll('[data-cat]')].find(x=>x.dataset.cat===name||x.textContent.trim()===name);if(b)b.click();else toast(name+' is not available in this menu view.')}
function clickFirstCat(names){for(const n of names){const b=[...document.querySelectorAll('[data-cat]')].find(x=>x.dataset.cat===n||x.textContent.trim()===n);if(b){b.click();return}}toast('Category is not available in this menu view.')}
function toast(t){let e=$('#moMainMenuToast');if(!e){e=document.createElement('div');e.id='moMainMenuToast';e.style.cssText='position:fixed;z-index:220;left:50%;bottom:80px;transform:translateX(-50%);background:#f4efe6;color:#07331f;padding:10px 14px;border-radius:999px;font-weight:900;box-shadow:0 12px 32px rgba(0,0,0,.35)';document.body.appendChild(e)}e.textContent=t;clearTimeout(e._t);e._t=setTimeout(()=>e.remove(),2200)}
function openMenu(name){
 const shell=$('#moSuborbitShell'),sub=$('#moSuborbit');if(!shell||!sub)return;
 $$('.mo-main-btn').forEach(b=>b.classList.toggle('active',b.dataset.main===name));
 sub.innerHTML=menus[name].map((x,i)=>'<button class="mo-sub-btn" data-subindex="'+i+'"><strong>•</strong>'+esc(x[0])+'</button>').join('');
 sub.querySelectorAll('[data-subindex]').forEach(b=>b.onclick=()=>menus[name][+b.dataset.subindex][1]());
 shell.classList.add('open');$('#moMainMenuNote').textContent=name+' • choose a submenu';
}
function init(){
 const categories=$('#categories');if(!categories||$('#moMainMenuWrap'))return;
 const wrap=document.createElement('section');wrap.id='moMainMenuWrap';wrap.className='mo-mainmenu-wrap';
 wrap.innerHTML='<nav class="mo-mainmenu" aria-label="Main customer menu">'+Object.keys(menus).map(name=>'<button class="mo-main-btn" data-main="'+name+'"><span>'+icons[name]+'</span>'+name+'</button>').join('')+'</nav><div class="mo-suborbit-shell" id="moSuborbitShell"><div class="mo-suborbit" id="moSuborbit"></div><div class="mo-mainmenu-note" id="moMainMenuNote">Choose a main menu</div></div>';
 categories.parentNode.insertBefore(wrap,categories);
 wrap.querySelectorAll('[data-main]').forEach(b=>b.onclick=()=>{const same=b.classList.contains('active');if(same){$('#moSuborbitShell').classList.toggle('open');return}openMenu(b.dataset.main)});
 document.body.classList.add('mo-mainmenu-ready');
 window.NewFeatureHighlight?.register('#moMainMenuWrap','customer-main-menu-v1','NEW');
 openMenu('MENU');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,1300));else setTimeout(init,1300);
})();