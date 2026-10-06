(()=>{
  const css=`
  .priceBreakdown{margin:11px 0 3px;padding:11px 12px;border:1px solid rgba(240,207,145,.38);border-radius:13px;background:linear-gradient(180deg,rgba(240,207,145,.08),rgba(255,255,255,.035));box-shadow:0 10px 22px rgba(0,0,0,.12)}
  .priceBreakdownTitle{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;color:#f0cf91;font-size:8.5px;font-weight:1000;letter-spacing:.12em;text-transform:uppercase}
  .priceBreakdownRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 0;color:#c8d5d0;font-size:9.5px;line-height:1.35}
  .priceBreakdownRow b{color:#fff;font-size:10px}
  .priceBreakdownRow.total{margin-top:5px;padding-top:8px;border-top:1px solid rgba(240,207,145,.24);color:#fff;font-weight:900}
  .priceBreakdownRow.total b{color:#f5d995;font-size:12px}
  .guardBadge{display:inline-flex;align-items:center;gap:5px;margin-left:7px;padding:3px 7px;border:1px solid rgba(255,143,131,.45);border-radius:999px;background:rgba(215,83,70,.11);color:#ffaaa0;font-size:7px;font-weight:1000;letter-spacing:.07em;vertical-align:middle}
  .guardBadge:before{content:'×';font-size:9px}
  .result.soldGuard{opacity:.55;cursor:not-allowed!important}
  .result.soldGuard:after{content:'SOLD OUT';margin-left:auto;padding:4px 7px;border-radius:999px;border:1px solid rgba(255,143,131,.4);color:#ffaaa0;font-size:7px;font-weight:1000;letter-spacing:.06em}
  .cartItem.soldGuardItem{border-color:rgba(255,143,131,.42)!important;background:rgba(215,83,70,.07)!important}
  .cartSoldNote{margin:10px 0;padding:10px 12px;border:1px solid rgba(255,143,131,.38);border-radius:12px;background:rgba(215,83,70,.08);color:#ffd0cb;font-size:9px;line-height:1.5}
  .cancelOrderBtn{width:100%;min-height:43px;margin-top:12px;border:1px solid rgba(255,156,145,.5);border-radius:999px;background:rgba(215,83,70,.10);color:#ffb2a9;font-size:10px;font-weight:1000;cursor:pointer}
  .cancelOrderBtn:hover,.cancelOrderBtn:focus-visible{outline:2px solid rgba(255,178,169,.45);outline-offset:2px;background:rgba(215,83,70,.16)}
  .cancelledStatus{padding:18px;border:1px solid rgba(255,156,145,.42);border-radius:15px;background:linear-gradient(180deg,rgba(215,83,70,.12),rgba(255,255,255,.035));text-align:center;color:#ffd7d2}
  .cancelledStatus strong{display:block;color:#fff;font:400 22px Georgia,serif;margin-bottom:6px}.cancelledStatus small{display:block;color:#c8d2ce;font-size:9px;line-height:1.55}
  .loyaltyBtn.reorderBtn{border-color:rgba(240,207,145,.62)!important;background:rgba(224,189,119,.09)!important;color:#fff4d9!important}
  #featurePriceBreakdown,#featureSoldGuard,#featureOrderControls{border-color:rgba(240,207,145,.62)!important;background:rgba(224,189,119,.09)!important;box-shadow:0 0 15px rgba(224,189,119,.13)!important}
  @media(max-width:560px){.priceBreakdown{padding:10px}.priceBreakdownRow{font-size:9px}.guardBadge{display:flex;width:max-content;margin:6px 0 0}.cancelledStatus strong{font-size:19px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const $=id=>document.getElementById(id);
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const toast=t=>{const el=$('toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1700)};
  const hash=str=>{let h=0;for(let i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))>>>0;return h};
  const currentStore=()=>localStorage.getItem('menuOrbitStore')||'bacoor-demo';
  function availability(name){
    if(/Featured/i.test(name||''))return 'seasonal';
    const n=hash(currentStore()+'|'+String(name||''))%10;
    if(n===0)return 'sold';
    if(n<=2)return 'low';
    return 'available';
  }
  const isSold=name=>availability(name)==='sold';

  function parseBase(slide){
    const t=slide.querySelector('.menuPrice')?.textContent||'';
    const m=t.replace(/,/g,'').match(/₱\s*(\d+)/);
    return m?Number(m[1]):0;
  }
  function breakdownFor(slide){
    const size=slide.querySelector('[data-size]')?.value||'Standard';
    const shot=slide.querySelector('[data-shot]')?.value||'Standard';
    const base=parseBase(slide),sizeAdd=size==='Grande'?20:size==='Venti'?40:0,shotAdd=/Extra/.test(shot)?25:0,total=base+sizeAdd+shotAdd;
    return {base,size,sizeAdd,shot,shotAdd,total};
  }
  function renderBreakdown(slide){
    const custom=slide.querySelector('.custom');if(!custom)return;
    let box=slide.querySelector('.priceBreakdown');
    if(!box){box=document.createElement('div');box.className='priceBreakdown';custom.insertAdjacentElement('afterend',box)}
    const b=breakdownFor(slide);
    box.innerHTML=`<div class="priceBreakdownTitle"><span>Price Breakdown</span><span>${money(b.total)}</span></div><div class="priceBreakdownRow"><span>Base menu price</span><b>${money(b.base)}</b></div><div class="priceBreakdownRow"><span>${b.size} size</span><b>${b.sizeAdd?'+ '+money(b.sizeAdd):'+ ₱0'}</b></div><div class="priceBreakdownRow"><span>${/Extra/.test(b.shot)?'Extra shot':'Standard shot'}</span><b>${b.shotAdd?'+ '+money(b.shotAdd):'+ ₱0'}</b></div><div class="priceBreakdownRow total"><span>Estimated item total</span><b>${money(b.total)}</b></div>`;
  }
  function patchSlides(){
    document.querySelectorAll('#track .slide').forEach(slide=>{
      renderBreakdown(slide);
      const name=slide.querySelector('h3')?.textContent?.trim();
      const add=slide.querySelector('[data-add]');
      if(name&&add&&isSold(name)){add.disabled=true;add.textContent='Sold Out at Selected Store'}
    });
  }
  $('track')?.addEventListener('change',e=>{const slide=e.target.closest('.slide');if(slide)renderBreakdown(slide)});
  if($('track'))new MutationObserver(()=>setTimeout(patchSlides,0)).observe($('track'),{childList:true,subtree:true});

  function patchResults(){
    document.querySelectorAll('#results .result').forEach(r=>{
      const strong=r.querySelector('strong');if(!strong)return;
      const name=(strong.childNodes[0]?.textContent||strong.textContent).replace('♥','').trim();
      r.classList.toggle('soldGuard',isSold(name));
      r.dataset.guardName=name;
      r.setAttribute('aria-disabled',isSold(name)?'true':'false');
    });
  }
  if($('results'))new MutationObserver(()=>setTimeout(patchResults,0)).observe($('results'),{childList:true,subtree:true});

  function soldCartItems(){return read('menuOrbitCart',[]).filter(i=>i?.name&&isSold(i.name))}
  function patchCart(){
    const cart=read('menuOrbitCart',[]),items=[...document.querySelectorAll('#cartItems .cartItem')];
    items.forEach((el,i)=>{
      const sold=cart[i]?.name&&isSold(cart[i].name);el.classList.toggle('soldGuardItem',!!sold);
      let b=el.querySelector('.guardBadge');
      if(sold&&!b){b=document.createElement('span');b.className='guardBadge';b.textContent='SOLD OUT';el.querySelector('strong')?.appendChild(b)}
      if(!sold&&b)b.remove();
    });
    let note=$('cartSoldNote');const sold=soldCartItems();
    if(sold.length){
      if(!note){note=document.createElement('div');note.id='cartSoldNote';note.className='cartSoldNote';$('subtotal')?.parentElement?.insertAdjacentElement('beforebegin',note)}
      note.textContent=`${sold.length} item${sold.length===1?' is':'s are'} unavailable at the selected demo store. Remove or change store before checkout.`;
      if($('checkoutBtn'))$('checkoutBtn').disabled=true;
    }else if(note)note.remove();
  }
  if($('cartItems'))new MutationObserver(()=>setTimeout(patchCart,0)).observe($('cartItems'),{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]');
    if(add){const name=add.closest('.slide')?.querySelector('h3')?.textContent?.trim();if(name&&isSold(name)){e.preventDefault();e.stopImmediatePropagation();toast(name+' is sold out at the selected demo store');return}}
    const result=e.target.closest('.result.soldGuard');
    if(result){e.preventDefault();e.stopImmediatePropagation();toast((result.dataset.guardName||'This item')+' is sold out at the selected demo store');return}
    if(e.target.closest('#checkoutBtn')&&soldCartItems().length){e.preventDefault();e.stopImmediatePropagation();toast('Remove sold-out items or choose another store first');return}
  },true);
  document.getElementById('storeList')?.addEventListener('click',()=>setTimeout(()=>{patchSlides();patchResults();patchCart()},80));

  function getHistory(){return read('menuOrbitOrderHistory',[])}
  function reorder(index){
    const h=getHistory(),o=h[index];if(!o)return;
    const items=(o.items||[]).filter(i=>i?.name&&!isSold(i.name));
    const skipped=(o.items||[]).length-items.length;
    if(!items.length){toast('All items from this order are unavailable at the selected store');return}
    write('menuOrbitCart',items.map(i=>({...i,qty:Number(i.qty)||1})));
    sessionStorage.setItem('menuOrbitOpenCart','1');
    if(skipped)sessionStorage.setItem('menuOrbitReorderNote',`${skipped} sold-out item${skipped===1?' was':'s were'} skipped`);
    location.reload();
  }
  function patchHistory(){
    if(!/Order History/i.test($('loyaltyTitle')?.textContent||''))return;
    document.querySelectorAll('#loyaltyBody [data-receipt]').forEach(view=>{
      const n=Number(view.dataset.receipt),actions=view.closest('.loyaltyActions');if(!actions||actions.querySelector(`[data-reorder="${n}"]`))return;
      const b=document.createElement('button');b.className='loyaltyBtn reorderBtn';b.dataset.reorder=n;b.textContent='Reorder';actions.appendChild(b);b.onclick=()=>reorder(n);
    });
  }
  if($('loyaltyBody'))new MutationObserver(()=>setTimeout(patchHistory,0)).observe($('loyaltyBody'),{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('#sideHistory,#featureHistory'))setTimeout(patchHistory,120)});

  function currentOrder(){return read('menuOrbitLastReceipt',null)||read('menuOrbitLastOrder',null)}
  function orderStage(o){if(!o?.date)return 0;const s=Math.max(0,(Date.now()-new Date(o.date).getTime())/1000);return s<30?0:s<90?1:2}
  let statusPatching=false;
  function patchStatus(){
    if(statusPatching)return;statusPatching=true;
    const body=$('statusBody'),o=currentOrder();
    if(!body||!o){statusPatching=false;return}
    const cancelled=o.cancelled||localStorage.getItem('menuOrbitCancelledOrder')===String(o.code||'');
    if(cancelled){
      if(!body.querySelector('.cancelledStatus'))body.innerHTML=`<div class="statusOrder"><div><strong>${o.name||'Guest'}</strong><small>${o.store||'Selected Demo Store'}</small></div><span class="statusCode">${o.code||'PROTOTYPE'}</span></div><div class="cancelledStatus"><strong>Order Cancelled</strong><small>This prototype order was cancelled before preparation began. No payment or real Starbucks order was affected.</small></div>`;
      statusPatching=false;return;
    }
    if(orderStage(o)===0&&!body.querySelector('.cancelOrderBtn')){
      const b=document.createElement('button');b.className='cancelOrderBtn';b.textContent='Cancel Prototype Order';body.appendChild(b);
      b.onclick=()=>{
        if(!confirm('Cancel this prototype order?'))return;
        const stamp=new Date().toISOString(),code=String(o.code||'PROTOTYPE');
        const last=read('menuOrbitLastOrder',null),receipt=read('menuOrbitLastReceipt',null);
        if(last&&String(last.code||'')===code)write('menuOrbitLastOrder',{...last,cancelled:true,cancelledAt:stamp});
        if(receipt&&String(receipt.code||'')===code)write('menuOrbitLastReceipt',{...receipt,cancelled:true,cancelledAt:stamp});
        const h=getHistory().map(x=>String(x.code||'')===code?{...x,cancelled:true,cancelledAt:stamp}:x);write('menuOrbitOrderHistory',h);
        localStorage.setItem('menuOrbitCancelledOrder',code);toast('Prototype order cancelled');setTimeout(patchStatus,20);
      };
    }
    statusPatching=false;
  }
  if($('statusBody'))new MutationObserver(()=>setTimeout(patchStatus,0)).observe($('statusBody'),{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('#featureStatus,#sideStatus,#trackOrderBtn'))setTimeout(patchStatus,120)});

  const featureBar=document.querySelector('.newFeaturesBar');
  const addChip=(id,label,detail,handler)=>{if(!featureBar||$(id))return;const b=document.createElement('button');b.className='newFeatureChip';b.id=id;b.innerHTML=`<b>${label}</b> • ${detail}`;featureBar.appendChild(b);if(handler)b.onclick=handler};
  addChip('featurePriceBreakdown','Price Breakdown','live customization total',()=>{document.querySelector('.node[data-key="espresso"]')?.click();setTimeout(()=>document.querySelector('#track .priceBreakdown')?.scrollIntoView({behavior:'smooth',block:'center'}),180)});
  addChip('featureSoldGuard','Sold-Out Guard','blocks unavailable items',()=>document.getElementById('storeBtn')?.click());
  addChip('featureOrderControls','Reorder + Cancel','order controls',()=>document.getElementById('sideHistory')?.click());

  if(sessionStorage.getItem('menuOrbitOpenCart')==='1'){
    sessionStorage.removeItem('menuOrbitOpenCart');setTimeout(()=>document.getElementById('order')?.click(),450);
    const note=sessionStorage.getItem('menuOrbitReorderNote');if(note){sessionStorage.removeItem('menuOrbitReorderNote');setTimeout(()=>toast(note),700)}
  }
  setTimeout(()=>{patchSlides();patchResults();patchCart();patchHistory();patchStatus()},250);
})();