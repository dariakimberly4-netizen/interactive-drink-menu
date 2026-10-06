(()=>{
  const css=`
  .orderHost{width:340px;max-height:min(620px,76vh);overflow:auto}
  .orderPreviewHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 12px;border-bottom:1px solid rgba(201,168,106,.26)}
  .orderPreviewHead span{display:block;font-size:8px;letter-spacing:.2em;color:#e0bd77;font-weight:900}
  .orderPreviewHead strong{display:block;margin-top:4px;font:400 22px Georgia,serif;line-height:1.05}
  .orderBadge{min-width:30px;height:30px;padding:0 8px;display:grid;place-items:center;border-radius:99px;background:#c9a86a;color:#173127;font-size:11px;font-weight:900}
  .orderPreviewItems{display:grid;gap:7px;margin:11px 0}
  .orderPreviewEmpty{padding:18px 5px;text-align:center;color:#b5c4be;font-size:10px;line-height:1.5}
  .orderPreviewItem{padding:10px;border:1px solid rgba(255,255,255,.11);border-radius:11px;background:rgba(255,255,255,.045)}
  .orderPreviewItem b{display:block;font-size:10px;line-height:1.3}
  .orderPreviewItem small{display:block;margin-top:4px;color:#b0c0ba;font-size:8.5px;line-height:1.4}
  .orderPreviewLine{display:flex;justify-content:space-between;gap:8px;margin-top:7px;font-size:9px;color:#e5c783}
  .orderPreviewLine strong{font-size:10px}
  .orderPreviewTotal{display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-top:1px solid rgba(201,168,106,.26);font-size:12px;font-weight:900}
  .orderPreviewBtns{display:grid;grid-template-columns:1fr 1fr;gap:7px}
  .orderPreviewBtn{width:100%;min-height:39px;border-radius:999px;font-size:9.5px;font-weight:900}
  .orderPreviewBtn.primary{border:0;background:var(--cream);color:#063f2f}
  .orderPreviewBtn.secondary{border:1px solid rgba(201,168,106,.5);background:transparent;color:#fff}
  .orderPreviewNote{margin-top:8px;text-align:center;color:#9aada5;font-size:7.5px;line-height:1.45}
  @media(max-width:700px){.orderHost{max-height:72vh}.orderPreviewHead strong{font-size:20px}}
  @media(max-width:470px){.orderPreviewBtns{grid-template-columns:1fr}.orderPreviewItem{padding:9px}}
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