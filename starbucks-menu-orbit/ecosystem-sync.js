(()=>{
  if(window.__moEcosystem)return; window.__moEcosystem=true;
  const Q='mo_demo_orders_v1',N='mo_demo_notifications_v1',H='menuOrbitOrders';
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const now=()=>new Date().toISOString();
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:0,maximumFractionDigits:2});
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const statuses={ORDER_RECEIVED:'Order received',ACCEPTED:'Accepted by cashier',PREPARING:'Preparing',READY:'Ready for pickup',COLLECTED:'Collected'};
  const rank={ORDER_RECEIVED:1,ACCEPTED:2,PREPARING:3,READY:4,COLLECTED:5};

  const style=document.createElement('style');
  style.textContent=`
    .mo-live-btn{position:fixed;z-index:135;right:16px;bottom:18px;min-height:50px;border:1px solid rgba(244,200,111,.7);border-radius:999px;padding:0 16px;background:linear-gradient(135deg,#f4efe6,#f4c86f);color:#07331f;font-weight:950;box-shadow:0 16px 42px rgba(0,0,0,.4)}
    .mo-live-count{display:inline-grid;place-items:center;min-width:22px;height:22px;margin-left:7px;padding:0 6px;border-radius:99px;background:#00754a;color:#fff;font-size:11px}
    .mo-eco-modal{position:fixed;z-index:170;inset:0;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.67);backdrop-filter:blur(8px)}
    .mo-eco-modal.open{display:flex}.mo-eco-card{width:min(760px,100%);max-height:88vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:26px;background:#08251b;color:#fff;padding:20px;box-shadow:0 30px 90px rgba(0,0,0,.55)}
    .mo-eco-head{display:flex;gap:12px;align-items:flex-start;position:sticky;top:-20px;background:#08251b;padding:18px 0 12px;z-index:2}.mo-eco-head>div{flex:1}.mo-eco-head h2{margin:0;font:700 30px Georgia,serif}.mo-eco-head p{margin:5px 0 0;color:#b8cbc1;font-size:12px}.mo-eco-close{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:#fff;font-size:22px}
    .mo-order{border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:15px;margin:10px 0;background:rgba(255,255,255,.045)}.mo-order-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.mo-order h3{margin:0;font-size:18px}.mo-order small{color:#acc0b6}.mo-status{display:inline-block;border:1px solid rgba(0,168,98,.35);border-radius:999px;padding:6px 9px;background:rgba(0,168,98,.14);color:#9ce8bf;font-size:11px;font-weight:900}
    .mo-items{margin:11px 0}.mo-item{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:13px}.mo-item:last-child{border-bottom:0}.mo-item span{color:#aebfb6}
    .mo-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.mo-actions button{min-height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;padding:0 13px;font-weight:900}.mo-actions .primary{background:linear-gradient(135deg,#00a862,#00754a);border:0}.mo-actions .gold{background:#f4efe6;color:#07331f}
    .mo-empty{text-align:center;color:#aac0b5;padding:38px 12px}.mo-steps{display:grid;gap:4px;margin:14px 0}.mo-step{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;color:#78958a}.mo-step i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.08);font-style:normal;font-size:11px;font-weight:900}.mo-step.on{color:#fff;background:rgba(0,168,98,.08)}.mo-step.on i{background:#00a862}
    .mo-rolebar{display:flex;gap:7px;overflow:auto;margin:6px 0 14px}.mo-rolebar a{white-space:nowrap;text-decoration:none;min-height:38px;display:flex;align-items:center;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:0 11px;color:#fff;background:rgba(255,255,255,.06);font-size:11px;font-weight:850}
    @media(max-width:700px){.mo-live-btn{right:10px;bottom:188px;font-size:11px}.mo-eco-card{padding:16px}.mo-order-top{display:block}.mo-status{margin-top:8px}}
  `;
  document.head.appendChild(style);

  function syncCustomerOrders(){
    const history=get(H,[]).slice(0,8),queue=get(Q,[]);
    let changed=false;
    history.forEach((o,i)=>{
      if(!o?.code||queue.some(q=>q.code===o.code))return;
      queue.push({
        id:'d'+Date.now()+i,
        code:o.code,
        ref:o.code,
        items:(o.items||[]).map(x=>({name:x.name||'Item',qty:+x.qty||1,size:x.size||'',style:x.style||'',details:[x.size,x.style,x.milk,x.note].filter(Boolean).join(' • '),price:+x.price||0,img:x.img||''})),
        total:+o.total||0,
        status:'ORDER_RECEIVED',
        createdAt:o.createdAt||new Date().toLocaleString('en-PH'),
        updatedAt:now()
      });
      changed=true;
      notify(o.code,'Order received','Your demo order has entered the cashier queue.');
    });
    if(changed)put(Q,queue.slice(-30));
  }
  function notify(code,title,text){
    const list=get(N,[]);
    const token=code+'|'+title;
    if(list.some(x=>x.token===token))return;
    list.unshift({token,code,title,text,at:new Date().toLocaleString('en-PH'),read:false});
    put(N,list.slice(0,50));
  }
  function updateStatus(id,status){
    const q=get(Q,[]),o=q.find(x=>x.id===id); if(!o)return;
    o.status=status;o.updatedAt=now();
    if(status==='ACCEPTED')o.acceptedAt=now();
    if(status==='PREPARING')o.preparingAt=now();
    if(status==='READY')o.readyAt=now();
    if(status==='COLLECTED')o.collectedAt=now();
    put(Q,q);
    const messages={
      ACCEPTED:['Order accepted','The cashier accepted your demo order.'],
      PREPARING:['Preparing now','A barista started preparing your order.'],
      READY:['Ready for pickup','Your demo order is ready for pickup.'],
      COLLECTED:['Order collected','Your demo order journey is complete.']
    };
    if(messages[status])notify(o.code,...messages[status]);
    window.dispatchEvent(new CustomEvent('mo-order-update',{detail:o}));
  }
  function modal(title,sub){
    let m=document.querySelector('#moEcoModal');
    if(!m){m=document.createElement('div');m.id='moEcoModal';m.className='mo-eco-modal';m.innerHTML='<div class="mo-eco-card"><div class="mo-eco-head"><div><h2 id="moEcoTitle"></h2><p id="moEcoSub"></p></div><button class="mo-eco-close" aria-label="Close">×</button></div><div id="moEcoBody"></div></div>';document.body.appendChild(m);m.querySelector('.mo-eco-close').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('#moEcoTitle').textContent=title;m.querySelector('#moEcoSub').textContent=sub||'';m.classList.add('open');return m.querySelector('#moEcoBody')
  }
  const itemHtml=o=>(o.items||[]).map(i=>'<div class="mo-item"><b>'+esc(i.qty)+'× '+esc(i.name)+'</b><br><span>'+esc([i.size,i.style].filter(Boolean).join(' • '))+'</span></div>').join('');
  const rolebar=()=>'<div class="mo-rolebar"><a href="index.html">Customer</a><a href="cashier.html">Cashier</a><a href="barista.html">Barista</a><a href="inventory-demo.html">Inventory</a><a href="manager.html">Manager</a></div>';

  function customer(){
    syncCustomerOrders();
    const b=document.createElement('button');b.className='mo-live-btn';b.id='moOrderStatusBtn';b.innerHTML='🔔 ORDER <span class="mo-live-count" id="moNoticeCount">0</span>';document.body.appendChild(b);
    window.NewFeatureHighlight?.register(b,'customer-order-status-v1','NEW');
    const refresh=()=>{const unread=get(N,[]).filter(x=>!x.read).length;const c=document.querySelector('#moNoticeCount');if(c)c.textContent=unread};
    b.onclick=()=>{
      const notices=get(N,[]);notices.forEach(x=>x.read=true);put(N,notices);refresh();
      const q=get(Q,[]),o=q[q.length-1],out=modal('Live Order Status','Customer → Cashier → Barista demo connection');
      if(!o){out.innerHTML=rolebar()+'<div class="mo-empty">Complete a demo checkout to create a live order.</div>';return}
      const r=rank[o.status]||1;
      out.innerHTML=rolebar()+'<div class="mo-order"><div class="mo-order-top"><div><h3>'+esc(o.code)+'</h3><small>'+esc(o.createdAt)+'</small></div><span class="mo-status">'+esc(statuses[o.status]||o.status)+'</span></div><div class="mo-steps">'+
        [['ORDER_RECEIVED','1','Order received'],['ACCEPTED','2','Accepted by cashier'],['PREPARING','3','Preparing'],['READY','4','Ready for pickup'],['COLLECTED','5','Collected']].map((s,i)=>'<div class="mo-step '+(r>=i+1?'on':'')+'"><i>'+s[1]+'</i>'+s[2]+'</div>').join('')+
        '</div><div class="mo-items">'+itemHtml(o)+'</div><div class="mo-order-top"><b>Total</b><b>'+money(o.total)+'</b></div></div>'+
        (notices.length?'<div class="mo-order"><h3>Notifications</h3>'+notices.slice(0,5).map(n=>'<div class="mo-item"><b>'+esc(n.title)+'</b><br><span>'+esc(n.text)+' • '+esc(n.at)+'</span></div>').join('')+'</div>':'');
    };
    refresh();
    setInterval(()=>{syncCustomerOrders();refresh()},1500);
  }

  function cashier(){
    syncCustomerOrders();
    const b=document.createElement('button');b.className='mo-live-btn';b.id='moCashierQueueBtn';b.innerHTML='🧾 LIVE ORDERS <span class="mo-live-count" id="moCashierCount">0</span>';document.body.appendChild(b);
    window.NewFeatureHighlight?.register(b,'cashier-live-orders-v1','NEW');
    const refreshCount=()=>{const n=get(Q,[]).filter(o=>o.status==='ORDER_RECEIVED').length;document.querySelector('#moCashierCount').textContent=n};
    const open=()=>{
      syncCustomerOrders();
      const out=modal('Cashier Live Orders','Accept customer demo orders and send them to the barista queue');
      const orders=get(Q,[]).filter(o=>['ORDER_RECEIVED','ACCEPTED'].includes(o.status)).slice().reverse();
      out.innerHTML=rolebar()+(orders.length?orders.map(o=>'<article class="mo-order"><div class="mo-order-top"><div><h3>'+esc(o.code)+'</h3><small>'+esc(o.createdAt)+'</small></div><span class="mo-status">'+esc(statuses[o.status])+'</span></div><div class="mo-items">'+itemHtml(o)+'</div><div class="mo-order-top"><b>Total</b><b>'+money(o.total)+'</b></div><div class="mo-actions">'+(o.status==='ORDER_RECEIVED'?'<button class="primary" data-accept="'+esc(o.id)+'">Accept Order → Barista</button>':'<button class="gold" disabled>Sent to Barista ✓</button>')+'</div></article>').join(''):'<div class="mo-empty">No customer orders waiting.</div>');
      out.querySelectorAll('[data-accept]').forEach(x=>x.onclick=()=>{updateStatus(x.dataset.accept,'ACCEPTED');refreshCount();open()});
    };
    b.onclick=open;refreshCount();setInterval(refreshCount,1500);
  }

  function barista(){
    const b=document.createElement('button');b.className='mo-live-btn';b.id='moBaristaQueueBtn';b.innerHTML='☕ BARISTA QUEUE <span class="mo-live-count" id="moBaristaCount">0</span>';document.body.appendChild(b);
    window.NewFeatureHighlight?.register(b,'barista-live-queue-v1','NEW');
    const refreshCount=()=>{const n=get(Q,[]).filter(o=>['ACCEPTED','PREPARING','READY'].includes(o.status)).length;document.querySelector('#moBaristaCount').textContent=n};
    const open=()=>{
      const out=modal('Barista Live Queue','Prepare the same order accepted on the Cashier page');
      const orders=get(Q,[]).filter(o=>['ACCEPTED','PREPARING','READY','COLLECTED'].includes(o.status)).slice().reverse();
      out.innerHTML=rolebar()+(orders.length?orders.map(o=>'<article class="mo-order order"><div class="mo-order-top"><div><h3 class="ref">'+esc(o.code)+'</h3><small>'+esc(o.createdAt)+'</small></div><span class="mo-status">'+esc(statuses[o.status])+'</span></div><div class="mo-items">'+(o.items||[]).map(i=>'<div class="mo-item ticket"><h3 style="font-size:14px;margin:0">'+esc(i.qty)+'× '+esc(i.name)+'</h3><div class="details">'+esc([i.size,i.style].filter(Boolean).join(' • '))+'</div></div>').join('')+'</div><div class="mo-actions">'+
        (o.status==='ACCEPTED'?'<button class="primary" data-start="'+esc(o.id)+'">Start Preparing</button>':'')+
        (o.status==='PREPARING'?'<button class="gold" data-release="'+esc(o.id)+'" data-ready="'+esc(o.id)+'">Mark Ready + Deduct Inventory</button>':'')+
        (o.status==='READY'?'<button class="primary" data-collect="'+esc(o.id)+'">Mark Collected</button>':'')+
        (o.status==='COLLECTED'?'<button disabled>Completed ✓</button>':'')+
        '</div></article>').join(''):'<div class="mo-empty">No accepted orders yet. Accept one from Cashier first.</div>');
      out.querySelectorAll('[data-start]').forEach(x=>x.onclick=()=>{updateStatus(x.dataset.start,'PREPARING');refreshCount();open()});
      out.querySelectorAll('[data-ready]').forEach(x=>x.onclick=()=>{const id=x.dataset.ready;setTimeout(()=>{updateStatus(id,'READY');refreshCount();open()},350)});
      out.querySelectorAll('[data-collect]').forEach(x=>x.onclick=()=>{updateStatus(x.dataset.collect,'COLLECTED');refreshCount();open()});
    };
    b.onclick=open;refreshCount();setInterval(refreshCount,1500);
  }

  const path=location.pathname.toLowerCase();
  if(/\/index\.html$/.test(path)||/starbucks-menu-orbit\/$/.test(path))customer();
  else if(path.endsWith('/cashier.html'))cashier();
  else if(path.endsWith('/barista.html'))barista();
  window.MenuOrbitDemoEcosystem={syncCustomerOrders,updateStatus,getOrders:()=>get(Q,[]),reset:()=>{localStorage.removeItem(Q);localStorage.removeItem(N)}};
})();