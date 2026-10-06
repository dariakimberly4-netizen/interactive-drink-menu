(()=>{
  const css=`
  .loyaltyLayer{z-index:390!important}
  .loyaltySheet{width:min(700px,94vw);max-height:88vh;overflow:auto;margin:auto;padding:22px;border:1px solid rgba(224,189,119,.45);border-radius:24px;background:linear-gradient(180deg,#062d23,#03251d);box-shadow:0 28px 80px rgba(0,0,0,.52)}
  .loyaltyHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:14px;border-bottom:1px solid rgba(224,189,119,.24)}
  .loyaltyEyebrow{color:#f0cf91;font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
  .loyaltyHead h2{margin:5px 0 0;font:400 30px Georgia,serif;color:#fff}
  .loyaltyClose{width:38px;height:38px;border-radius:50%;border:1px solid rgba(224,189,119,.42);background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
  .loyaltyIntro{margin:13px 0;color:#b8c8c2;font-size:10px;line-height:1.55}
  .loyaltyCards{display:grid;gap:9px;margin:12px 0}
  .loyaltyCard{padding:13px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:rgba(255,255,255,.045)}
  .loyaltyCardHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  .loyaltyCard strong{display:block;color:#fff;font-size:12.5px;line-height:1.35}.loyaltyCard small{display:block;margin-top:4px;color:#aebfb8;font-size:9.5px;line-height:1.45}
  .loyaltyPrice{color:#f0cf91;font-size:11px;font-weight:900;white-space:nowrap}
  .loyaltyActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
  .loyaltyBtn{min-height:38px;padding:0 13px;border-radius:999px;border:1px solid rgba(224,189,119,.48);background:transparent;color:#fff;font-size:9.5px;font-weight:900;cursor:pointer}
  .loyaltyBtn.primary{background:var(--cream);color:#063f2f;border-color:transparent}.loyaltyBtn.danger{border-color:rgba(255,156,145,.4);color:#ffb2a9}
  .loyaltyEmpty{padding:24px 8px;text-align:center;color:#b8c8c2;font-size:11px;line-height:1.6}
  .receiptCard{margin-top:14px;padding:16px;border:1px solid rgba(224,189,119,.42);border-radius:16px;background:rgba(224,189,119,.07)}
  .receiptTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-bottom:11px;border-bottom:1px dashed rgba(224,189,119,.34)}
  .receiptTop strong{display:block;color:#fff;font:400 21px Georgia,serif}.receiptTop small{display:block;margin-top:3px;color:#c1cec9;font-size:9px}
  .receiptCode{color:#f0cf91;font-size:12px;font-weight:1000;letter-spacing:.08em}
  .receiptMeta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:11px 0}
  .receiptMeta div{padding:8px 9px;border-radius:10px;background:rgba(255,255,255,.045);color:#b7c7c1;font-size:8.5px;line-height:1.45}.receiptMeta b{display:block;color:#fff;font-size:9px;margin-bottom:2px}
  .receiptItems{display:grid;gap:6px;margin:10px 0}.receiptItem{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:9.5px;color:#d7e1dd}.receiptItem:last-child{border-bottom:0}.receiptItem span:last-child{color:#f0cf91;font-weight:900;white-space:nowrap}
  .receiptTotal{display:flex;justify-content:space-between;gap:12px;padding-top:11px;border-top:1px dashed rgba(224,189,119,.34);color:#fff;font-size:13px;font-weight:900}
  .receiptNote{margin-top:9px;color:#8fa39b;font-size:8px;line-height:1.5;text-align:center}
  .quickAction.loyaltyNew{border-color:rgba(240,207,145,.62);background:rgba(224,189,119,.08)}
  .quickAction.loyaltyNew .ico{background:rgba(224,189,119,.18)}
  @media(max-width:560px){.loyaltySheet{padding:16px;border-radius:20px}.loyaltyHead h2{font-size:24px}.loyaltyCardHead{display:block}.loyaltyPrice{display:block;margin-top:7px}.receiptMeta{grid-template-columns:1fr}.receiptTop{display:block}.receiptCode{display:block;margin-top:8px}.loyaltyBtn{flex:1 1 auto}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const $=id=>document.getElementById(id);
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const toast=t=>{const el=$('toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1500)};
  const clone=o=>JSON.parse(JSON.stringify(o));
  const optionText=i=>[i.size,i.milk&&i.milk!=='—'?i.milk:'',i.sweet&&i.sweet!=='—'?i.sweet+' sweet':'',i.ice&&i.ice!=='—'?i.ice+' ice':'',i.shot&&i.shot!=='—'&&i.shot!=='Standard'?i.shot:''].filter(Boolean).join(' • ')||'Standard selection';

  const layer=document.createElement('div');layer.className='layer loyaltyLayer';layer.id='loyaltyLayer';
  layer.innerHTML=`<section class="loyaltySheet" role="dialog" aria-modal="true" aria-labelledby="loyaltyTitle"><div class="loyaltyHead"><div><div class="loyaltyEyebrow" id="loyaltyEyebrow">PERSONAL MENU</div><h2 id="loyaltyTitle">My Usual</h2></div><button class="loyaltyClose" id="loyaltyClose" aria-label="Close">×</button></div><div id="loyaltyBody"></div></section>`;
  document.body.appendChild(layer);
  const closeLayer=()=>{layer.classList.remove('open');const openIds=['cinema','searchLayer','cartLayer','checkoutLayer','reviewLayer'];if(!openIds.some(id=>$(id)?.classList.contains('open')))document.body.classList.remove('lock')};
  const openLayer=(title,eyebrow,html)=>{$('loyaltyTitle').textContent=title;$('loyaltyEyebrow').textContent=eyebrow;$('loyaltyBody').innerHTML=html;layer.classList.add('open');document.body.classList.add('lock')};
  $('loyaltyClose').onclick=closeLayer;layer.onclick=e=>{if(e.target===layer)closeLayer()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer.classList.contains('open'))closeLayer()});

  // Add My Usual and Order History to Quick Access.
  const myOrderGroup=[...document.querySelectorAll('.quickGroup')].find(g=>g.querySelector('.quickGroupLabel')?.textContent.trim().toLowerCase()==='my order');
  const quickGrid=myOrderGroup?.querySelector('.quickGrid');
  if(quickGrid){
    const checkout=$('sideCheckout');
    const usual=document.createElement('button');usual.className='quickAction loyaltyNew';usual.id='sideUsual';usual.innerHTML='<span class="ico">★</span><span>My Usual</span>';
    const history=document.createElement('button');history.className='quickAction loyaltyNew';history.id='sideHistory';history.innerHTML='<span class="ico">↺</span><span>Order History</span>';
    if(checkout){quickGrid.insertBefore(usual,checkout);quickGrid.insertBefore(history,checkout)}else{quickGrid.append(usual,history)}
  }

  // Add visible chips to the New Features strip.
  const featureBar=document.querySelector('.newFeaturesBar');
  if(featureBar){
    const addChip=(id,label,detail)=>{if($(id))return;const b=document.createElement('button');b.className='newFeatureChip';b.id=id;b.innerHTML=`<b>${label}</b> • ${detail}`;featureBar.appendChild(b)};
    addChip('featureUsual','My Usual','one-tap favorite');
    addChip('featureHistory','Order History','saved locally');
    addChip('featureReceipt','Receipt','order summary');
  }

  function saveUsual(item){
    if(!item||!item.name||!item.key&&item.key!==0){toast('Choose a current menu item first');return}
    write('menuOrbitMyUsual',clone(item));toast(item.name+' saved as My Usual');openUsual();
  }
  function chooseUsual(){
    const cart=read('menuOrbitCart',[]).filter(i=>i&&i.name&&i.key!=null&&Number.isFinite(Number(i.index)));
    if(!cart.length){openLayer('My Usual','PERSONAL MENU','<div class="loyaltyEmpty">Add and customize a current menu item first.<br>Then you can save it as <b>My Usual</b>.</div>');return}
    openLayer('Choose My Usual','SAVE A FAVORITE',`<div class="loyaltyIntro">Choose one item from your current order to save on this device.</div><div class="loyaltyCards">${cart.map((i,n)=>`<div class="loyaltyCard"><div class="loyaltyCardHead"><div><strong>${i.name}</strong><small>${optionText(i)}</small></div><span class="loyaltyPrice">${money(i.amount)}</span></div><div class="loyaltyActions"><button class="loyaltyBtn primary" data-save-usual="${n}">Save as My Usual</button></div></div>`).join('')}</div>`);
    document.querySelectorAll('[data-save-usual]').forEach(b=>b.onclick=()=>saveUsual(cart[+b.dataset.saveUsual]));
  }
  function addUsual(){
    const u=read('menuOrbitMyUsual',null);if(!u){chooseUsual();return}
    const node=document.querySelector(`.node[data-key="${u.key}"]`);if(!node){toast('Saved item is no longer in this menu');return}
    closeLayer();node.click();
    setTimeout(()=>{
      const set=(a,v)=>{const el=document.querySelector(`#track [data-${a}="${u.index}"]`);if(el&&v&&v!=='—')el.value=v};
      set('size',u.size);set('milk',u.milk);set('sweet',u.sweet);set('ice',u.ice);set('shot',u.shot);
      const add=document.querySelector(`#track [data-add="${u.index}"]`);if(add&&!add.disabled)add.click();else toast('My Usual is unavailable at the selected store');
    },180);
  }
  function openUsual(){
    const u=read('menuOrbitMyUsual',null);
    if(!u){chooseUsual();return}
    openLayer('My Usual','PERSONAL MENU',`<div class="loyaltyIntro">Your saved customized favorite is stored only on this device.</div><div class="loyaltyCards"><div class="loyaltyCard"><div class="loyaltyCardHead"><div><strong>${u.name}</strong><small>${optionText(u)}</small></div><span class="loyaltyPrice">${money(u.amount)}</span></div><div class="loyaltyActions"><button class="loyaltyBtn primary" id="usualAdd">Add My Usual</button><button class="loyaltyBtn" id="usualReplace">Replace from Current Order</button><button class="loyaltyBtn danger" id="usualRemove">Remove</button></div></div></div>`);
    $('usualAdd').onclick=addUsual;$('usualReplace').onclick=chooseUsual;$('usualRemove').onclick=()=>{localStorage.removeItem('menuOrbitMyUsual');toast('My Usual removed');chooseUsual()};
  }

  const storeNames={'bacoor-demo':'Bacoor Demo Store','imus-demo':'Imus Demo Store','qc-demo':'Quezon City Demo Store'};
  function enrichedLastOrder(){
    const o=read('menuOrbitLastOrder',null);if(!o)return null;
    return {...o,store:o.store||storeNames[localStorage.getItem('menuOrbitStore')||'bacoor-demo']||'Selected Demo Store'};
  }
  function receiptHTML(o){
    if(!o)return '<div class="loyaltyEmpty">No completed prototype order yet.</div>';
    const d=o.date?new Date(o.date):new Date();
    const items=Array.isArray(o.items)?o.items:[];
    return `<div class="receiptCard"><div class="receiptTop"><div><strong>Menu Orbit Receipt</strong><small>${d.toLocaleString()}</small></div><span class="receiptCode">${o.code||'PROTOTYPE'}</span></div><div class="receiptMeta"><div><b>Customer</b>${o.name||'Guest'}</div><div><b>Pickup Store</b>${o.store||'Selected Demo Store'}</div><div><b>Order Type</b>${o.orderType||'Pickup'}</div><div><b>Payment</b>${o.payment||'Prototype / pay at store'}</div></div><div class="receiptItems">${items.map(i=>`<div class="receiptItem"><span>${Number(i.qty)||1}× ${i.name}<br><small>${optionText(i)}</small></span><span>${money((Number(i.amount)||0)*(Number(i.qty)||1))}</span></div>`).join('')||'<div class="loyaltyEmpty">No item details saved.</div>'}</div><div class="receiptTotal"><span>Total</span><span>${money(o.total)}</span></div><div class="receiptNote">Prototype receipt only. No payment was processed and no real Starbucks order was sent.</div></div>`;
  }
  function showReceipt(order){openLayer('Receipt','PROTOTYPE ORDER',receiptHTML(order||read('menuOrbitLastReceipt',null)||enrichedLastOrder()))}
  function history(){
    let h=read('menuOrbitOrderHistory',[]);const last=enrichedLastOrder();
    if(last?.code&&!h.some(x=>x.code===last.code)){h=[last,...h].slice(0,12);write('menuOrbitOrderHistory',h)}
    return h;
  }
  function openHistory(){
    const h=history();
    openLayer('Order History','SAVED ON THIS DEVICE',h.length?`<div class="loyaltyIntro">Your latest prototype orders are saved locally in this browser.</div><div class="loyaltyCards">${h.map((o,n)=>`<div class="loyaltyCard"><div class="loyaltyCardHead"><div><strong>${o.code||'Prototype order'}</strong><small>${o.date?new Date(o.date).toLocaleString():'Saved order'} • ${o.store||'Selected Demo Store'} • ${(o.items||[]).reduce((s,i)=>s+(Number(i.qty)||1),0)} item(s)</small></div><span class="loyaltyPrice">${money(o.total)}</span></div><div class="loyaltyActions"><button class="loyaltyBtn primary" data-receipt="${n}">View Receipt</button></div></div>`).join('')}</div>`:'<div class="loyaltyEmpty">No completed prototype orders yet.<br>Your orders will appear here after confirmation.</div>');
    document.querySelectorAll('[data-receipt]').forEach(b=>b.onclick=()=>showReceipt(h[+b.dataset.receipt]));
  }

  $('sideUsual')?.addEventListener('click',openUsual);$('sideHistory')?.addEventListener('click',openHistory);
  $('featureUsual')?.addEventListener('click',openUsual);$('featureHistory')?.addEventListener('click',openHistory);$('featureReceipt')?.addEventListener('click',()=>showReceipt());

  // Capture each confirmed prototype order into history and build a richer receipt.
  $('confirmOrder')?.addEventListener('click',()=>{
    setTimeout(()=>{
      const base=read('menuOrbitLastOrder',null);if(!base?.code)return;
      const enriched={...base,store:$('pickupLocation')?.value||storeNames[localStorage.getItem('menuOrbitStore')||'bacoor-demo']||'Selected Demo Store',orderType:$('orderType')?.value||'Pickup',payment:$('payment')?.value||'Pay at store'};
      write('menuOrbitLastReceipt',enriched);
      let h=read('menuOrbitOrderHistory',[]).filter(x=>x.code!==enriched.code);h=[enriched,...h].slice(0,12);write('menuOrbitOrderHistory',h);
      const success=$('success');if(success){let card=$('successReceipt');if(!card){card=document.createElement('div');card.id='successReceipt';success.insertBefore(card,$('doneBtn'))}card.innerHTML=receiptHTML(enriched)}
    },0);
  });
})();