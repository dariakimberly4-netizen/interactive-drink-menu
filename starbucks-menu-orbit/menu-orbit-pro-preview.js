(()=>{
  const css=`
  @media(min-width:1181px){
    body{padding-right:315px!important}
    .top{margin-right:-315px!important}
    .orderPreview{position:fixed;right:18px;top:50%;transform:translateY(-38%);z-index:79;width:285px;max-height:76vh;overflow:auto;padding:18px;border:1px solid rgba(201,168,106,.42);border-radius:22px;background:linear-gradient(180deg,rgba(2,27,21,.97),rgba(3,42,32,.94));box-shadow:0 24px 55px rgba(0,0,0,.34);backdrop-filter:blur(16px)}
  }
  .orderPreviewHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:13px;border-bottom:1px solid rgba(201,168,106,.26)}
  .orderPreviewHead span{display:block;font-size:9px;letter-spacing:.2em;color:#e0bd77;font-weight:900}
  .orderPreviewHead strong{display:block;margin-top:5px;font:400 25px Georgia,serif;line-height:1.05}
  .orderBadge{min-width:34px;height:34px;padding:0 9px;display:grid;place-items:center;border-radius:99px;background:#c9a86a;color:#173127;font-size:12px;font-weight:900}
  .orderPreviewItems{display:grid;gap:9px;margin:14px 0}
  .orderPreviewEmpty{padding:21px 6px;text-align:center;color:#b5c4be;font-size:11px;line-height:1.55}
  .orderPreviewItem{padding:12px;border:1px solid rgba(255,255,255,.11);border-radius:12px;background:rgba(255,255,255,.045)}
  .orderPreviewItem b{display:block;font-size:12px;line-height:1.35}
  .orderPreviewItem small{display:block;margin-top:5px;color:#b0c0ba;font-size:9.5px;line-height:1.45}
  .orderPreviewLine{display:flex;justify-content:space-between;gap:9px;margin-top:8px;font-size:10px;color:#e5c783}
  .orderPreviewLine strong{font-size:11px}
  .orderPreviewTotal{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-top:1px solid rgba(201,168,106,.26);font-size:13px;font-weight:900}
  .orderPreviewBtns{display:grid;gap:9px}
  .orderPreviewBtn{width:100%;min-height:44px;border-radius:999px;font-size:11px;font-weight:900}
  .orderPreviewBtn.primary{border:0;background:var(--cream);color:#063f2f}
  .orderPreviewBtn.secondary{border:1px solid rgba(201,168,106,.5);background:transparent;color:#fff}
  .orderPreviewNote{margin-top:10px;text-align:center;color:#9aada5;font-size:8.5px;line-height:1.5}
  @media(max-width:1180px){
    body{padding-right:0!important}
    .top{margin-right:0!important}
    .orderPreview{width:min(94%,760px);margin:0 auto 14px;padding:13px;border:1px solid rgba(201,168,106,.34);border-radius:18px;background:rgba(2,27,21,.86)}
    .orderPreviewItems{display:flex;overflow-x:auto;gap:9px;margin:10px 0}
    .orderPreviewItem{flex:0 0 220px}
    .orderPreviewEmpty{width:100%}
    .orderPreviewBtns{grid-template-columns:1fr 1fr}
  }
  @media(max-width:560px){.orderPreviewBtns{grid-template-columns:1fr}.orderPreviewHead strong{font-size:20px}.orderPreviewItem{flex-basis:205px}.orderPreviewBtn{min-height:46px;font-size:11.5px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const panel=document.createElement('aside');
  panel.className='orderPreview';
  panel.setAttribute('aria-label','Current order preview');
  panel.innerHTML=`<div class="orderPreviewHead"><div><span>YOUR ORDER</span><strong>Order Preview</strong></div><div class="orderBadge" id="previewCount">0</div></div><div class="orderPreviewItems" id="previewItems"><div class="orderPreviewEmpty">Your order is empty.<br>Customize a drink and add it to begin.</div></div><div class="orderPreviewTotal"><span>Subtotal</span><span id="previewTotal">₱0</span></div><div class="orderPreviewBtns"><button class="orderPreviewBtn secondary" id="previewEdit">Edit Order</button><button class="orderPreviewBtn primary" id="previewCheckout">Checkout</button></div><div class="orderPreviewNote">Prototype only. No payment or real Starbucks order is processed.</div>`;
  const shell=document.querySelector('.experienceShell');
  if(shell) shell.insertAdjacentElement('afterend',panel); else document.body.appendChild(panel);
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  function getCart(){try{return JSON.parse(localStorage.getItem('menuOrbitCart'))||[]}catch{return []}}
  function render(){
    const cart=getCart();
    const count=cart.reduce((s,i)=>s+(Number(i.qty)||1),0);
    const total=cart.reduce((s,i)=>s+(Number(i.amount)||0)*(Number(i.qty)||1),0);
    document.getElementById('previewCount').textContent=count;
    document.getElementById('previewTotal').textContent=money(total);
    const box=document.getElementById('previewItems');
    if(!cart.length){box.innerHTML='<div class="orderPreviewEmpty">Your order is empty.<br>Customize a drink and add it to begin.</div>';return}
    box.innerHTML=cart.slice(0,5).map(i=>`<div class="orderPreviewItem"><b>${i.name}</b><small>${[i.size,i.milk!=='—'?i.milk:'',i.sweet!=='—'?i.sweet+' sweet':''].filter(Boolean).join(' • ')}</small><div class="orderPreviewLine"><span>${i.qty||1} ×</span><strong>${money((i.amount||0)*(i.qty||1))}</strong></div></div>`).join('')+(cart.length>5?`<div class="orderPreviewEmpty">+ ${cart.length-5} more item${cart.length-5===1?'':'s'}</div>`:'');
  }
  document.getElementById('previewEdit').onclick=()=>document.getElementById('order')?.click();
  document.getElementById('previewCheckout').onclick=()=>{document.getElementById('order')?.click();setTimeout(()=>{const b=document.getElementById('checkoutBtn');if(b&&!b.disabled)b.click()},100)};
  const target=document.getElementById('cartItems');
  if(target)new MutationObserver(render).observe(target,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',e=>{if(e.key==='menuOrbitCart')render()});
  document.addEventListener('click',()=>setTimeout(render,0));
  render();
})();