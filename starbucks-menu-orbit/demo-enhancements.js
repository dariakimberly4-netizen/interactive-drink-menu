(()=>{
  if(window.__orbitDemoTour)return;
  window.__orbitDemoTour=true;

  const style=document.createElement('style');
  style.textContent=`
    .demo-new-badge{position:absolute;z-index:99;transform:translate(-50%,-100%);padding:5px 8px;border-radius:999px;background:#f4c86f;color:#07331f;font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.09em;box-shadow:0 10px 25px rgba(0,0,0,.32);pointer-events:none;white-space:nowrap}
    .demo-highlight{position:relative!important;box-shadow:0 0 0 3px #f4c86f,0 0 0 9px rgba(244,200,111,.2),0 14px 38px rgba(0,0,0,.35)!important}
    #demoTourBtn{position:fixed;right:16px;bottom:84px;z-index:130;min-height:48px;border:1px solid rgba(244,200,111,.75);border-radius:999px;background:linear-gradient(135deg,#f4efe6,#f4c86f);color:#07331f;padding:0 16px;font-weight:950;letter-spacing:.04em;box-shadow:0 14px 36px rgba(0,0,0,.38)}
    #demoTour{position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.67);backdrop-filter:blur(8px)}
    #demoTour.open{display:flex}
    .dt-card{width:min(680px,100%);border:1px solid rgba(255,255,255,.14);border-radius:28px;background:linear-gradient(180deg,#0a3124,#061c14);padding:22px;box-shadow:0 35px 90px rgba(0,0,0,.55)}
    .dt-head{display:flex;gap:12px;align-items:flex-start}.dt-head>div{flex:1}.dt-kicker{font-size:11px;letter-spacing:.18em;color:#f4c86f;font-weight:950;text-transform:uppercase}.dt-card h2{font:700 clamp(27px,5vw,44px)/1.05 Georgia,serif;margin:5px 0 9px}.dt-card p{color:#bfd0c7;line-height:1.55;margin:0}
    .dt-close{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.07);color:#fff;font-size:22px}
    .dt-progress{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin:20px 0}.dt-progress i{height:6px;border-radius:99px;background:rgba(255,255,255,.12)}.dt-progress i.on{background:linear-gradient(90deg,#00a862,#f4c86f)}
    .dt-feature{border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:17px;background:rgba(255,255,255,.045)}.dt-feature b{display:block;font-size:20px;margin-bottom:6px}.dt-feature small{display:block;color:#a9beb3;line-height:1.5}
    .dt-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px}.dt-actions button{min-height:50px;border-radius:15px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:#fff;font-weight:900}.dt-actions button.primary{background:linear-gradient(135deg,#00a862,#00754a)}
    @media(max-width:700px){#demoTourBtn{right:10px;bottom:132px;font-size:11px;padding:0 13px}.dt-actions{grid-template-columns:1fr}.dt-card{padding:18px}}
  `;
  document.head.appendChild(style);

  const features=[
    {title:'Product Customization',text:'Open any drink to show size, milk, shots, toppings, notes, favorites, and add-to-order.',target:'#detail',action:()=>window.openDetail?.('caramel-macchiato')},
    {title:'Cart + Demo Checkout',text:'Show quantity editing, rewards, savings, and a clear demo checkout flow.',target:'#cartBtn',action:()=>window.openCart?.()},
    {title:'Pickup Experience',text:'Choose a pickup branch and pickup time before placing the demo order.',target:'#pickupBtn',action:()=>window.openPickup?.()},
    {title:'Star Rewards',text:'Show member Stars, progress, free-drink rewards, and checkout integration.',target:'#rewardsBtn',action:()=>window.openRewards?.()},
    {title:'Coffee Hub',text:'Open Discover, vouchers, orders, community features, and support from one demo hub.',target:'#hubChip',action:()=>window.openHub?.('home')}
  ];

  let step=0;
  const btn=document.createElement('button');
  btn.id='demoTourBtn';
  btn.type='button';
  btn.innerHTML='✦ NEW DEMO FEATURES';
  document.body.appendChild(btn);

  const tour=document.createElement('div');
  tour.id='demoTour';
  tour.innerHTML=`<div class="dt-card" role="dialog" aria-modal="true" aria-labelledby="dtTitle">
    <div class="dt-head"><div><div class="dt-kicker">Demo Presenter Mode</div><h2 id="dtTitle"></h2><p id="dtText"></p></div><button class="dt-close" aria-label="Close">×</button></div>
    <div class="dt-progress"></div>
    <div class="dt-feature"><b id="dtFeature"></b><small id="dtSmall"></small></div>
    <div class="dt-actions"><button id="dtPrev">← Previous</button><button id="dtShow" class="primary">Show this feature</button><button id="dtNext">Next →</button><button id="dtReset">Reset demo data</button></div>
  </div>`;
  document.body.appendChild(tour);

  const clearHighlight=()=>{
    document.querySelectorAll('.demo-highlight').forEach(el=>el.classList.remove('demo-highlight'));
    document.querySelectorAll('.demo-new-badge').forEach(el=>el.remove());
  };
  const highlightTarget=()=>{
    clearHighlight();
    const el=document.querySelector(features[step].target);
    if(!el)return;
    el.classList.add('demo-highlight');
    const r=el.getBoundingClientRect();
    const badge=document.createElement('div');
    badge.className='demo-new-badge';
    badge.textContent='NEW';
    badge.style.left=Math.min(window.innerWidth-45,Math.max(45,r.left+r.width/2))+'px';
    badge.style.top=Math.max(28,r.top-6)+'px';
    document.body.appendChild(badge);
    setTimeout(clearHighlight,2600);
  };
  const render=()=>{
    const f=features[step];
    document.getElementById('dtTitle').textContent='What’s new in this demo';
    document.getElementById('dtText').textContent='Use this presenter tour to highlight the features added around the existing Menu Orbit.';
    document.getElementById('dtFeature').textContent=(step+1)+'. '+f.title;
    document.getElementById('dtSmall').textContent=f.text;
    document.querySelector('.dt-progress').innerHTML=features.map((_,i)=>'<i class="'+(i<=step?'on':'')+'"></i>').join('');
    document.getElementById('dtPrev').disabled=step===0;
    document.getElementById('dtNext').textContent=step===features.length-1?'Finish':'Next →';
  };

  btn.onclick=()=>{step=0;render();tour.classList.add('open')};
  tour.querySelector('.dt-close').onclick=()=>{tour.classList.remove('open');clearHighlight()};
  tour.onclick=e=>{if(e.target===tour){tour.classList.remove('open');clearHighlight()}};
  document.getElementById('dtPrev').onclick=()=>{step=Math.max(0,step-1);render()};
  document.getElementById('dtNext').onclick=()=>{if(step>=features.length-1){tour.classList.remove('open');clearHighlight()}else{step++;render()}};
  document.getElementById('dtShow').onclick=()=>{
    const f=features[step];
    tour.classList.remove('open');
    setTimeout(()=>{f.action?.();highlightTarget()},120);
  };
  document.getElementById('dtReset').onclick=()=>{
    ['menuOrbitCart','menuOrbitPickup','menuOrbitFavorites','menuOrbitLastOrder','menuOrbitPromo','menuOrbitOrders','menuOrbitCommerce','starRewardsMember','starRewardsAudit'].forEach(k=>localStorage.removeItem(k));
    window.NewFeatureHighlight?.reset();
    sessionStorage.clear();
    location.reload();
  };

  setTimeout(()=>{
    const registry=[
      ['#cartBtn','menu-orbit-cart-checkout-v1'],
      ['#pickupBtn','menu-orbit-pickup-v1'],
      ['#rewardsBtn','menu-orbit-star-rewards-v1'],
      ['#hubChip','menu-orbit-coffee-hub-v1']
    ];
    registry.forEach(([sel,key])=>window.NewFeatureHighlight?.register(sel,key,'NEW'));
  },500);
})();