(()=>{
  const css=`
  .storePanel{width:330px}
  .storeTitle{padding:2px 3px 11px;border-bottom:1px solid rgba(201,168,106,.24)}
  .storeTitle span{display:block;font-size:8px;letter-spacing:.2em;color:#e0bd77;font-weight:900}
  .storeTitle strong{display:block;margin-top:4px;font:400 22px Georgia,serif;color:#fff}
  .storeList{display:grid;gap:8px;margin-top:11px}
  .storeChoice{width:100%;min-height:50px;padding:9px 11px;display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid rgba(201,168,106,.3);border-radius:12px;background:rgba(255,255,255,.05);color:#fff;text-align:left}
  .storeChoice:hover,.storeChoice:focus-visible{border-color:rgba(240,207,145,.86);background:rgba(255,255,255,.09);outline:none}
  .storeChoice.active{border-color:#e0bd77;background:rgba(224,189,119,.1)}
  .storeChoice b{display:block;font-size:11px}.storeChoice small{display:block;margin-top:3px;color:#aebfb8;font-size:8.5px}
  .storeCheck{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:rgba(224,189,119,.12);color:#e0bd77;font-weight:900}
  .storeNote{margin-top:10px;padding-top:9px;border-top:1px solid rgba(201,168,106,.18);color:#9fb1aa;font-size:8px;line-height:1.5}
  .availabilityBadge{display:inline-flex;align-items:center;gap:5px;margin-top:7px;padding:5px 8px;border-radius:999px;font-size:8px;font-weight:900;letter-spacing:.08em;border:1px solid rgba(255,255,255,.16)}
  .availabilityBadge:before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}
  .availabilityBadge.available{color:#8ee3b7;background:rgba(57,160,106,.12)}
  .availabilityBadge.low{color:#f1cf83;background:rgba(218,167,65,.12)}
  .availabilityBadge.sold{color:#ff9c91;background:rgba(215,83,70,.13)}
  .availabilityBadge.seasonal{color:#e7c37b;background:rgba(224,189,119,.12)}
  .demoAvail{display:inline-flex!important;align-items:center;justify-content:center;margin-left:8px;padding:4px 7px;border-radius:999px;font-size:7px!important;font-weight:900!important;letter-spacing:.06em;border:1px solid rgba(255,255,255,.14)}
  .demoAvail.available{color:#8ee3b7}.demoAvail.low{color:#f1cf83}.demoAvail.sold{color:#ff9c91}.demoAvail.seasonal{color:#e7c37b}
  .storeShort{display:none}
  .newFeatureHighlight{position:relative!important;border-color:#e0bd77!important;background:linear-gradient(180deg,rgba(224,189,119,.2),rgba(255,255,255,.065))!important;box-shadow:0 0 0 1px rgba(224,189,119,.58),0 0 24px rgba(224,189,119,.34),0 8px 22px rgba(0,0,0,.22)!important;animation:newFeatureGlow 2.1s ease-in-out infinite}
  .newFeatureHighlight:after{content:'NEW';position:absolute;top:-10px;right:-8px;z-index:6;padding:3px 6px;border-radius:999px;background:#e0bd77;color:#063f2f;font-size:7px;font-weight:1000;letter-spacing:.08em;line-height:1;box-shadow:0 4px 12px rgba(0,0,0,.3)}
  @keyframes newFeatureGlow{0%,100%{box-shadow:0 0 0 1px rgba(224,189,119,.48),0 0 16px rgba(224,189,119,.25),0 8px 22px rgba(0,0,0,.22)}50%{box-shadow:0 0 0 2px rgba(240,207,145,.82),0 0 32px rgba(240,207,145,.52),0 8px 22px rgba(0,0,0,.22)}}
  @media(prefers-reduced-motion:reduce){.newFeatureHighlight{animation:none}}
  @media(max-width:850px){.storeFull{display:none}.storeShort{display:inline}.storePanel{position:fixed!important;left:3%!important;right:3%!important;top:68px!important;width:auto!important}.newFeatureHighlight:after{top:-8px;right:-5px;font-size:6px;padding:3px 5px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  if(!document.getElementById('hub')){
    const stub=document.createElement('button');stub.id='hub';stub.className='visuallyHidden';stub.tabIndex=-1;stub.setAttribute('aria-hidden','true');document.body.appendChild(stub);
  }

  const stores=[
    {id:'bacoor-demo',name:'Bacoor Demo Store',area:'Prototype pickup location'},
    {id:'imus-demo',name:'Imus Demo Store',area:'Prototype pickup location'},
    {id:'qc-demo',name:'Quezon City Demo Store',area:'Prototype pickup location'}
  ];
  const saved=localStorage.getItem('menuOrbitStore')||stores[0].id;
  let current=stores.find(s=>s.id===saved)||stores[0];
  const orderDrop=document.getElementById('orderPreviewBtn')?.closest('.headerDrop');
  if(!orderDrop)return;
  const wrap=document.createElement('div');wrap.className='headerDrop';wrap.id='storeDrop';
  wrap.innerHTML=`<button class="pill" id="storeBtn" aria-expanded="false"><span class="storeFull">Choose Store</span><span class="storeShort">Store</span></button><div class="headerPopover storePanel" id="storePanel"><div class="storeTitle"><span>PICKUP LOCATION</span><strong>Choose Store</strong></div><div class="storeList" id="storeList"></div><div class="storeNote">Demo locations and availability only. This prototype is not connected to live Starbucks store inventory.</div></div>`;
  orderDrop.parentNode.insertBefore(wrap,orderDrop);
  const btn=document.getElementById('storeBtn'),panel=document.getElementById('storePanel'),list=document.getElementById('storeList');

  ['quickAccessBtn','storeBtn','orderPreviewBtn'].forEach(id=>document.getElementById(id)?.classList.add('newFeatureHighlight'));

  function renderStores(){
    list.innerHTML=stores.map(s=>`<button class="storeChoice${s.id===current.id?' active':''}" data-store="${s.id}"><span><b>${s.name}</b><small>${s.area}</small></span><span class="storeCheck">${s.id===current.id?'✓':'›'}</span></button>`).join('');
    btn.innerHTML=`<span class="storeFull">${current.name.replace(' Demo Store','')}</span><span class="storeShort">Store</span>`;
    list.querySelectorAll('[data-store]').forEach(x=>x.onclick=()=>selectStore(x.dataset.store));
  }
  function close(){panel.classList.remove('open');btn.setAttribute('aria-expanded','false')}
  btn.onclick=e=>{e.stopPropagation();const open=!panel.classList.contains('open');close();if(open){panel.classList.add('open');btn.setAttribute('aria-expanded','true')}};
  panel.onclick=e=>e.stopPropagation();
  document.addEventListener('click',close);
  document.getElementById('quickAccessBtn')?.addEventListener('click',close);
  document.getElementById('orderPreviewBtn')?.addEventListener('click',close);

  function hash(str){let h=0;for(let i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))>>>0;return h}
  function statusFor(name){
    if(/Featured/i.test(name))return {text:'SEASONAL',cls:'seasonal'};
    const n=hash(current.id+'|'+name)%10;
    if(n===0)return {text:'SOLD OUT',cls:'sold'};
    if(n<=2)return {text:'LOW STOCK',cls:'low'};
    return {text:'AVAILABLE',cls:'available'};
  }
  function setHeroStatus(){
    const title=document.getElementById('title');if(!title)return;
    let badge=document.getElementById('heroAvailability');
    if(!badge){badge=document.createElement('div');badge.id='heroAvailability';title.parentElement.appendChild(badge)}
    const s=statusFor(title.textContent.trim());badge.className='availabilityBadge '+s.cls;badge.textContent=s.text+' • '+current.name.replace(' Demo Store','');
  }
  function patchSlides(){
    document.querySelectorAll('#track .slide').forEach(slide=>{
      const name=slide.querySelector('h3')?.textContent?.trim();if(!name)return;
      const s=statusFor(name);const tag=slide.querySelector('.tag.avail');if(tag){tag.textContent=s.text;tag.className='tag avail '+s.cls}
      const add=slide.querySelector('[data-add]');if(add){add.disabled=s.cls==='sold';add.textContent=s.cls==='sold'?'Sold Out at Selected Store':'Add to Order +'}
    });
  }
  function patchResults(){
    document.querySelectorAll('#results .result').forEach(r=>{
      const strong=r.querySelector('strong');if(!strong)return;const name=(strong.childNodes[0]?.textContent||strong.textContent).replace('♥','').trim();const s=statusFor(name);
      let b=r.querySelector('.demoAvail');if(!b){b=document.createElement('span');r.appendChild(b)}b.className='demoAvail '+s.cls;b.textContent=s.text;
    });
  }
  function syncPickup(){const p=document.getElementById('pickupLocation');if(p)p.value=current.name}
  function refresh(){renderStores();setHeroStatus();patchSlides();patchResults();syncPickup()}
  function selectStore(id){current=stores.find(s=>s.id===id)||stores[0];localStorage.setItem('menuOrbitStore',current.id);close();refresh();const t=document.getElementById('toast');if(t){t.textContent='Store set to '+current.name;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1400)}}

  const title=document.getElementById('title');if(title)new MutationObserver(setHeroStatus).observe(title,{childList:true,characterData:true,subtree:true});
  const track=document.getElementById('track');if(track)new MutationObserver(()=>setTimeout(patchSlides,0)).observe(track,{childList:true,subtree:true});
  const results=document.getElementById('results');if(results)new MutationObserver(()=>setTimeout(patchResults,0)).observe(results,{childList:true,subtree:true});
  document.getElementById('checkoutBtn')?.addEventListener('click',()=>setTimeout(syncPickup,0));
  refresh();

  const loadFinish=()=>{
    if(document.querySelector('script[data-menu-finish]'))return;
    const s=document.createElement('script');
    s.src='./menu-orbit-pro-finish.js?v=427b5aa';
    s.dataset.menuFinish='1';
    document.body.appendChild(s);
  };
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',loadFinish,{once:true});else loadFinish();
})();