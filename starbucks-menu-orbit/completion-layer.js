(()=>{
  if(window.__moCompletionLayer)return;window.__moCompletionLayer=true;
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:0});
  const qKey='mo_demo_orders_v1',nKey='mo_demo_notifications_v1';
  const style=document.createElement('style');style.textContent=`
    .mo-sheet{position:fixed;z-index:175;inset:0;display:none;align-items:center;justify-content:center;padding:15px;background:rgba(0,0,0,.68);backdrop-filter:blur(8px)}
    .mo-sheet.open{display:flex}.mo-sheet-card{width:min(720px,100%);max-height:89vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:27px;background:#08251b;color:#fff;padding:20px;box-shadow:0 30px 85px rgba(0,0,0,.55)}
    .mo-sheet-head{display:flex;gap:12px;align-items:flex-start;position:sticky;top:-20px;background:#08251b;padding:17px 0 12px;z-index:3}.mo-sheet-head>div{flex:1}.mo-sheet-head h2{margin:0;font:700 29px Georgia,serif}.mo-sheet-head p{margin:5px 0 0;color:#b5c9bf;font-size:12px;line-height:1.45}.mo-kicker{font-size:10px;letter-spacing:.17em;color:#f4c86f;font-weight:950;text-transform:uppercase}.mo-x{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.07);color:#fff;font-size:22px}
    .mo-banner,.demo-banner{padding:13px;border:1px solid rgba(244,200,111,.35);border-radius:15px;background:rgba(244,200,111,.08);color:#ffe4a5;line-height:1.45;font-size:12px;margin:10px 0}.section-title{margin:20px 0 9px;font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:#cbd8d1}.status-step{display:flex;gap:10px;align-items:center;padding:12px;border-bottom:1px solid rgba(255,255,255,.12);color:#91aea2}.status-step.active{color:#fff}.status-step b{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#00a862;color:#fff}

    .mo-complete-btn{position:fixed;z-index:136;left:16px;bottom:18px;min-height:48px;border:1px solid rgba(244,200,111,.7);border-radius:999px;background:#f4efe6;color:#07331f;padding:0 14px;font-weight:950;box-shadow:0 14px 36px rgba(0,0,0,.34)}
    .mo-complete-row{display:flex;gap:8px;flex-wrap:wrap}.mo-complete-row button{flex:1;min-width:140px;min-height:46px;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:rgba(255,255,255,.07);color:#fff;font-weight:900}.mo-complete-row .primary{background:linear-gradient(135deg,#00a862,#00754a);border:0}
    .mo-receipt{border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:15px;margin:10px 0;background:rgba(255,255,255,.04)}.mo-receipt h3{margin:0 0 5px}.mo-receipt small{color:#abc0b6}.mo-receipt table{width:100%;border-collapse:collapse;margin-top:10px}.mo-receipt td{padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12px}.mo-receipt td:last-child{text-align:right}.mo-qrbox{text-align:center;padding:16px}.mo-qrbox img{width:190px;height:190px;background:#fff;padding:9px;border-radius:15px}
    .mo-scan-input{width:100%;min-height:52px;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:#0d3628;color:#fff;padding:0 12px;font:inherit;margin:8px 0}.mo-cam{width:100%;max-height:300px;object-fit:cover;border-radius:16px;background:#000;display:none}
    @media(max-width:700px){.mo-complete-btn{left:10px;bottom:188px;font-size:11px}}
  `;document.head.appendChild(style);

  function sheet(title,sub){
    let m=document.querySelector('#moCompleteSheet');
    if(!m){m=document.createElement('div');m.id='moCompleteSheet';m.className='mo-sheet';m.innerHTML='<div class="mo-sheet-card"><div class="mo-sheet-head"><div><div class="mo-kicker">Menu Orbit Demo</div><h2 id="moCompleteTitle"></h2><p id="moCompleteSub"></p></div><button class="mo-x">×</button></div><div id="moCompleteBody"></div></div>';document.body.appendChild(m);m.querySelector('.mo-x').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('#moCompleteTitle').textContent=title;m.querySelector('#moCompleteSub').textContent=sub||'';m.classList.add('open');return m.querySelector('#moCompleteBody')
  }
  function receipts(){
    const history=get('menuOrbitOrders',[]),out=sheet('Digital Receipts','Printable demo receipts from previous Menu Orbit orders.');
    out.innerHTML=history.length?history.map((o,i)=>'<article class="mo-receipt"><h3>'+esc(o.code||('Order '+(i+1)))+'</h3><small>'+esc(o.createdAt||'')+' • '+esc(o.pickup?.store||'Demo branch')+'</small><table>'+((o.items||[]).map(x=>'<tr><td>'+esc((x.qty||1)+' × '+x.name)+'</td><td>'+money((x.price||0)*(x.qty||1))+'</td></tr>').join(''))+'<tr><td><b>Total</b></td><td><b>'+money(o.total)+'</b></td></tr></table><div class="mo-complete-row" style="margin-top:10px"><button data-print="'+i+'">Print Receipt</button><button data-qr="'+i+'">Show Pickup QR</button></div></article>').join(''):'<div class="empty">No receipts yet. Complete a demo checkout first.</div>';
    out.querySelectorAll('[data-print]').forEach(b=>b.onclick=()=>window.print());
    out.querySelectorAll('[data-qr]').forEach(b=>b.onclick=()=>{const o=history[+b.dataset.qr];out.innerHTML='<div class="mo-qrbox"><h3>'+esc(o.code)+'</h3><img alt="Pickup QR" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(o.code)+'"><p class="demo-banner">Show this QR to the Barista QR Pickup tool.</p><button class="mo-primary" id="backReceipts">Back to receipts</button></div>';document.querySelector('#backReceipts').onclick=receipts});
  }
  function seedDemo(){
    const now=new Date(),code='MO-DEMO01';
    const sample={code,items:[{name:'Caramel Macchiato',qty:1,size:'Grande',style:'Iced',price:210,img:''},{name:'Ham and Cheese Croffle with Pork',qty:1,size:'Regular',style:'Ready to eat',price:205,img:''}],total:415,pickup:{store:'Starbucks SM City Bacoor',time:'As soon as possible',type:'Pick up in store'},status:'Order received',createdAt:now.toLocaleString('en-PH')};
    put('menuOrbitOrders',[sample]);put('menuOrbitLastOrder',sample);put(qKey,[{id:'d-demo01',code,ref:code,items:sample.items,total:sample.total,status:'ORDER_RECEIVED',createdAt:sample.createdAt,updatedAt:now.toISOString()}]);put(nKey,[]);
    put('menuOrbitCart',[]);put('menuOrbitFavorites',[]);put('mo_order_cases_v1',[]);
    localStorage.removeItem('mo_inventory_processed_demo_orders');
    window.NewFeatureHighlight?.reset();
  }
  function presentationMode(){
    const out=sheet('Presentation Mode','Prepare the entire ecosystem for a clean live demo.');
    out.innerHTML='<div class="mo-banner"><b>One-tap demo reset</b><br>This clears temporary demo activity, restores one sample customer order, resets NEW highlights, and prepares Customer → Cashier → Barista.</div><div class="mo-complete-row"><button class="primary" id="moPrepDemo">PREPARE DEMO</button><button id="moEmptyDemo">EMPTY START</button></div><div class="section-title">Suggested presentation flow</div><div class="status-step active"><b>1</b>Customer Menu</div><div class="status-step"><b>2</b>Cashier accepts order</div><div class="status-step"><b>3</b>Barista prepares and verifies pickup QR</div><div class="status-step"><b>4</b>Customer receipt history</div>';
    document.querySelector('#moPrepDemo').onclick=()=>{seedDemo();location.reload()};
    document.querySelector('#moEmptyDemo').onclick=()=>{['menuOrbitOrders','menuOrbitLastOrder',qKey,nKey,'menuOrbitCart','mo_order_cases_v1'].forEach(k=>localStorage.removeItem(k));window.NewFeatureHighlight?.reset();location.reload()};
  }
  function collectByCode(code){
    const q=get(qKey,[]),o=q.find(x=>String(x.code).trim().toUpperCase()===String(code).trim().toUpperCase());if(!o)return false;o.status='COLLECTED';o.collectedAt=new Date().toISOString();put(qKey,q);
    const notices=get(nKey,[]);notices.unshift({token:o.code+'|QR-COLLECT',code:o.code,title:'Pickup verified',text:'QR verified by barista. Order marked Collected.',at:new Date().toLocaleString('en-PH'),read:false});put(nKey,notices.slice(0,50));return true;
  }
  async function qrVerify(){
    const out=sheet('QR Pickup Verification','Scan the customer pickup QR or enter the order number manually.');
    out.innerHTML='<video id="moQrCam" class="mo-cam" playsinline muted></video><div class="mo-complete-row"><button class="primary" id="moStartScan">Start Camera Scan</button><button id="moStopScan">Stop Camera</button></div><input class="mo-scan-input" id="moOrderCode" placeholder="Example: MO-123456"><button class="mo-primary" style="width:100%" id="moVerifyCode">VERIFY PICKUP</button><div id="moVerifyResult"></div>';
    let stream=null,active=true;
    const stop=()=>{active=false;stream?.getTracks().forEach(t=>t.stop());const v=document.querySelector('#moQrCam');if(v)v.style.display='none'};
    document.querySelector('#moStopScan').onclick=stop;
    document.querySelector('#moVerifyCode').onclick=()=>{const code=document.querySelector('#moOrderCode').value.trim(),ok=collectByCode(code);document.querySelector('#moVerifyResult').innerHTML=ok?'<div class="mo-banner"><b>✓ Pickup verified</b><br>'+esc(code)+' is now Collected.</div>':'<div class="demo-banner">Order code not found in this browser demo.</div>'};
    document.querySelector('#moStartScan').onclick=async()=>{
      const video=document.querySelector('#moQrCam');video.style.display='block';
      try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});video.srcObject=stream;await video.play();active=true;
        if('BarcodeDetector' in window){const detector=new BarcodeDetector({formats:['qr_code']});const loop=async()=>{if(!active)return;try{const codes=await detector.detect(video);if(codes[0]?.rawValue){document.querySelector('#moOrderCode').value=codes[0].rawValue.split('|')[0].trim();stop();document.querySelector('#moVerifyCode').click();return}}catch{}requestAnimationFrame(loop)};loop()}
        else document.querySelector('#moVerifyResult').innerHTML='<div class="demo-banner">Camera opened. This browser does not support built-in QR decoding, so enter the order code manually.</div>';
      }catch{document.querySelector('#moVerifyResult').innerHTML='<div class="demo-banner">Camera unavailable. Enter the order code manually.</div>'}
    };
  }
  function addCustomer(){
    const b=document.createElement('button');b.className='mo-complete-btn';b.id='moReceiptsBtn';b.textContent='🧾 RECEIPTS';document.body.appendChild(b);b.onclick=receipts;window.NewFeatureHighlight?.register(b,'digital-receipt-history-v1','NEW');
    const p=document.createElement('button');p.className='mo-tool';p.id='moPresentationBtn';p.textContent='🎬 Presentation';const tools=document.querySelector('.mo-commerce-tools');tools?.appendChild(p);p.onclick=presentationMode;window.NewFeatureHighlight?.register(p,'presentation-mode-v1','NEW');
  }
  function addBarista(){
    const b=document.createElement('button');b.className='mo-complete-btn';b.id='moQrVerifyBtn';b.textContent='▣ QR PICKUP';document.body.appendChild(b);b.onclick=qrVerify;window.NewFeatureHighlight?.register(b,'qr-pickup-verification-v1','NEW');
    const p=document.createElement('button');p.className='mo-complete-btn';p.id='moBaristaPresentation';p.style.left='150px';p.textContent='🎬 DEMO RESET';document.body.appendChild(p);p.onclick=presentationMode;window.NewFeatureHighlight?.register(p,'barista-presentation-mode-v1','NEW');
  }
  function addStaffPortal(){
    const box=document.querySelector('#liveOpsHub .ops-grid');if(!box)return;const b=document.createElement('button');b.className='ops-btn';b.id='opsPresentation';b.type='button';b.innerHTML='<span>🎬</span>PRESENTATION<small>Reset + seed demo</small>';box.appendChild(b);b.onclick=presentationMode;window.NewFeatureHighlight?.register(b,'staff-presentation-mode-v1','NEW');
  }
  const path=location.pathname.toLowerCase();
  const init=()=>{if(path.endsWith('/barista.html'))addBarista();else if(path.endsWith('/staff-portal.html'))addStaffPortal();else if(path.endsWith('/index.html')||path.endsWith('/starbucks-menu-orbit/'))addCustomer()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,800));else setTimeout(init,800);
})();