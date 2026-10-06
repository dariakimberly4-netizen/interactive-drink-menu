(()=>{
  const css=`
  /* Header readability */
  .top{min-height:70px!important;padding:9px 16px!important;background:#032f24!important;border-bottom:1px solid rgba(201,168,106,.34)!important}
  .mark{width:44px!important;height:44px!important;font-size:24px!important}
  .brand strong{font-size:18px!important;line-height:1.1!important;letter-spacing:.01em!important}
  .brand span{font-size:8.5px!important;line-height:1.25!important;letter-spacing:.12em!important;color:#d9e5e0!important}
  .actions{gap:8px!important}
  .pill{min-height:42px!important;padding:0 14px!important;font-size:11.5px!important;line-height:1!important;font-weight:900!important;border-width:1.5px!important;color:#fff!important;background:rgba(255,255,255,.045)!important}
  .pill:hover,.pill:focus-visible{background:rgba(255,255,255,.1)!important;border-color:#e0bd77!important;outline:none!important}
  #orderPreviewBtn{background:rgba(201,168,106,.10)!important;border-color:rgba(224,189,119,.72)!important}
  .count,#previewHeaderCount{min-width:24px!important;height:24px!important;padding:0 7px!important;font-size:11px!important;font-weight:900!important;display:inline-grid!important;place-items:center!important;border-radius:999px!important;background:#d9b66f!important;color:#173127!important}

  /* Header submenu readability */
  .headerPopover{font-size:13px!important;color:#fff!important;border-width:1.5px!important}
  .quickPanel{width:460px!important;max-width:calc(100vw - 24px)!important;max-height:min(720px,78vh)!important;overflow:auto!important;padding:21px!important;border-color:rgba(224,189,119,.62)!important;background:linear-gradient(180deg,rgba(2,35,27,.998),rgba(3,48,37,.995))!important;box-shadow:0 30px 75px rgba(0,0,0,.5)!important}
  .quickTitle{padding:4px 5px 16px!important;border-bottom:1px solid rgba(224,189,119,.4)!important}
  .quickTitle span{font-size:11px!important;line-height:1.25!important;letter-spacing:.17em!important;color:#f0cf91!important;font-weight:1000!important}
  .quickTitle strong{margin-top:6px!important;font:400 31px/1.08 Georgia,serif!important;color:#fff!important}
  .quickGroup{margin-top:19px!important}
  .quickGroupLabel{margin:0 0 11px!important;color:#d7e2de!important;font-size:11px!important;line-height:1.25!important;font-weight:1000!important;letter-spacing:.14em!important}
  .quickGrid{gap:11px!important}
  .quickAction{min-height:60px!important;padding:0 15px!important;gap:12px!important;border-width:1.4px!important;border-color:rgba(224,189,119,.42)!important;border-radius:14px!important;background:rgba(255,255,255,.075)!important;color:#fff!important;font-size:14px!important;line-height:1.25!important;font-weight:900!important}
  .quickAction span:last-child{font-size:14px!important;line-height:1.25!important;color:#fff!important;font-weight:900!important}
  .quickAction:hover,.quickAction:focus-visible{border-color:#f0cf91!important;background:rgba(224,189,119,.15)!important;box-shadow:0 0 0 2px rgba(240,207,145,.13)!important}
  .quickAction .ico{width:36px!important;height:36px!important;flex:0 0 36px!important;background:rgba(224,189,119,.19)!important;color:#f5d995!important;font-size:17px!important;font-weight:900!important}
  .quickAction.seasonal{border-color:rgba(240,207,145,.72)!important}
  .quickAction.checkout{min-height:60px!important;background:#f4ead8!important;color:#063f2f!important;font-size:14px!important}
  .quickAction.checkout span:last-child{color:#063f2f!important;font-size:14px!important}
  .quickAction.checkout .ico{background:rgba(0,98,65,.12)!important;color:#006241!important}

  /* Store submenu readability */
  .storePanel{width:380px!important;padding:17px!important}
  .storeTitle span{font-size:10px!important;letter-spacing:.17em!important}
  .storeTitle strong{font-size:27px!important;line-height:1.1!important}
  .storeChoice{min-height:60px!important;padding:12px 14px!important}
  .storeChoice b{font-size:14px!important;line-height:1.25!important;color:#fff!important}
  .storeChoice small{font-size:11px!important;line-height:1.35!important;color:#c3d0cb!important}
  .storeCheck{width:30px!important;height:30px!important;font-size:15px!important}
  .storeNote{font-size:10px!important;line-height:1.55!important;color:#b7c6c0!important}

  /* Order preview readability */
  .orderHost{width:420px!important;max-height:min(700px,78vh);overflow:auto;padding:18px!important}
  .orderPreviewHead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:3px 3px 15px;border-bottom:1px solid rgba(201,168,106,.34)}
  .orderPreviewHead span{display:block;font-size:11px;letter-spacing:.17em;color:#f0cf91;font-weight:900}
  .orderPreviewHead strong{display:block;margin-top:5px;font:400 30px Georgia,serif;line-height:1.05;color:#fff}
  .orderBadge{min-width:38px;height:38px;padding:0 10px;display:grid;place-items:center;border-radius:99px;background:#d9b66f;color:#173127;font-size:14px;font-weight:900}
  .orderPreviewItems{display:grid;gap:10px;margin:14px 0}
  .orderPreviewEmpty{padding:22px 8px;text-align:center;color:#d5e0dc;font-size:13px;line-height:1.6}
  .orderPreviewItem{padding:13px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(255,255,255,.06)}
  .orderPreviewItem b{display:block;font-size:14px;line-height:1.4;color:#fff}
  .orderPreviewItem small{display:block;margin-top:5px;color:#c5d2cd;font-size:11.5px;line-height:1.5}
  .orderPreviewLine{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:12px;color:#f0cf91}
  .orderPreviewLine strong{font-size:13px;color:#f5d995}
  .orderPreviewTotal{display:flex;justify-content:space-between;gap:10px;padding:14px 0;border-top:1px solid rgba(201,168,106,.34);font-size:15px;font-weight:900;color:#fff}
  .orderPreviewBtns{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .orderPreviewBtn{width:100%;min-height:46px;border-radius:999px;font-size:12.5px;font-weight:900}
  .orderPreviewBtn.primary{border:0;background:var(--cream);color:#063f2f}
  .orderPreviewBtn.secondary{border:1px solid rgba(224,189,119,.72);background:transparent;color:#fff}
  .orderPreviewNote{margin-top:10px;text-align:center;color:#b7c7c1;font-size:10px;line-height:1.55}

  @media(max-width:700px){
    .top{min-height:64px!important;padding:8px 10px!important}
    .mark{width:40px!important;height:40px!important;font-size:21px!important}
    .brand strong{font-size:15.5px!important}
    .brand span{font-size:7px!important}
    .actions{gap:5px!important}
    .pill{min-height:38px!important;padding:0 9px!important;font-size:10px!important}
    .count,#previewHeaderCount{min-width:22px!important;height:22px!important;font-size:10px!important}
    .quickPanel{padding:17px!important;max-height:78vh!important}
    .quickTitle strong{font-size:27px!important}
    .quickAction{min-height:56px!important;font-size:13.5px!important}
    .quickAction span:last-child{font-size:13.5px!important}
    .storePanel{padding:15px!important}
    .storeTitle strong{font-size:24px!important}
    .storeChoice b{font-size:13px!important}
    .storeChoice small{font-size:10.5px!important}
    .orderHost{max-height:76vh;padding:15px!important}
    .orderPreviewHead strong{font-size:26px!important}
  }
  @media(max-width:620px){
    .quickGrid{grid-template-columns:1fr!important}
    .quickAction.checkout{grid-column:auto!important}
  }
  @media(max-width:470px){
    .top{padding:7px 7px!important}
    .mark{width:36px!important;height:36px!important;font-size:19px!important}
    .brand strong{font-size:14px!important}
    .actions{gap:3px!important}
    .pill{min-height:36px!important;padding:0 7px!important;font-size:9.5px!important}
    .quickPanel{left:2%!important;right:2%!important;width:auto!important;padding:15px!important}
    .quickTitle strong{font-size:25px!important}
    .quickGroupLabel{font-size:10px!important}
    .quickAction{min-height:54px!important;font-size:13px!important}
    .quickAction span:last-child{font-size:13px!important}
    .storePanel{left:2%!important;right:2%!important;width:auto!important;padding:14px!important}
    .orderPreviewBtns{grid-template-columns:1fr}
    .orderPreviewItem{padding:12px}
    .orderPreviewHead strong{font-size:24px!important}
    .orderPreviewHead span{font-size:10px!important}
  }
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const host=document.getElementById('orderPreviewHost');
  if(!host)return;
  host.innerHTML=`<div class="orderPreviewHead"><div><span>YOUR ORDER</span><strong>Order Preview</strong></div><div class="orderBadge" id="previewCount">0</div></div><div class="orderPreviewItems" id="previewItems"><div class="orderPreviewEmpty">Your order is empty.<br>Customize a drink and add it to begin.</div></div><div class="orderPreviewTotal"><span>Subtotal</span><span id="previewTotal">₱0</span></div><div class="orderPreviewBtns"><button class="orderPreviewBtn secondary" id="previewEdit">Edit Order</button><button class="orderPreviewBtn primary" id="previewCheckout">Checkout</button></div><div class="orderPreviewNote">Prototype only. No payment or real Starbucks order is processed.</div>`;
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  function getCart(){try{return JSON.parse(localStorage.getItem('menuOrbitCart'))||[]}catch{return []}}
  function render(){
    const cart=getCart();
    const count=cart.reduce((s,i)=>s+(Number(i.qty)||1),0);
    const total=cart.reduce((s,i)=>s+(Number(i.amount)||0)*(Number(i.qty)||1),0);
    document.getElementById('previewCount').textContent=count;
    document.getElementById('previewHeaderCount').textContent=count;
    document.getElementById('previewTotal').textContent=money(total);
    const box=document.getElementById('previewItems');
    if(!cart.length){box.innerHTML='<div class="orderPreviewEmpty">Your order is empty.<br>Customize a drink and add it to begin.</div>';return}
    box.innerHTML=cart.slice(0,5).map(i=>`<div class="orderPreviewItem"><b>${i.name}</b><small>${[i.size,i.milk&&i.milk!=='—'?i.milk:'',i.sweet&&i.sweet!=='—'?i.sweet+' sweet':''].filter(Boolean).join(' • ')}</small><div class="orderPreviewLine"><span>${i.qty||1} ×</span><strong>${money((i.amount||0)*(i.qty||1))}</strong></div></div>`).join('')+(cart.length>5?`<div class="orderPreviewEmpty">+ ${cart.length-5} more item${cart.length-5===1?'':'s'}</div>`:'');
  }
  document.getElementById('previewEdit').onclick=()=>document.getElementById('order')?.click();
  document.getElementById('previewCheckout').onclick=()=>{document.getElementById('order')?.click();setTimeout(()=>{const b=document.getElementById('checkoutBtn');if(b&&!b.disabled)b.click()},100)};
  const target=document.getElementById('cartItems');
  if(target)new MutationObserver(render).observe(target,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',e=>{if(e.key==='menuOrbitCart')render()});
  document.addEventListener('click',()=>setTimeout(render,0));
  render();
})();

window.addEventListener('load',()=>{
  if(document.querySelector('script[data-menu-orbit-loyalty]'))return;
  const s=document.createElement('script');
  s.src='./menu-orbit-pro-loyalty.js';
  s.dataset.menuOrbitLoyalty='1';
  document.body.appendChild(s);
});

window.addEventListener('load',()=>{
  if(document.querySelector('script[data-menu-orbit-status]'))return;
  const s=document.createElement('script');
  s.src='./menu-orbit-pro-status.js';
  s.dataset.menuOrbitStatus='1';
  document.body.appendChild(s);
});