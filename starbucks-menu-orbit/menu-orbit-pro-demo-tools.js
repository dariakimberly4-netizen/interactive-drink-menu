(()=>{
  const $=id=>document.getElementById(id);
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
  const currentOrder=()=>read('menuOrbitLastReceipt',null)||read('menuOrbitLastOrder',null);

  const css=`
  .statusEta{margin-top:10px;padding:13px 14px;border:1px solid rgba(126,199,149,.48);border-radius:14px;background:rgba(79,157,108,.10);display:flex;align-items:center;justify-content:space-between;gap:12px;color:#dff3e6}
  .statusEta span{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#9fcbb0;font-weight:1000}.statusEta strong{display:block;margin-top:3px;color:#fff;font-size:13px}.statusEtaTime{color:#f0cf91!important;font-size:14px!important;white-space:nowrap}
  .readyAlert{position:fixed;right:18px;top:86px;z-index:520;width:min(360px,calc(100vw - 28px));padding:15px;border:1px solid rgba(240,207,145,.72);border-radius:16px;background:linear-gradient(180deg,#0a4937,#063f2f);box-shadow:0 22px 55px rgba(0,0,0,.48),0 0 30px rgba(240,207,145,.22);transform:translateY(-12px);opacity:0;pointer-events:none;transition:.22s ease}
  .readyAlert.show{transform:none;opacity:1;pointer-events:auto}.readyAlertEyebrow{font-size:8px;letter-spacing:.18em;color:#f0cf91;font-weight:1000}.readyAlert strong{display:block;margin-top:5px;color:#fff;font:400 21px Georgia,serif}.readyAlert p{margin:6px 0 11px;color:#d6e3de;font-size:10px;line-height:1.5}.readyAlert button{min-height:38px;padding:0 14px;border:0;border-radius:999px;background:#f4ead8;color:#063f2f;font-size:10px;font-weight:1000;cursor:pointer}
  .quickAction.demoReset{border-color:rgba(255,177,158,.5)!important;background:rgba(129,42,32,.16)!important}.quickAction.demoReset .ico{color:#ffc0b3!important;background:rgba(184,74,58,.18)!important}.quickAction.demoReset span:last-child{color:#ffd4ca!important}
  @media(max-width:560px){.statusEta{align-items:flex-start}.readyAlert{top:72px;right:10px;width:calc(100vw - 20px)}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const alert=document.createElement('div');
  alert.className='readyAlert';alert.id='readyAlert';
  alert.innerHTML='<div class="readyAlertEyebrow">ORDER STATUS</div><strong>Ready for Pickup</strong><p>Your prototype order has reached the final demo stage.</p><button id="readyViewStatus">View Order Status</button>';
  document.body.appendChild(alert);
  $('readyViewStatus').onclick=()=>{alert.classList.remove('show');window.menuOrbitOpenStatus?.()};

  function etaText(order){
    if(!order?.date)return {label:'Demo ETA unavailable',value:'—'};
    const readyAt=new Date(order.date).getTime()+90000;
    const left=Math.max(0,Math.ceil((readyAt-Date.now())/1000));
    if(left<=0)return {label:'Estimated demo pickup',value:'Ready now'};
    if(left<60)return {label:'Estimated demo pickup',value:`${left}s`};
    const min=Math.floor(left/60),sec=left%60;
    return {label:'Estimated demo pickup',value:`${min}:${String(sec).padStart(2,'0')}`};
  }

  function updateEta(){
    const layer=$('statusLayer'),body=$('statusBody'),order=currentOrder();
    if(!layer?.classList.contains('open')||!body||!order)return;
    let eta=body.querySelector('.statusEta');
    if(!eta){
      eta=document.createElement('div');eta.className='statusEta';
      const now=body.querySelector('.statusNow');
      if(now)now.insertAdjacentElement('afterend',eta);else body.appendChild(eta);
    }
    const t=etaText(order);
    eta.innerHTML=`<div><span>ORDER ETA</span><strong>${t.label}</strong></div><strong class="statusEtaTime">${t.value}</strong>`;
  }

  function checkReadyAlert(){
    const order=currentOrder();if(!order?.date||!order?.code)return;
    const elapsed=(Date.now()-new Date(order.date).getTime())/1000;
    const alerted=localStorage.getItem('menuOrbitReadyAlertedCode');
    if(elapsed>=90&&alerted!==order.code){
      localStorage.setItem('menuOrbitReadyAlertedCode',order.code);
      alert.querySelector('p').textContent=`${order.code} is ready for pickup in this prototype demo.`;
      alert.classList.add('show');
      setTimeout(()=>alert.classList.remove('show'),10000);
    }
  }

  function addReset(){
    if($('sideDemoReset'))return;
    const panel=$('quickAccessPanel');if(!panel)return;
    const groups=panel.querySelectorAll('.quickGroup');
    let system=[...groups].find(g=>g.querySelector('.quickGroupLabel')?.textContent.trim().toLowerCase()==='system');
    if(!system){
      system=document.createElement('div');system.className='quickGroup';
      system.innerHTML='<div class="quickGroupLabel">System</div><div class="quickGrid"></div>';
      panel.appendChild(system);
    }
    const grid=system.querySelector('.quickGrid');
    const b=document.createElement('button');b.className='quickAction demoReset';b.id='sideDemoReset';b.innerHTML='<span class="ico">↺</span><span>Reset Demo</span>';
    grid.appendChild(b);
    b.onclick=()=>{
      ['menuOrbitCart','menuOrbitFavorites','menuOrbitRecent','menuOrbitLastOrder','menuOrbitLastReceipt','menuOrbitOrderHistory','menuOrbitMyUsual','menuOrbitReadyAlertedCode'].forEach(k=>localStorage.removeItem(k));
      const t=$('toast');if(t){t.textContent='Demo data reset';t.classList.add('show')}
      setTimeout(()=>location.reload(),450);
    };
  }

  addReset();
  const statusBody=$('statusBody');
  if(statusBody)new MutationObserver(()=>setTimeout(updateEta,0)).observe(statusBody,{childList:true,subtree:true});
  setInterval(()=>{updateEta();checkReadyAlert()},1000);
  document.addEventListener('click',()=>setTimeout(()=>{addReset();updateEta();checkReadyAlert()},0));
})();