(()=>{
  if(window.__moCommerceUpgrade)return; window.__moCommerceUpgrade=true;
  const by=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:0});
  const catalog=()=>{try{return products}catch{return []}};
  const appState=()=>{try{return state}catch{return null}};
  const call=name=>(...a)=>{try{return window[name]?.(...a)}catch{}};
  const toast=t=>{let e=by('#moShopToast');if(!e){e=document.createElement('div');e.id='moShopToast';e.className='mo-shop-toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2300)};

  const style=document.createElement('style');
  style.textContent=`
  .mo-commerce-tools{display:flex;gap:7px;align-items:center;overflow:auto;scrollbar-width:none}.mo-commerce-tools::-webkit-scrollbar{display:none}
  .mo-tool{white-space:nowrap;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#e2ece7;border-radius:999px;padding:10px 13px;font-weight:850;font-size:12px}
  .mo-tool:hover{background:rgba(255,255,255,.12)}
  .mo-sheet{position:fixed;z-index:165;inset:0;display:none;align-items:center;justify-content:center;padding:15px;background:rgba(0,0,0,.68);backdrop-filter:blur(8px)}
  .mo-sheet.open{display:flex}.mo-sheet-card{width:min(720px,100%);max-height:89vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:27px;background:#08251b;color:#fff;padding:20px;box-shadow:0 30px 85px rgba(0,0,0,.55)}
  .mo-sheet-head{display:flex;gap:12px;align-items:flex-start;position:sticky;top:-20px;background:#08251b;padding:17px 0 12px;z-index:3}.mo-sheet-head>div{flex:1}.mo-sheet-head h2{margin:0;font:700 29px Georgia,serif}.mo-sheet-head p{margin:5px 0 0;color:#b5c9bf;font-size:12px;line-height:1.45}
  .mo-x{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.07);color:#fff;font-size:22px}
  .mo-result{display:grid;grid-template-columns:64px 1fr auto;gap:11px;align-items:center;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.09)}.mo-result img{width:64px;height:64px;border-radius:15px;object-fit:cover;background:#fff}.mo-result button{min-height:40px;border:0;border-radius:11px;background:#f4efe6;color:#07331f;font-weight:900;padding:0 11px}.mo-result small{display:block;color:#a9bcb2;margin-top:3px}
  .mo-kicker{font-size:10px;letter-spacing:.17em;color:#f4c86f;font-weight:950;text-transform:uppercase}.mo-statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:12px 0}.mo-stat{padding:13px;border:1px solid rgba(255,255,255,.11);border-radius:15px;background:rgba(255,255,255,.045);text-align:center}.mo-stat b{display:block;color:#f2cf8b;font-size:20px}.mo-stat small{color:#a9beb3;font-size:10px}
  .mo-filterbar{display:flex;gap:7px;overflow:auto;margin:9px 0 13px}.mo-filterbar button{white-space:nowrap;min-height:38px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(255,255,255,.06);color:#fff;padding:0 11px;font-size:11px;font-weight:850}.mo-filterbar button.on{background:#f4efe6;color:#07331f}
  .mo-upload{display:grid;place-items:center;min-height:175px;border:1px dashed rgba(244,200,111,.7);border-radius:19px;background:rgba(244,200,111,.06);padding:18px;text-align:center}.mo-upload input{display:none}.mo-upload label{cursor:pointer}.mo-preview{width:min(280px,100%);max-height:220px;border-radius:17px;object-fit:cover;margin:12px auto;display:block}
  .mo-banner{padding:13px;border:1px solid rgba(244,200,111,.35);border-radius:15px;background:rgba(244,200,111,.08);color:#ffe4a5;line-height:1.45;font-size:12px;margin:10px 0}
  .mo-form{display:grid;gap:9px}.mo-form select,.mo-form textarea,.mo-form input{width:100%;min-height:50px;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:#0d3628;color:#fff;padding:10px;font:inherit}.mo-form textarea{min-height:90px}.mo-primary{min-height:50px;border:0;border-radius:14px;background:linear-gradient(135deg,#00a862,#00754a);color:#fff;font-weight:950;padding:0 15px}
  .mo-search-suggest{position:fixed;z-index:160;top:145px;left:50%;transform:translateX(-50%);width:min(600px,calc(100% - 30px));max-height:52vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:0 0 18px 18px;background:#08251b;box-shadow:0 24px 65px rgba(0,0,0,.5);display:none}.mo-search-suggest.open{display:block}.mo-suggest-row{display:flex;align-items:center;gap:10px;padding:10px 13px;border-bottom:1px solid rgba(255,255,255,.08);cursor:pointer}.mo-suggest-row:hover{background:rgba(255,255,255,.06)}.mo-suggest-row img{width:42px;height:42px;border-radius:10px;object-fit:cover}.mo-suggest-row b{font-size:12px}.mo-suggest-row small{color:#a8b9af;margin-left:auto}
  .mo-shop-toast{position:fixed;z-index:190;left:50%;bottom:90px;transform:translate(-50%,15px);opacity:0;pointer-events:none;transition:.2s;padding:10px 14px;border-radius:999px;background:#f4efe6;color:#07331f;font-weight:900;box-shadow:0 15px 35px rgba(0,0,0,.35)}.mo-shop-toast.show{opacity:1;transform:translate(-50%,0)}
  .mo-compare-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.mo-compare-card{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:12px;background:rgba(255,255,255,.04)}.mo-compare-card img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px}.mo-compare-card h4{margin:8px 0 5px}.mo-compare-card small{display:block;color:#abc0b6;margin:3px 0}.mo-chat-log{display:grid;gap:8px;max-height:280px;overflow:auto;margin:10px 0}.mo-chat-msg{padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.06);max-width:84%}.mo-chat-msg.me{margin-left:auto;background:#0d6b49}.mo-countdown{font-size:24px;font-weight:950;color:#f4c86f;letter-spacing:.04em}
  @media(max-width:700px){.mo-compare-grid{grid-template-columns:1fr}}
  @media(max-width:700px){.mo-statgrid{grid-template-columns:1fr 1fr 1fr}.mo-result{grid-template-columns:54px 1fr}.mo-result img{width:54px;height:54px}.mo-result button{grid-column:2}.mo-search-suggest{top:136px}.mo-sheet-card{padding:16px}}
  `;
  document.head.appendChild(style);

  function sheet(title,sub){
    let m=by('#moCommerceSheet');
    if(!m){m=document.createElement('div');m.id='moCommerceSheet';m.className='mo-sheet';m.innerHTML='<div class="mo-sheet-card"><div class="mo-sheet-head"><div><div class="mo-kicker">Menu Orbit Commerce</div><h2 id="moSheetTitle"></h2><p id="moSheetSub"></p></div><button class="mo-x">×</button></div><div id="moSheetBody"></div></div>';document.body.appendChild(m);m.querySelector('.mo-x').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}by('#moSheetTitle').textContent=title;by('#moSheetSub').textContent=sub||'';m.classList.add('open');return by('#moSheetBody')
  }
  const resultRows=list=>list.map((p,i)=>'<div class="mo-result"><img src="'+esc(p.img)+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat)+' • '+money(p.price)+(i<3?' • #'+(i+1)+' trending':'')+'</small></div><button data-open-product="'+esc(p.id)+'">View</button></div>').join('');
  const bindProducts=out=>out.querySelectorAll('[data-open-product]').forEach(b=>b.onclick=()=>{by('#moCommerceSheet')?.classList.remove('open');try{openDetail(b.dataset.openProduct)}catch{}});

  // SMART SEARCH + SORT/FILTER
  let searchSort='recommended';
  function enhanceSearch(){
    const panel=by('#searchPanel'),input=by('#searchInput'); if(!panel||!input)return;
    let sug=by('#moSearchSuggest');if(!sug){sug=document.createElement('div');sug.id='moSearchSuggest';sug.className='mo-search-suggest';document.body.appendChild(sug)}
    const baseOnInput=input.oninput;
    input.oninput=e=>{
      baseOnInput?.call(input,e);
      const q=e.target.value.trim().toLowerCase(),list=catalog().filter(p=>!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)).slice(0,7);
      sug.innerHTML=q?('<div class="mo-filterbar" style="padding:8px 10px;margin:0"><button class="'+(searchSort==='recommended'?'on':'')+'" data-sort="recommended">Recommended</button><button class="'+(searchSort==='popular'?'on':'')+'" data-sort="popular">Popular</button><button class="'+(searchSort==='low'?'on':'')+'" data-sort="low">Lowest Price</button><button class="'+(searchSort==='high'?'on':'')+'" data-sort="high">Highest Price</button></div>'+list.map(p=>'<div class="mo-suggest-row" data-suggest="'+esc(p.id)+'"><img src="'+esc(p.img)+'"><b>'+esc(p.name)+'</b><small>'+money(p.price)+'</small></div>').join('')):'';
      sug.classList.toggle('open',!!q);
      sug.querySelectorAll('[data-suggest]').forEach(r=>r.onclick=()=>{try{openDetail(r.dataset.suggest)}catch{}sug.classList.remove('open')});
      sug.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{searchSort=b.dataset.sort;sortCurrentOrbit();input.dispatchEvent(new Event('input',{bubbles:true}))});
    };
    window.NewFeatureHighlight?.register(by('#searchBtn'),'smart-orbit-search-v1','NEW');
  }
  function sortCurrentOrbit(){
    const els=all('.product'); if(!els.length)return;
    const map=new Map(catalog().map(p=>[p.id,p]));
    const sorted=els.slice().sort((a,b)=>{
      const pa=map.get(a.dataset.id),pb=map.get(b.dataset.id); if(!pa||!pb)return 0;
      if(searchSort==='low')return pa.price-pb.price;if(searchSort==='high')return pb.price-pa.price;
      if(searchSort==='popular'){const rank=['caramel-macchiato','matcha-cream-frap','cold-brew','strawberry-acai-lemonade'];return (rank.indexOf(pa.id)<0?99:rank.indexOf(pa.id))-(rank.indexOf(pb.id)<0?99:rank.indexOf(pb.id))}
      return 0;
    });
    const orbit=by('#orbit'); sorted.forEach(x=>orbit.appendChild(x)); try{positionOrbit()}catch{}
  }

  // TOOLBAR CONTROLS
  function addTools(){
    const nav=by('#categories');if(!nav)return;
    const box=document.createElement('div');box.className='mo-commerce-tools';box.innerHTML=
      '<button class="mo-tool" id="moTrending">🔥 Trending</button>'+
      '<button class="mo-tool" id="moVisualSearch">📷 Visual Search</button>'+
      '<button class="mo-tool" id="moInbox">🔔 Inbox <span id="moInboxCount"></span></button>'+
      '<button class="mo-tool" id="moBranch">📍 Branch</button>'+
      '<button class="mo-tool" id="moProblem">⚠ Order Help</button>'+
      '<button class="mo-tool" id="moCompare">⚖ Compare</button>'+
      '<button class="mo-tool" id="moUsual">↻ Your Usual</button>'+
      '<button class="mo-tool" id="moOrderChat">💬 Order Chat</button>'+
      '<button class="mo-tool" id="moVoucherTimer">⏳ Voucher</button>';
    nav.appendChild(box);
    by('#moTrending').onclick=openTrending;by('#moVisualSearch').onclick=openVisual;by('#moInbox').onclick=openInbox;by('#moBranch').onclick=openBranch;by('#moProblem').onclick=openProblem;by('#moCompare').onclick=openCompare;by('#moUsual').onclick=openUsual;by('#moOrderChat').onclick=openOrderChat;by('#moVoucherTimer').onclick=openVoucherTimer;
    [['#moTrending','trending-orbit-v1'],['#moVisualSearch','visual-drink-search-v1'],['#moInbox','commerce-inbox-v1'],['#moBranch','branch-profile-v1'],['#moProblem','order-problem-center-v1'],['#moCompare','compare-drinks-v1'],['#moUsual','your-usual-v1'],['#moOrderChat','order-chat-v1'],['#moVoucherTimer','voucher-countdown-v1']].forEach(([s,k])=>window.NewFeatureHighlight?.register(s,k,'NEW'));
    refreshInboxCount();
  }

  function openTrending(){
    const rank=['caramel-macchiato','matcha-cream-frap','cold-brew','strawberry-acai-lemonade','latte'];
    const list=rank.map(id=>catalog().find(p=>p.id===id)).filter(Boolean);
    const out=sheet('Trending Orbit','Popular demo picks surfaced without changing the Orbit design.');
    out.innerHTML='<div class="mo-banner">🔥 Trending is a demo ranking based on seeded presentation data, not live Starbucks sales.</div>'+resultRows(list);
    bindProducts(out);
  }

  window.openMenuOrbitTrending=openTrending;

  // VISUAL SEARCH USING DOMINANT COLOR
  function inferFamily(rgb){
    const [r,g,b]=rgb,max=Math.max(r,g,b),min=Math.min(r,g,b);
    if(g>r*1.08&&g>b*1.05)return {label:'Matcha / green tea',terms:['matcha','green']};
    if(r>g*1.22&&r>b*1.15)return {label:'Strawberry / berry',terms:['strawberry','pink','dragon']};
    if(r>150&&g>120&&b<120)return {label:'Caramel / coffee',terms:['caramel','latte','coffee','mocha']};
    if(max-min<35&&max>170)return {label:'Cream / vanilla',terms:['vanilla','white','cream']};
    return {label:'Coffee / chocolate',terms:['coffee','cold brew','mocha','chocolate','latte']};
  }
  function openVisual(){
    const out=sheet('Visual Drink Search','Upload or photograph a drink. The browser samples its dominant color and suggests similar menu families.');
    out.innerHTML='<div class="mo-upload"><label for="moImageFile"><div style="font-size:38px">📷</div><b>Choose or take a drink photo</b><br><small style="color:#abc0b6">Image stays in this browser for the demo.</small></label><input id="moImageFile" type="file" accept="image/*" capture="environment"></div><div id="moVisualResult"></div>';
    by('#moImageFile').onchange=e=>{
      const file=e.target.files?.[0];if(!file)return;const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{
        const cvs=document.createElement('canvas'),ctx=cvs.getContext('2d'),w=48,h=48;cvs.width=w;cvs.height=h;ctx.drawImage(img,0,0,w,h);const d=ctx.getImageData(0,0,w,h).data;let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=16){if(d[i+3]<120)continue;r+=d[i];g+=d[i+1];b+=d[i+2];n++}const fam=inferFamily([r/n,g/n,b/n]);let matches=catalog().filter(p=>fam.terms.some(t=>p.name.toLowerCase().includes(t))).slice(0,6);if(!matches.length)matches=catalog().filter(p=>p.kind==='drink').slice(0,6);by('#moVisualResult').innerHTML='<img class="mo-preview" src="'+url+'" alt="Uploaded drink"><div class="mo-banner"><b>Looks closest to: '+esc(fam.label)+'</b><br>These are visual demo matches, not ingredient identification.</div>'+resultRows(matches);bindProducts(by('#moVisualResult'));
      };img.src=url;
    }
  }

  // NOTIFICATION INBOX
  function seedInbox(){
    const k='mo_commerce_seed_notices_v1';if(get(k,false))return;put(k,true);
    const n=get('mo_demo_notifications_v1',[]);
    [['NEW','Seasonal menu spotlight','Explore the newest featured drinks in the Orbit.'],['VOUCHER','Demo voucher expiring','Your presentation voucher expires tonight.'],['DEAL','Happy Hour reminder','Demo Happy Hour begins at 3:00 PM.']].forEach((x,i)=>n.push({token:'seed-'+i,code:'',title:x[1],text:x[2],type:x[0],at:new Date().toLocaleString('en-PH'),read:false}));
    put('mo_demo_notifications_v1',n);
  }
  function refreshInboxCount(){seedInbox();const n=get('mo_demo_notifications_v1',[]).filter(x=>!x.read).length;const e=by('#moInboxCount');if(e)e.textContent=n?'• '+n:''}
  function openInbox(){
    const list=get('mo_demo_notifications_v1',[]),out=sheet('Notification Center','Orders, rewards, vouchers, deals, and new-menu notices in one place.');
    list.forEach(x=>x.read=true);put('mo_demo_notifications_v1',list);refreshInboxCount();
    out.innerHTML=list.length?list.slice().reverse().map(n=>'<div class="mo-result" style="grid-template-columns:48px 1fr"><div style="font-size:24px;text-align:center">'+(n.title?.includes('Ready')?'☕':n.title?.includes('voucher')?'🎟':n.title?.includes('Happy')?'⚡':'🔔')+'</div><div><b>'+esc(n.title)+'</b><small>'+esc(n.text)+' • '+esc(n.at||'')+'</small></div></div>').join(''):'<div class="empty">No notifications yet.</div>';
  }

  // BRANCH PROFILE
  function openBranch(){
    const pickup=get('menuOrbitPickup',{}),store=pickup.store||'Starbucks SM City Bacoor',orders=get('mo_demo_orders_v1',[]),active=orders.filter(o=>!['COLLECTED'].includes(o.status)).length;
    const followed=get('mo_followed_branch_v1',false),out=sheet('Branch Profile','Your café version of a marketplace shop page.');
    out.innerHTML='<div class="mo-banner"><b>'+esc(store)+'</b><br>Demo branch information only.</div><div class="mo-statgrid"><div class="mo-stat"><b>'+Math.max(1,active+2)+'</b><small>Current queue</small></div><div class="mo-stat"><b>8–12m</b><small>Prep estimate</small></div><div class="mo-stat"><b>12</b><small>Seats demo</small></div></div><div class="mo-result" style="grid-template-columns:1fr auto"><div><b>Branch status</b><small>Open • Pickup available • Selected in Menu Orbit</small></div><button id="moFollowBranch">'+(followed?'Following ✓':'Follow Branch')+'</button></div><div class="mo-result" style="grid-template-columns:1fr auto"><div><b>Branch vouchers</b><small>View deals available in this demo branch.</small></div><button id="moBranchDeals">View</button></div><div class="mo-result" style="grid-template-columns:1fr auto"><div><b>Popular here</b><small>Caramel Macchiato • Cold Brew • Matcha</small></div><button id="moBranchPopular">Explore</button></div>';
    by('#moFollowBranch').onclick=()=>{put('mo_followed_branch_v1',!followed);toast(!followed?'Branch followed':'Branch unfollowed');openBranch()};
    by('#moBranchDeals').onclick=()=>{by('#moCommerceSheet').classList.remove('open');try{openHub('vouchers')}catch{}};
    by('#moBranchPopular').onclick=openTrending;
  }

  // ORDER PROBLEM CENTER
  function openProblem(){
    const orders=get('mo_demo_orders_v1',[]).slice().reverse(),last=orders[0],cases=get('mo_order_cases_v1',[]),out=sheet('Order Problem Center','Structured demo support for wrong, missing, spilled, or incorrectly customized orders.');
    out.innerHTML=(last?'<div class="mo-banner"><b>Order '+esc(last.code)+'</b><br>'+esc(last.status||'Current demo order')+'</div>':'<div class="mo-banner">No demo order found yet. You can still preview the case flow.</div>')+'<div class="mo-form"><select id="moIssue"><option>Wrong drink</option><option>Missing item</option><option>Spilled drink</option><option>Quality concern</option><option>Incorrect customization</option><option>Other</option></select><textarea id="moIssueNote" placeholder="Tell the branch what happened…"></textarea><input id="moEvidence" type="file" accept="image/*,video/*"><button class="mo-primary" id="moSubmitCase">SUBMIT DEMO CASE</button></div><div class="section-title">Case history</div><div id="moCases">'+(cases.length?cases.map(c=>'<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(c.id)+' • '+esc(c.issue)+'</b><small>'+esc(c.order)+' • '+esc(c.status)+' • '+esc(c.at)+'</small></div><span class="badge">'+esc(c.status)+'</span></div>').join(''):'<div class="empty">No support cases yet.</div>')+'</div>';
    by('#moSubmitCase').onclick=()=>{const issue=by('#moIssue').value,note=by('#moIssueNote').value.trim(),file=by('#moEvidence').files?.[0];const item={id:'CASE-'+Date.now().toString().slice(-6),order:last?.code||'DEMO',issue,note,evidence:file?file.name:'No file',status:'Under Review',at:new Date().toLocaleString('en-PH')};cases.unshift(item);put('mo_order_cases_v1',cases.slice(0,20));toast('Demo case submitted');openProblem()};
  }


  // COMPARE DRINKS
  function openCompare(){
    const drinks=catalog().filter(p=>p.kind==='drink').slice(0,18),saved=get('mo_compare_ids_v1',[]);
    const out=sheet('Compare Drinks','Choose up to three drinks and compare price, calories, serving style, and menu category.');
    out.innerHTML='<div class="mo-filterbar">'+drinks.map(p=>'<button class="'+(saved.includes(p.id)?'on':'')+'" data-compare-pick="'+esc(p.id)+'">'+esc(p.name)+'</button>').join('')+'</div><div id="moCompareResult"></div>';
    const render=()=>{const ids=get('mo_compare_ids_v1',[]),items=ids.map(id=>catalog().find(p=>p.id===id)).filter(Boolean);by('#moCompareResult').innerHTML=items.length?'<div class="mo-compare-grid">'+items.map(p=>'<article class="mo-compare-card"><img src="'+esc(p.img)+'" alt=""><h4>'+esc(p.name)+'</h4><small><b>'+money(p.price)+'</b></small><small>Calories: '+esc(p.cal??'See store')+'</small><small>Style: '+esc((p.temps||[]).join(' / '))+'</small><small>Category: '+esc(p.cat)+'</small><button class="mo-primary" style="width:100%;margin-top:8px" data-open-product="'+esc(p.id)+'">View</button></article>').join('')+'</div>':'<div class="mo-banner">Select 2–3 drinks above to compare them.</div>';bindProducts(by('#moCompareResult'))};
    out.querySelectorAll('[data-compare-pick]').forEach(b=>b.onclick=()=>{let ids=get('mo_compare_ids_v1',[]),id=b.dataset.comparePick;if(ids.includes(id))ids=ids.filter(x=>x!==id);else{if(ids.length>=3)ids.shift();ids.push(id)}put('mo_compare_ids_v1',ids);out.querySelectorAll('[data-compare-pick]').forEach(x=>x.classList.toggle('on',ids.includes(x.dataset.comparePick)));render()});render();
  }

  // YOUR USUAL / REORDER
  function openUsual(){
    const orders=get('menuOrbitOrders',[]),freq=new Map(),lastSeen=new Map();
    orders.forEach((o,oi)=>(o.items||[]).forEach(x=>{const key=x.name||x.id||'Item';freq.set(key,(freq.get(key)||0)+(x.qty||1));if(!lastSeen.has(key))lastSeen.set(key,{...x,order:o,rank:oi})}));
    let rows=[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,count])=>({name,count,...lastSeen.get(name)}));
    if(!rows.length){const fall=['Caramel Macchiato','Cold Brew','Caffè Latte'].map((name,i)=>{const p=catalog().find(x=>x.name.includes(name));return p?{name:p.name,count:Math.max(1,3-i),...p}:null}).filter(Boolean);rows=fall}
    const out=sheet('Your Usual','Recently bought favorites and one-tap reorder.');
    out.innerHTML=rows.length?rows.map((x,i)=>'<div class="mo-result"><img src="'+esc(x.img||catalog().find(p=>p.name===x.name)?.img||'')+'" alt=""><div><b>'+esc(x.name)+'</b><small>Ordered '+esc(x.count)+'× • '+(i===0?'Your top usual':'Recently bought')+'</small></div><button data-usual="'+esc(x.name)+'">Reorder</button></div>').join(''):'<div class="empty">No past orders yet.</div>';
    out.querySelectorAll('[data-usual]').forEach(b=>b.onclick=()=>{const name=b.dataset.usual,src=rows.find(x=>x.name===name),p=catalog().find(x=>x.name===name);try{const s=appState();const item=src?.price?src:p;if(s&&item){s.cart.push({key:Date.now(),id:item.id||p?.id,name:item.name,price:item.price||p?.price||0,img:item.img||p?.img||'',qty:1,size:item.size||'Tall',style:item.style||item.temps?.[0]||'Iced'});localStorage.setItem('menuOrbitCart',JSON.stringify(s.cart));toast(name+' added to cart')}}catch{}});
  }

  // ORDER-SPECIFIC CHAT
  function openOrderChat(){
    const orders=get('mo_demo_orders_v1',[]).slice().reverse(),last=orders[0]||get('menuOrbitOrders',[])[0],code=last?.code||'DEMO';
    const key='mo_order_chat_'+code,log=get(key,[{from:'branch',text:'Hi! This chat is linked to order '+code+'.',at:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}]);
    const out=sheet('Order Chat','Conversation tied specifically to '+code+'. Demo only.');
    const render=()=>{by('#moChatLog').innerHTML=get(key,[]).map(m=>'<div class="mo-chat-msg '+(m.from==='me'?'me':'')+'"><b>'+(m.from==='me'?'You':'Branch')+'</b><br>'+esc(m.text)+'<br><small>'+esc(m.at)+'</small></div>').join('');by('#moChatLog').scrollTop=by('#moChatLog').scrollHeight};
    out.innerHTML='<div class="mo-banner"><b>Order '+esc(code)+'</b><br>Messages here stay in this browser demo.</div><div class="mo-chat-log" id="moChatLog"></div><div class="mo-form"><textarea id="moChatText" placeholder="Message the branch about this order…"></textarea><button class="mo-primary" id="moSendOrderChat">SEND MESSAGE</button></div>';
    by('#moSendOrderChat').onclick=()=>{const t=by('#moChatText').value.trim();if(!t)return;const l=get(key,[]);l.push({from:'me',text:t,at:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})});put(key,l);by('#moChatText').value='';render();setTimeout(()=>{const l2=get(key,[]);l2.push({from:'branch',text:'Thanks — your message is attached to '+code+' in this demo.',at:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})});put(key,l2);render()},500)};render();
  }

  // VOUCHER COUNTDOWN
  function voucherExpiry(){
    let ts=Number(localStorage.getItem('mo_voucher_expiry_v1'));if(!ts||ts<Date.now()){const d=new Date();d.setHours(23,59,59,999);ts=d.getTime();localStorage.setItem('mo_voucher_expiry_v1',String(ts))}return ts
  }
  function openVoucherTimer(){
    const out=sheet('Voucher Countdown','See exactly how long your demo voucher remains available.');
    out.innerHTML='<div class="mo-banner"><b>DEMO ₱50 OFF</b><br>Minimum spend ₱300 • Selected branches • Demo use only</div><div style="text-align:center;padding:22px"><div class="mo-kicker">Expires in</div><div class="mo-countdown" id="moVoucherClock">--:--:--</div><p style="color:#abc0b6">Eligibility is checked at checkout.</p></div><div class="mo-result" style="grid-template-columns:1fr"><div><b>Why a voucher may not apply</b><small>Minimum spend not met • branch restriction • product restriction • expired • already used.</small></div></div>';
    const tick=()=>{const el=by('#moVoucherClock');if(!el)return;const ms=Math.max(0,voucherExpiry()-Date.now()),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);el.textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':');if(ms>0)setTimeout(tick,1000)};tick();
  }

  function init(){
    enhanceSearch();
    addTools();
    setInterval(refreshInboxCount,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,650));else setTimeout(init,650);
})();