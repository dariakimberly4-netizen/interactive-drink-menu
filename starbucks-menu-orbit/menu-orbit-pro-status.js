(()=>{
  const css=`
  .statusLayer{z-index:410!important}
  .statusSheet{width:min(680px,94vw);max-height:88vh;overflow:auto;margin:auto;padding:22px;border:1px solid rgba(224,189,119,.62);border-radius:24px;background:linear-gradient(180deg,#062d23,#03251d);box-shadow:0 28px 80px rgba(0,0,0,.55),0 0 34px rgba(224,189,119,.10)}
  .statusHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:15px;border-bottom:1px solid rgba(224,189,119,.32)}
  .statusEyebrow{color:#f0cf91;font-size:9px;font-weight:1000;letter-spacing:.18em;text-transform:uppercase}
  .statusHead h2{margin:5px 0 0;font:400 30px Georgia,serif;color:#fff}
  .statusClose{width:40px;height:40px;border-radius:50%;border:1px solid rgba(224,189,119,.5);background:rgba(255,255,255,.05);color:#fff;font-size:23px;cursor:pointer}
  .statusOrder{margin:14px 0;padding:12px 14px;border:1px solid rgba(224,189,119,.3);border-radius:14px;background:rgba(224,189,119,.08);display:flex;justify-content:space-between;gap:12px;align-items:center}
  .statusOrder strong{display:block;color:#fff;font-size:13px}.statusOrder small{display:block;margin-top:4px;color:#c5d2cd;font-size:9.5px}.statusCode{color:#f5d995;font-size:12px;font-weight:1000;letter-spacing:.08em;white-space:nowrap}
  .statusSteps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}
  .statusStep{position:relative;padding:17px 11px;border:1px solid rgba(255,255,255,.12);border-radius:15px;background:rgba(255,255,255,.035);text-align:center;opacity:.36;transition:.25s ease}
  .statusStep.done{opacity:1;border-color:rgba(103,190,138,.55);background:rgba(64,145,98,.13)}
  .statusStep.active{opacity:1;border:2px solid #f0cf91;background:linear-gradient(180deg,rgba(240,207,145,.19),rgba(224,189,119,.10));box-shadow:0 0 0 3px rgba(240,207,145,.10),0 0 34px rgba(240,207,145,.36),0 16px 32px rgba(0,0,0,.24);transform:translateY(-3px);animation:statusPulse 1.8s ease-in-out infinite}
  @keyframes statusPulse{0%,100%{box-shadow:0 0 0 3px rgba(240,207,145,.08),0 0 24px rgba(240,207,145,.25),0 16px 32px rgba(0,0,0,.24)}50%{box-shadow:0 0 0 5px rgba(240,207,145,.16),0 0 42px rgba(240,207,145,.52),0 16px 32px rgba(0,0,0,.24)}}
  .statusCurrent{position:absolute;top:-10px;left:50%;transform:translateX(-50%);padding:4px 8px;border-radius:999px;background:#f0cf91;color:#063f2f;font-size:7px;font-weight:1000;letter-spacing:.1em;white-space:nowrap;box-shadow:0 5px 14px rgba(0,0,0,.28)}
  .statusDot{width:38px;height:38px;margin:0 auto 10px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(224,189,119,.42);color:#f0cf91;font-size:13px;font-weight:1000;background:#063f2f}
  .statusStep.done .statusDot{background:#4f9d6c;color:#fff;border-color:#7bc795}
  .statusStep.active .statusDot{background:#f0cf91;color:#063f2f;border:2px solid #fff4d9;box-shadow:0 0 20px rgba(240,207,145,.42)}
  .statusStep strong{display:block;color:#fff;font-size:12px;line-height:1.25}.statusStep.active strong{color:#fff4d9;font-size:13px}.statusStep.done strong{color:#d9f2e3}
  .statusStep small{display:block;margin-top:5px;color:#aebfb8;font-size:9px;line-height:1.4}.statusStep.active small{color:#e5ece9}
  .statusNow{padding:15px;border-radius:14px;background:linear-gradient(180deg,rgba(240,207,145,.11),rgba(255,255,255,.05));border:1px solid rgba(240,207,145,.45);color:#dbe5e1;font-size:11px;line-height:1.6;box-shadow:0 0 24px rgba(224,189,119,.08)}.statusNow b{color:#f5d995;font-size:12px}
  .statusDemo{margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.035);text-align:center;color:#aebdb7;font-size:9px;line-height:1.55}.statusDemo strong{color:#f0cf91;font-size:10px}
  .quickAction.statusNew{border-color:rgba(240,207,145,.76)!important;background:rgba(224,189,119,.11)!important;box-shadow:0 0 18px rgba(224,189,119,.12)!important}
  #featureStatus{border-color:#f0cf91!important;background:rgba(224,189,119,.18)!important;box-shadow:0 0 0 1px rgba(240,207,145,.38),0 0 28px rgba(240,207,145,.34)!important;color:#fff!important;animation:featureStatusGlow 2s ease-in-out infinite;min-width:310px!important}
  #featureStatus b{color:#fff4d9!important;font-size:9px!important}
  @keyframes featureStatusGlow{0%,100%{box-shadow:0 0 0 1px rgba(240,207,145,.28),0 0 18px rgba(240,207,145,.22)}50%{box-shadow:0 0 0 2px rgba(240,207,145,.62),0 0 36px rgba(240,207,145,.5)}}
  @media(prefers-reduced-motion:reduce){.statusStep.active,#featureStatus{animation:none!important}}
  @media(max-width:560px){.statusSheet{padding:16px;border-radius:20px}.statusHead h2{font-size:24px}.statusSteps{grid-template-columns:1fr;gap:14px}.statusStep{text-align:left;display:grid;grid-template-columns:46px 1fr;align-items:center;column-gap:10px;padding:14px}.statusStep.active{transform:none}.statusDot{margin:0}.statusStep small{margin-top:2px}.statusCurrent{left:auto;right:10px;transform:none}.statusOrder{display:block}.statusCode{display:block;margin-top:8px}#featureStatus{min-width:100%!important}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const $=id=>document.getElementById(id);
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};

  const layer=document.createElement('div');layer.className='layer statusLayer';layer.id='statusLayer';
  layer.innerHTML=`<section class="statusSheet" role="dialog" aria-modal="true" aria-labelledby="statusTitle"><div class="statusHead"><div><div class="statusEyebrow">PROTOTYPE TRACKING</div><h2 id="statusTitle">Order Status</h2></div><button class="statusClose" id="statusClose" aria-label="Close">×</button></div><div id="statusBody"></div></section>`;
  document.body.appendChild(layer);

  function currentOrder(){const receipt=read('menuOrbitLastReceipt',null),last=read('menuOrbitLastOrder',null);return receipt||last}
  function stageFor(o){if(!o?.date)return 0;const seconds=Math.max(0,(Date.now()-new Date(o.date).getTime())/1000);if(seconds<30)return 0;if(seconds<90)return 1;return 2}
  function render(){
    const o=currentOrder(),body=$('statusBody');if(!body)return;
    if(!o){body.innerHTML='<div class="statusNow"><b>No completed prototype order yet.</b><br>Complete checkout first, then return here to track its demo status.</div>';return}
    const stage=stageFor(o),labels=[['Received','Order accepted'],['Preparing','Your items are being prepared'],['Ready for Pickup','Your order is ready']],store=o.store||$('pickupLocation')?.value||'Selected Demo Store',stageText=stage===0?'Your prototype order has been received.':stage===1?'Your prototype order is being prepared.':'Your prototype order is ready for pickup.';
    body.innerHTML=`<div class="statusOrder"><div><strong>${o.name||'Guest'}</strong><small>${store}</small></div><span class="statusCode">${o.code||'PROTOTYPE'}</span></div><div class="statusSteps">${labels.map((x,i)=>`<div class="statusStep ${i<stage?'done':i===stage?'active':''}">${i===stage?'<span class="statusCurrent">CURRENT</span>':''}<div class="statusDot">${i<stage?'✓':i+1}</div><div><strong>${x[0]}</strong><small>${x[1]}</small></div></div>`).join('')}</div><div class="statusNow"><b>Current status: ${labels[stage][0]}</b><br>${stageText}</div><div class="statusDemo"><strong>Received → Preparing → Ready for Pickup</strong><br>Demo timing only. This is not connected to Starbucks store systems.</div>`;
  }
  function openStatus(){render();layer.classList.add('open');document.body.classList.add('lock')}
  function closeStatus(){layer.classList.remove('open');const ids=['cinema','searchLayer','cartLayer','checkoutLayer','reviewLayer','loyaltyLayer'];if(!ids.some(id=>$(id)?.classList.contains('open')))document.body.classList.remove('lock')}
  $('statusClose').onclick=closeStatus;layer.onclick=e=>{if(e.target===layer)closeStatus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer.classList.contains('open'))closeStatus()});

  const myOrderGroup=[...document.querySelectorAll('.quickGroup')].find(g=>g.querySelector('.quickGroupLabel')?.textContent.trim().toLowerCase()==='my order');
  const grid=myOrderGroup?.querySelector('.quickGrid');
  if(grid&&!$('sideStatus')){const checkout=$('sideCheckout'),b=document.createElement('button');b.className='quickAction statusNew';b.id='sideStatus';b.innerHTML='<span class="ico">●</span><span>Order Status</span>';if(checkout)grid.insertBefore(b,checkout);else grid.appendChild(b);b.onclick=()=>{document.getElementById('quickAccessPanel')?.classList.remove('open');openStatus()}}

  const bar=document.querySelector('.newFeaturesBar');
  let feature=$('featureStatus');
  if(bar&&!feature){feature=document.createElement('button');feature.className='newFeatureChip';feature.id='featureStatus';feature.innerHTML='<b>Order Status</b> • Received → Preparing → Ready for Pickup';bar.appendChild(feature)}
  if(feature)feature.onclick=openStatus;

  const success=$('success');
  if(success&&!$('trackOrderBtn')){const done=$('doneBtn'),b=document.createElement('button');b.className='full checkoutBtn';b.id='trackOrderBtn';b.textContent='Track Order';if(done)success.insertBefore(b,done);else success.appendChild(b);b.onclick=openStatus}

  setInterval(()=>{if(layer.classList.contains('open'))render()},5000);
  window.menuOrbitOpenStatus=openStatus;
})();