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

  /* Quick Access readability */
  .quickPanel{width:410px!important;max-width:calc(100vw - 24px)!important;max-height:min(690px,76vh)!important;overflow:auto!important;padding:18px!important;border-color:rgba(224,189,119,.56)!important;background:linear-gradient(180deg,rgba(2,35,27,.995),rgba(3,48,37,.99))!important;box-shadow:0 28px 70px rgba(0,0,0,.48)!important}
  .quickTitle{padding:3px 4px 14px!important;border-bottom:1px solid rgba(224,189,119,.34)!important}
  .quickTitle span{font-size:9.5px!important;line-height:1.2!important;letter-spacing:.18em!important;color:#f0cf91!important;font-weight:1000!important}
  .quickTitle strong{margin-top:5px!important;font:400 28px/1.08 Georgia,serif!important;color:#fff!important}
  .quickGroup{margin-top:16px!important}
  .quickGroupLabel{margin:0 0 9px!important;color:#c6d4cf!important;font-size:9px!important;line-height:1.2!important;font-weight:1000!important;letter-spacing:.15em!important}
  .quickGrid{gap:10px!important}
  .quickAction{min-height:54px!important;padding:0 13px!important;gap:10px!important;border-width:1.25px!important;border-color:rgba(224,189,119,.38)!important;border-radius:13px!important;background:rgba(255,255,255,.065)!important;color:#fff!important;font-size:12.5px!important;line-height:1.2!important;font-weight:900!important}
  .quickAction span:last-child{font-size:12.5px!important;line-height:1.2!important;color:#fff!important}
  .quickAction:hover,.quickAction:focus-visible{border-color:#f0cf91!important;background:rgba(224,189,119,.13)!important;box-shadow:0 0 0 2px rgba(240,207,145,.12)!important}
  .quickAction .ico{width:32px!important;height:32px!important;flex:0 0 32px!important;background:rgba(224,189,119,.18)!important;color:#f5d995!important;font-size:15px!important;font-weight:900!important}
  .quickAction.seasonal{border-color:rgba(240,207,145,.7)!important}
  .quickAction.checkout{min-height:54px!important;background:#f4ead8!important;color:#063f2f!important;font-size:13px!important}
  .quickAction.checkout span:last-child{color:#063f2f!important;font-size:13px!important}
  .quickAction.checkout .ico{background:rgba(0,98,65,.12)!important;color:#006241!important}

  /* Order preview readability */
  .orderHost{width:390px;max-height:min(680px,78vh);overflow:auto;padding:16px!important}
  .orderPreviewHead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:3px 3px 14px;border-bottom:1px solid rgba(201,168,106,.34)}
  .orderPreviewHead span{display:block;font-size:10px;letter-spacing:.18em;color:#f0cf91;font-weight:900}
  .orderPreviewHead strong{display:block;margin-top:5px;font:400 28px Georgia,serif;line-height:1.05;color:#fff}
  .orderBadge{min-width:36px;height:36px;padding:0 10px;display:grid;place-items:center;border-radius:99px;background:#d9b66f;color:#173127;font-size:13px;font-weight:900}
  .orderPreviewItems{display:grid;gap:9px;margin:13px 0}
  .orderPreviewEmpty{padding:20px 7px;text-align:center;color:#d5e0dc;font-size:12px;line-height:1.55}
  .orderPreviewItem{padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(255,255,255,.06)}
  .orderPreviewItem b{display:block;font-size:12.5px;line-height:1.35;color:#fff}
  .orderPreviewItem small{display:block;margin-top:5px;color:#c5d2cd;font-size:10.5px;line-height:1.45}
  .orderPreviewLine{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:11px;color:#f0cf91}
  .orderPreviewLine strong{font-size:12px;color:#f5d995}
  .orderPreviewTotal{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-top:1px solid rgba(201,168,106,.34);font-size:14px;font-weight:900;color:#fff}
  .orderPreviewBtns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .orderPreviewBtn{width:100%;min-height:44px;border-radius:999px;font-size:11.5px;font-weight:900}
  .orderPreviewBtn.primary{border:0;background:var(--cream);color:#063f2f}
  .orderPreviewBtn.secondary{border:1px solid rgba(224,189,119,.72);background:transparent;color:#fff}
  .orderPreviewNote{margin-top:10px;text-align:center;color:#b7c7c1;font-size:9px;line-height:1.5}

  @media(max-width:700px){
    .top{min-height:64px!important;padding:8px 10px!important}
    .mark{width:40px!important;height:40px!important;font-size:21px!important}
    .brand strong{font-size:15.5px!important}
    .brand span{font-size:7px!important}
    .actions{gap:5px!important}
    .pill{min-height:38px!important;padding:0 9px!important;font-size:10px!important}
    .count,#previewHeaderCount{min-width:22px!important;height:22px!important;font-size:10px!important}
    .quickPanel{padding:15px!important;max-height:76vh!important}
    .quickTitle strong{font-size:25px!important}
    .quickAction{min-height:52px!important;font-size:12px!important}
    .quickAction span:last-child{font-size:12px!important}
    .orderHost{max-height:74vh;padding:14px!important}
    .orderPreviewHead strong{font-size:24px}
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
    .quickPanel{left:2%!important;right:2%!important;width:auto!important;padding:14px!important}
    .quickTitle strong{font-size:23px!important}
    .quickGroupLabel{font-size:9px!important}
    .quickAction{min-height:52px!important;font-size:12.5px!important}
    .quickAction span:last-child{font-size:12.5px!important}
    .orderPreviewBtns{grid-template-columns:1fr}
    .orderPreviewItem{padding:11px}
    .orderPreviewHead strong{font-size:22px}
    .orderPreviewHead span{font-size:9px}
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