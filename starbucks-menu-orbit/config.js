window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Customer orbit cleanup: permanently remove only the upper-left MENU shortcut. */
(() => {
  const hideStyle=document.createElement('style');
  hideStyle.textContent='#menuMainBtnV61{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  document.head.appendChild(hideStyle);
  const removeUpperLeftMenu=()=>document.getElementById('menuMainBtnV61')?.remove();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeUpperLeftMenu,{once:true});else removeUpperLeftMenu();
  new MutationObserver(removeUpperLeftMenu).observe(document.documentElement,{childList:true,subtree:true});
})();

/* Main orbit center: Tap Home only. */
(() => {
  const style=document.createElement('style');
  style.textContent=`
    #navOrbitCenter.smart-center{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important}
    #navOrbitCenter .smart-home-label{display:block!important;font:900 14px/1.1 system-ui!important;color:#f4d992!important;letter-spacing:.10em!important;text-transform:uppercase!important;margin:0!important}
    @media(max-width:430px){#navOrbitCenter .smart-home-label{font-size:12px!important}}
  `;
  document.head.appendChild(style);

  const applyCenter=()=>{
    const el=document.getElementById('navOrbitCenter');
    if(!el||!el.classList.contains('smart-center'))return;
    if(el.querySelector('.smart-home-label')&&!el.querySelector('.smart-brand-s'))return;
    const badges=[...el.querySelectorAll('.smart-badge')].map(n=>n.outerHTML).join('');
    el.innerHTML='<span class="smart-home-label">Tap Home</span><i class="hold-progress" aria-hidden="true"></i>'+badges;
    el.setAttribute('aria-label','Tap Home');
  };
  const start=()=>{
    applyCenter();
    const target=document.getElementById('navOrbitCenter');
    if(target)new MutationObserver(applyCenter).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    new MutationObserver(applyCenter).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* V84: keep MY ACCOUNT permanently visible as a main orbit circle. */
(() => {
  const path=location.pathname.toLowerCase();
  const isCustomerMenu=path.endsWith('/starbucks-menu-orbit/')||path.endsWith('/starbucks-menu-orbit/index.html');
  if(!isCustomerMenu)return;

  const style=document.createElement('style');
  style.textContent=`
    #mainMenuDirect #mainSubmenuDirect>button[data-main-key="account"]{
      display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;
      align-items:center!important;justify-content:center!important;flex-direction:column!important;z-index:28!important;
    }
  `;
  document.head.appendChild(style);

  const mainIsShowing=()=>{
    const host=document.getElementById('mainSubmenuDirect');
    if(!host)return false;
    if(host.querySelector('button[data-main-key]'))return true;
    const crumb=(document.getElementById('orbitBreadcrumb')?.textContent||'').trim().toUpperCase();
    return crumb==='MENU ORBIT';
  };

  const openAccount=()=>{
    if(window.CustomerLoginV66?.open){window.CustomerLoginV66.open();return}
    const legacy=document.getElementById('customerAccountBtn');
    if(legacy){legacy.click();return}
    document.querySelector('.customer-footer [data-footer-action="account"]')?.click();
  };

  let applying=false;
  const ensureAccount=()=>{
    if(applying||!mainIsShowing())return;
    const host=document.getElementById('mainSubmenuDirect');
    if(!host)return;
    applying=true;
    let account=host.querySelector('button[data-main-key="account"]');
    if(!account){
      account=document.createElement('button');
      account.type='button';
      account.dataset.mainKey='account';
      account.className='main-orbit-node';
      account.setAttribute('aria-label','MY ACCOUNT');
      account.innerHTML='<span style="font-size:24px;display:block;margin-bottom:4px">👤</span>MY ACCOUNT';
      account.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openAccount()});
      host.appendChild(account);
    }
    account.hidden=false;
    account.style.setProperty('display','flex','important');
    account.style.setProperty('visibility','visible','important');
    account.style.setProperty('opacity','1','important');
    account.style.setProperty('pointer-events','auto','important');
    account.style.setProperty('z-index','28','important');
    if(window.matchMedia('(max-width:700px)').matches){
      account.style.setProperty('position','absolute','important');
      account.style.setProperty('left','17%','important');
      account.style.setProperty('top','64%','important');
      account.style.setProperty('width','72px','important');
      account.style.setProperty('height','72px','important');
      account.style.setProperty('min-height','72px','important');
      account.style.setProperty('font-size','9px','important');
    }
    applying=false;
  };

  let queued=false;
  const schedule=()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>setTimeout(()=>{queued=false;ensureAccount()},80));
  };
  const start=()=>{
    ensureAccount();
    const host=document.getElementById('mainSubmenuDirect');
    if(host)new MutationObserver(schedule).observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden']});
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('resize',schedule);
    window.addEventListener('orientationchange',()=>setTimeout(schedule,180));
    setInterval(ensureAccount,1000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* V85: closing MY ACCOUNT always returns to the main orbit instead of the bare background. */
(() => {
  const path=location.pathname.toLowerCase();
  const isCustomerMenu=path.endsWith('/starbucks-menu-orbit/')||path.endsWith('/starbucks-menu-orbit/index.html');
  if(!isCustomerMenu)return;

  const restoreMainOrbit=()=>{
    document.body.classList.remove('show-product-results','product-detail-open');
    const main=document.getElementById('mainMenuDirect');
    if(main){
      main.style.setProperty('display','block','important');
      main.style.setProperty('visibility','visible','important');
      main.style.setProperty('opacity','1','important');
      main.style.setProperty('pointer-events','auto','important');
      requestAnimationFrame(()=>setTimeout(()=>{
        main.style.removeProperty('display');
        main.style.removeProperty('visibility');
        main.style.removeProperty('opacity');
        main.style.removeProperty('pointer-events');
      },120));
    }
    const detail=document.getElementById('detail');
    detail?.classList.remove('open');
    document.querySelectorAll('.modal.open').forEach(m=>{if(m.id!=='customerLoginV66')m.classList.remove('open')});
    const host=document.getElementById('mainSubmenuDirect');
    if(host&&!host.querySelector('button[data-main-key]')){
      const center=document.getElementById('navOrbitCenter');
      if(center)setTimeout(()=>center.click(),30);
    }
  };

  const start=()=>{
    const modal=document.getElementById('customerLoginV66');
    if(!modal)return;
    let wasOpen=modal.classList.contains('open');
    const check=()=>{
      const isOpen=modal.classList.contains('open');
      if(wasOpen&&!isOpen)setTimeout(restoreMainOrbit,20);
      wasOpen=isOpen;
    };
    new MutationObserver(check).observe(modal,{attributes:true,attributeFilter:['class']});
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#cl66Close'))setTimeout(restoreMainOrbit,40);
    },true);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))setTimeout(restoreMainOrbit,40)},true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Shared portal guard: customer navigation belongs only on the customer Menu Orbit. */
(() => {
  const path=location.pathname.toLowerCase();
  const isCustomerMenu=path.endsWith('/starbucks-menu-orbit/')||path.endsWith('/starbucks-menu-orbit/index.html');
  const isStaffPortal=/\/(manager|staff|cashier|seller-center|staff-operations-center)\.html$/.test(path);
  const style=document.createElement('style');
  style.textContent=`
    #gestureBtn,[id*="gestureBtn"],.gesture-box,#gestureBox,.hand-cursor,#handCursor,.control-dock,.instructions{display:none!important;visibility:hidden!important;pointer-events:none!important}
    .product{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}
    .product .photo,.product .photo *{pointer-events:none!important}
    ${isStaffPortal?'.customer-footer{display:none!important;visibility:hidden!important;pointer-events:none!important}':''}
    ${isCustomerMenu?`.customer-footer{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:30;width:min(92vw,560px);height:66px;padding:7px 10px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;background:rgba(4,28,20,.82);backdrop-filter:blur(22px) saturate(125%);-webkit-backdrop-filter:blur(22px) saturate(125%);border:1px solid rgba(212,173,98,.34);border-radius:999px;box-shadow:0 14px 40px rgba(0,0,0,.40),inset 0 1px 0 rgba(255,255,255,.06)}.customer-footer::before{content:"";position:absolute;left:14%;right:14%;top:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(244,200,111,.72),transparent);pointer-events:none}.customer-footer button{position:relative;min-width:0;border:0;border-radius:999px;background:transparent;color:#cbd9d2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10.5px;font-weight:800;padding:5px 3px}.customer-footer button.active{color:#fff8e9;background:rgba(255,255,255,.07)}.customer-footer button.active::after{content:"";position:absolute;bottom:3px;width:24px;height:2px;border-radius:99px;background:#d4ad62}.customer-footer .footer-icon{font-size:19px;line-height:1}.stage{bottom:94px!important}@media(max-width:520px){.customer-footer{width:calc(100% - 24px);height:64px;bottom:calc(10px + env(safe-area-inset-bottom));padding:6px 8px}.stage{bottom:86px!important}}`:''}
  `;
  document.head.appendChild(style);

  const installFooter=()=>{
    document.querySelectorAll('.customer-footer').forEach(n=>n.remove());
    if(!isCustomerMenu)return;
    const footer=document.createElement('nav');
    footer.className='customer-footer';footer.setAttribute('aria-label','Customer navigation');
    footer.innerHTML=`<button type="button" data-footer-action="menu" class="active"><span class="footer-icon">◉</span><span>Menu</span></button><button type="button" data-footer-action="pickup"><span class="footer-icon">⌖</span><span>Pickup</span></button><button type="button" data-footer-action="cart"><span class="footer-icon">▣</span><span>Cart</span></button><button type="button" data-footer-action="account"><span class="footer-icon">◌</span><span>Account</span></button>`;
    footer.addEventListener('click',e=>{const btn=e.target.closest('button[data-footer-action]');if(!btn)return;footer.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));const a=btn.dataset.footerAction;if(a==='menu'){document.querySelector('#detail')?.classList.remove('open');document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));return}if(a==='pickup')document.querySelector('#pickupBtn')?.click();if(a==='cart')document.querySelector('#cartBtn')?.click();if(a==='account')document.querySelector('#customerAccountBtn')?.click()});
    document.body.appendChild(footer);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installFooter,{once:true});else installFooter();

  /* Manager STAFF hard-route. Works even after manager.html re-renders its nav. */
  if(path.endsWith('/manager.html')){
    const routeStaff=e=>{
      const b=e.target.closest?.('[data-tab="staff"]');
      if(!b)return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.assign('./staff-operations-center.html?v=20260915c');
    };
    document.addEventListener('pointerup',routeStaff,true);
    document.addEventListener('click',routeStaff,true);
    document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('[data-tab="staff"]'))routeStaff(e)},true);
  }
})();

/* Product interaction repair. */
(() => {
  const productFromEvent=e=>e.target?.closest?.('.product[data-id]');
  document.addEventListener('click',e=>{const card=productFromEvent(e);if(!card)return;e.stopPropagation()},false);
  document.addEventListener('keydown',e=>{const card=productFromEvent(e);if(!card||!['Enter',' '].includes(e.key))return;e.preventDefault();card.click()},false);
})();

/* Shared order → inventory automation. */
(() => {if(document.querySelector('script[data-menu-orbit-inventory-engine]'))return;const script=document.createElement('script');script.src='inventory-engine.js?v=20260911a';script.defer=true;script.dataset.menuOrbitInventoryEngine='true';document.head.appendChild(script)})();

/* Additive Study Seat upgrade. */
(() => {if(document.querySelector('script[data-menu-orbit-study-upgrade]'))return;const script=document.createElement('script');script.src='study-seat-upgrade.js?v=20260912b';script.defer=true;script.dataset.menuOrbitStudyUpgrade='true';document.head.appendChild(script)})();

/* Legacy slot-lock guard. */
(() => {if(document.querySelector('script[data-menu-orbit-study-lock]'))return;const script=document.createElement('script');script.src='study-seat-final-lock.js?v=20260912b';script.defer=true;script.dataset.menuOrbitStudyLock='true';document.head.appendChild(script)})();