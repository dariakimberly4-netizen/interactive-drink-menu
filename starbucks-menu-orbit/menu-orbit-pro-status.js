(()=>{
  const css=`
  .statusLayer{z-index:410!important}
  .statusSheet{width:min(680px,94vw);max-height:88vh;overflow:auto;margin:auto;padding:22px;border:1px solid rgba(224,189,119,.48);border-radius:24px;background:linear-gradient(180deg,#062d23,#03251d);box-shadow:0 28px 80px rgba(0,0,0,.55)}
  .statusHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:15px;border-bottom:1px solid rgba(224,189,119,.25)}
  .statusEyebrow{color:#f0cf91;font-size:8px;font-weight:1000;letter-spacing:.18em;text-transform:uppercase}
  .statusHead h2{margin:5px 0 0;font:400 30px Georgia,serif;color:#fff}
  .statusClose{width:40px;height:40px;border-radius:50%;border:1px solid rgba(224,189,119,.42);background:rgba(255,255,255,.05);color:#fff;font-size:23px;cursor:pointer}
  .statusOrder{margin:14px 0;padding:12px 14px;border:1px solid rgba(224,189,119,.24);border-radius:14px;background:rgba(224,189,119,.07);display:flex;justify-content:space-between;gap:12px;align-items:center}
  .statusOrder strong{display:block;color:#fff;font-size:13px}.statusOrder small{display:block;margin-top:4px;color:#b8c7c1;font-size:9px}.statusCode{color:#f0cf91;font-size:12px;font-weight:1000;letter-spacing:.08em;white-space:nowrap}
  .statusSteps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}
  .statusStep{position:relative;padding:15px 10px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:rgba(255,255,255,.04);text-align:center;opacity:.48}
  .statusStep.active,.statusStep.done{opacity:1;border-color:rgba(224,189,119,.5)}
  .statusStep.active{background:rgba(224,189,119,.10);box-shadow:0 0 24px rgba(224,189,119,.12)}
  .statusDot{width:34px;height:34px;margin:0 auto 9px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(224,189,119,.42);color:#f0cf91;font-weight:1000;background:#063f2f}
  .statusStep.done .statusDot,.statusStep.active .statusDot{background:#e0bd77;color:#063f2f;border-color:#e0bd77}
  .statusStep strong{display:block;color:#fff;font-size:11px}.statusStep small{display:block;margin-top:4px;color:#aebfb8;font-size:8.5px;line-height:1.4}
  .statusNow{padding:14px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);color:#d6e0dc;font-size:10px;line-height:1.55}.statusNow b{color:#fff}
  .statusDemo{margin-top:10px;text-align:center;color:#8fa39b;font-size:8px;line-height:1.5}
  .quickAction.statusNew{border-color:rgba(240,207,145,.62)!important;background:rgba(224,189,119,.08)!important}
  @media(max-width:560px){.statusSheet{padding:16px;border-radius:20px}.statusHead h2{font-size:24px}.statusSteps{grid-template-columns:1fr}.statusStep{text-align:left;display:grid;grid-template-columns:42px 1fr;align-items:center;column-gap:10px}.statusDot{margin:0}.statusStep small{margin-top:2px}.statusOrder{display:block}.statusCode{display:block;margin-top:8px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const $=id=>document.getElementById(id);
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
  const toast=t=>{const el=$('toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1500)};

  const layer=document.createElement('div');layer.className='layer statusLayer';layer.id='statusLayer';
  layer.innerHTML=`<section class="statusSheet" role="dialog" aria-modal="true" aria-labelledby="statusTitle"><div class="statusHead"><div><div class="statusEyebrow">PROTOTYPE TRACKING</div><h2 id="statusTitle">Order Status</h2></div><button class="statusClose" id="statusClose" aria-label="Close">×</button></div><div id="statusBody"></div></section>`;
  document.body.appendChild(layer);

  function currentOrder(){
    const receipt=read('menuOrbitLastReceipt',null),last=read('menuOrbitLastOrder',null);
    return receipt||last;
  }
  function stageFor(o){
    if(!o?.date)return 0;
    const seconds=Math.max(0,(Date.now()-new Date(o.date).getTime())/1000);
    if(seconds<30)return 0;
    if(seconds<90)return 1;
    return 2;
  }
  function render(){
    const o=currentOrder();
    const body=$('statusBody');if(!body)return;
    if(!o){body.innerHTML='<div class="statusNow"><b>No completed prototype order yet.</b><br>Complete checkout first, then return here to track its demo status.</div>';return}
    const stage=stageFor(o);
    const labels=[['Received','Order accepted'],['Preparing','Your items are being prepared'],['Ready for Pickup','Your order is ready']];
    const store=o.store||$('pickupLocation')?.value||'Selected Demo Store';
    const stageText=stage===0?'Your prototype order has been received.':stage===1?'Your prototype order is being prepared.':'Your prototype order is ready for pickup.';
    body.innerHTML=`<div class="statusOrder"><div><strong>${o.name||'Guest'}</strong><small>${store}</small></div><span class="statusCode">${o.code||'PROTOTYPE'}</span></div><div class="statusSteps">${labels.map((x,i)=>`<div class="statusStep ${i<stage?'done':i===stage?'active':''}"><div class="statusDot">${i<stage?'✓':i+1}</div><div><strong>${x[0]}</strong><small>${x[1]}</small></div></div>`).join('')}</div><div class="statusNow"><b>Current status: ${labels[stage][0]}</b><br>${stageText}</div><div class="statusDemo">Demo timing only: Received → Preparing → Ready for Pickup. This is not connected to Starbucks store systems.</div>`;
  }
  function openStatus(){render();layer.classList.add('open');document.body.classList.add('lock')}
  function closeStatus(){layer.classList.remove('open');const ids=['cinema','searchLayer','cartLayer','checkoutLayer','reviewLayer','loyaltyLayer'];if(!ids.some(id=>$(id)?.classList.contains('open')))document.body.classList.remove('lock')}
  $('statusClose').onclick=closeStatus;layer.onclick=e=>{if(e.target===layer)closeStatus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer.classList.contains('open'))closeStatus()});

  // Add to Quick Access.
  const myOrderGroup=[...document.querySelectorAll('.quickGroup')].find(g=>g.querySelector('.quickGroupLabel')?.textContent.trim().toLowerCase()==='my order');
  const grid=myOrderGroup?.querySelector('.quickGrid');
  if(grid&&!$('sideStatus')){
    const checkout=$('sideCheckout');
    const b=document.createElement('button');b.className='quickAction statusNew';b.id='sideStatus';b.innerHTML='<span class="ico">●</span><span>Order Status</span>';
    if(checkout)grid.insertBefore(b,checkout);else grid.appendChild(b);
    b.onclick=()=>{document.getElementById('quickAccessPanel')?.classList.remove('open');openStatus()};
  }

  // Add to visible New Features strip.
  const bar=document.querySelector('.newFeaturesBar');
  if(bar&&!$('featureStatus')){
    const b=document.createElement('button');b.className='newFeatureChip';b.id='featureStatus';b.innerHTML='<b>Order Status</b> • Received → Ready';bar.appendChild(b);b.onclick=openStatus;
  }

  // Add a Track Order button to the confirmation screen.
  const success=$('success');
  if(success&&!$('trackOrderBtn')){
    const done=$('doneBtn');
    const b=document.createElement('button');b.className='full checkoutBtn';b.id='trackOrderBtn';b.textContent='Track Order';
    if(done)success.insertBefore(b,done);else success.appendChild(b);
    b.onclick=openStatus;
  }

  // Keep an open tracker current.
  setInterval(()=>{if(layer.classList.contains('open'))render()},5000);
  window.menuOrbitOpenStatus=openStatus;
})();