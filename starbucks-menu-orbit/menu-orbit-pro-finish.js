(()=>{
  const css=`
  .nutritionBlock{margin-top:12px;padding:11px 12px;border:1px solid rgba(201,168,106,.28);border-radius:13px;background:rgba(255,255,255,.045)}
  .nutritionToggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:transparent;color:#f4ead8;padding:0;font-size:10px;font-weight:900;text-align:left;cursor:pointer}
  .nutritionToggle:after{content:'+';width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:rgba(224,189,119,.13);color:#e0bd77;font-size:14px;flex:0 0 22px}
  .nutritionBlock.open .nutritionToggle:after{content:'−'}
  .nutritionDetails{display:none;padding-top:10px;margin-top:10px;border-top:1px solid rgba(201,168,106,.18);color:#c1cec9;font-size:9px;line-height:1.55}
  .nutritionBlock.open .nutritionDetails{display:block}
  .nutritionDetails b{color:#f4ead8}
  .nutritionDetails p{margin:0 0 7px}.nutritionDetails p:last-child{margin-bottom:0}
  .nutritionCaution{color:#9fb1aa!important;font-size:8px!important}
  .reviewLayer{z-index:360!important}
  .reviewSheet{width:min(720px,94vw);max-height:88vh;overflow:auto;margin:auto;padding:22px;border:1px solid rgba(201,168,106,.42);border-radius:24px;background:linear-gradient(180deg,#062d23,#03251d);box-shadow:0 28px 80px rgba(0,0,0,.5)}
  .reviewHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:15px;border-bottom:1px solid rgba(201,168,106,.25)}
  .reviewEyebrow{color:#e0bd77;font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
  .reviewHead h2{margin:5px 0 0;font:400 30px Georgia,serif;color:#fff}
  .reviewClose{width:38px;height:38px;border-radius:50%;border:1px solid rgba(201,168,106,.38);background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
  .reviewStore{margin:14px 0;padding:11px 13px;border-radius:13px;background:rgba(224,189,119,.08);border:1px solid rgba(224,189,119,.22);font-size:10px;color:#d6dfdb}
  .reviewStore b{color:#fff}
  .reviewItems{display:grid;gap:9px;margin:12px 0}
  .reviewItem{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.04)}
  .reviewItem strong{display:block;color:#fff;font-size:12px;line-height:1.35}.reviewItem small{display:block;margin-top:4px;color:#aebfb8;font-size:9px;line-height:1.45}
  .reviewItemPrice{color:#e7c37b;font-size:11px;font-weight:900;white-space:nowrap}
  .reviewTotal{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 2px;border-top:1px solid rgba(201,168,106,.24);font-size:14px;font-weight:900;color:#fff}
  .reviewActions{display:grid;grid-template-columns:1fr 1.35fr;gap:9px}
  .reviewBtn{min-height:46px;border-radius:999px;font-size:10.5px;font-weight:900;cursor:pointer}
  .reviewBtn.secondary{background:transparent;color:#fff;border:1px solid rgba(201,168,106,.48)}
  .reviewBtn.primary{background:var(--cream);color:#063f2f;border:0}
  .reviewNote{margin-top:10px;text-align:center;color:#91a59d;font-size:8px;line-height:1.5}
  @media(max-width:560px){.reviewSheet{padding:16px;border-radius:20px}.reviewHead h2{font-size:24px}.reviewActions{grid-template-columns:1fr}.reviewItem{grid-template-columns:1fr}.reviewItemPrice{justify-self:start}.nutritionDetails{font-size:9.5px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const guidanceFor=name=>{
    const n=(name||'').toLowerCase();
    if(/croissant|bakery|sandwich|pasta|dessert|food/.test(n)) return {
      nutrition:'Portion, calories and ingredients vary by the exact food item and serving size.',
      allergen:'May contain wheat, milk, egg, soy, peanuts or tree nuts depending on the item and preparation.'
    };
    if(/frappuccino|macchiato|latte|flat white|pink drink|dragon drink/.test(n)) return {
      nutrition:'Calories, sugar and caffeine can change significantly with size, milk, syrup, toppings and added shots.',
      allergen:'Milk is common in this style of beverage. Alternative milks and toppings may introduce other allergens.'
    };
    if(/tea|teavana/.test(n)) return {
      nutrition:'Caffeine and sugar vary by tea base, size and added sweetener or toppings.',
      allergen:'Plain brewed tea may be simple, while milk, foam, jelly and syrups can add allergens.'
    };
    if(/refresher|açaí|acai|mango|strawberry/.test(n)) return {
      nutrition:'Sugar and caffeine vary by recipe, size, lemonade or coconut beverage additions.',
      allergen:'Ingredients vary by recipe; verify coconut, milk and other allergen information for the selected drink.'
    };
    return {
      nutrition:'Caffeine, calories and sugar vary by size, milk, sweetener and extra espresso shots.',
      allergen:'Milk may be present depending on the recipe and customization.'
    };
  };

  function patchNutrition(){
    document.querySelectorAll('#track .slide').forEach(slide=>{
      if(slide.querySelector('.nutritionBlock'))return;
      const name=slide.querySelector('h3')?.textContent?.trim();
      const copy=slide.querySelector('.slideCopy');
      const actions=slide.querySelector('.slideActions');
      if(!name||!copy)return;
      const g=guidanceFor(name);
      const block=document.createElement('div');block.className='nutritionBlock';
      block.innerHTML=`<button class="nutritionToggle" type="button">Nutrition + Allergens <span>Prototype guide</span></button><div class="nutritionDetails"><p><b>Nutrition:</b> ${g.nutrition}</p><p><b>Allergens:</b> ${g.allergen}</p><p class="nutritionCaution">Prototype guidance only — not an official Starbucks allergen declaration. Confirm current ingredients and allergen information with the store before ordering.</p></div>`;
      block.querySelector('.nutritionToggle').onclick=e=>{e.stopPropagation();block.classList.toggle('open')};
      if(actions)copy.insertBefore(block,actions);else copy.appendChild(block);
    });
  }
  const track=document.getElementById('track');
  if(track)new MutationObserver(()=>setTimeout(patchNutrition,0)).observe(track,{childList:true,subtree:true});
  patchNutrition();

  const review=document.createElement('div');review.className='layer reviewLayer';review.id='reviewLayer';
  review.innerHTML=`<section class="reviewSheet" role="dialog" aria-modal="true" aria-labelledby="reviewTitle"><div class="reviewHead"><div><div class="reviewEyebrow">FINAL CHECK</div><h2 id="reviewTitle">Review Order</h2></div><button class="reviewClose" id="reviewClose" aria-label="Close review">×</button></div><div class="reviewStore" id="reviewStore"></div><div class="reviewItems" id="reviewItems"></div><div class="reviewTotal"><span>Estimated subtotal</span><span id="reviewTotal">₱0</span></div><div class="reviewActions"><button class="reviewBtn secondary" id="reviewEdit">Edit Order</button><button class="reviewBtn primary" id="reviewContinue">Continue to Checkout</button></div><div class="reviewNote">Prototype only. Final prices, ingredients and availability may differ by store.</div></section>`;
  document.body.appendChild(review);

  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  const storeNames={'bacoor-demo':'Bacoor Demo Store','imus-demo':'Imus Demo Store','qc-demo':'Quezon City Demo Store'};
  function getCart(){try{return JSON.parse(localStorage.getItem('menuOrbitCart'))||[]}catch{return []}}
  function selectedStore(){const id=localStorage.getItem('menuOrbitStore')||'bacoor-demo';return storeNames[id]||'Selected Demo Store'}
  function renderReview(){
    const cart=getCart();
    const total=cart.reduce((s,i)=>s+(Number(i.amount)||0)*(Number(i.qty)||1),0);
    document.getElementById('reviewStore').innerHTML=`Pickup store: <b>${selectedStore()}</b>`;
    document.getElementById('reviewTotal').textContent=money(total);
    document.getElementById('reviewItems').innerHTML=cart.length?cart.map(i=>{
      const opts=[i.size,i.milk&&i.milk!=='—'?i.milk:'',i.sweet&&i.sweet!=='—'?i.sweet+' sweet':'',i.ice&&i.ice!=='—'?i.ice+' ice':'',i.shot&&i.shot!=='—'&&i.shot!=='Standard'?i.shot:''].filter(Boolean).join(' • ');
      return `<div class="reviewItem"><div><strong>${i.name||'Menu item'}</strong><small>${opts||'Standard selection'} • Qty ${Number(i.qty)||1}</small></div><div class="reviewItemPrice">${money((Number(i.amount)||0)*(Number(i.qty)||1))}</div></div>`
    }).join(''):'<div class="orderPreviewEmpty">Your order is empty.</div>';
  }
  function openReview(){renderReview();review.classList.add('open');document.body.classList.add('lock')}
  function unlockIfClear(){const ids=['cinema','searchLayer','cartLayer','checkoutLayer','reviewLayer'];if(!ids.some(id=>document.getElementById(id)?.classList.contains('open')))document.body.classList.remove('lock')}
  function closeReview(){review.classList.remove('open');unlockIfClear()}
  document.getElementById('reviewClose').onclick=closeReview;
  review.onclick=e=>{if(e.target===review)closeReview()};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&review.classList.contains('open'))closeReview()});
  document.getElementById('reviewEdit').onclick=()=>{closeReview();document.getElementById('order')?.click()};

  const checkout=document.getElementById('checkoutBtn');
  if(checkout){
    const originalCheckout=checkout.onclick;
    let bypass=false;
    checkout.onclick=function(e){
      if(bypass){return originalCheckout?.call(this,e)}
      e?.preventDefault();
      if(this.disabled)return;
      openReview();
    };
    document.getElementById('reviewContinue').onclick=()=>{
      closeReview();
      bypass=true;
      checkout.click();
      bypass=false;
    };
  }
})();