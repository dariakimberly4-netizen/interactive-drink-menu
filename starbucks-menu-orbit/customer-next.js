(()=>{
if(window.__moCustomerNext)return;window.__moCustomerNext=true;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:0});
const catalog=()=>{try{return products}catch{return []}};
const st=()=>{try{return state}catch{return null}};
const style=document.createElement('style');style.textContent=`
/* Newest customer feature highlight */
#moSearchHistory.mo-new-feature,
#moPayments.mo-new-feature,
#moPairings.mo-new-feature,
#moShareCart.mo-new-feature{
  position:relative!important;
  border-color:#f4c86f!important;
  box-shadow:0 0 0 2px #f4c86f,0 0 24px rgba(244,200,111,.42)!important;
  background:linear-gradient(135deg,rgba(244,200,111,.16),rgba(255,255,255,.06))!important;
  overflow:visible!important
}
#moSearchHistory.mo-new-feature::after,
#moPayments.mo-new-feature::after,
#moPairings.mo-new-feature::after,
#moShareCart.mo-new-feature::after{
  content:"NEW"!important;
  position:absolute!important;
  top:-10px!important;
  right:-8px!important;
  z-index:10!important;
  padding:4px 7px!important;
  border-radius:999px!important;
  background:#f4c86f!important;
  color:#07331f!important;
  font-size:9px!important;
  font-weight:950!important;
  letter-spacing:.08em!important;
  box-shadow:0 5px 14px rgba(0,0,0,.28)!important
}
`
.mo-next-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.mo-next-card{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px;background:rgba(255,255,255,.04)}.mo-next-card h4{margin:0 0 7px}.mo-next-card small{color:#abc0b6;display:block;line-height:1.45}.mo-next-card button{margin-top:10px;width:100%;min-height:42px;border:0;border-radius:11px;background:#f4efe6;color:#07331f;font-weight:900}.mo-pref{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.09)}.mo-pref input{width:20px;height:20px}.mo-save-later{margin-top:7px;width:100%;min-height:36px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.05);color:#fff;font-weight:800}.mo-review-stars{color:#f4c86f;font-weight:900}.mo-review-row{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.09)}.mo-review-row small{color:#abc0b6}.mo-branch-table{width:100%;border-collapse:collapse}.mo-branch-table th,.mo-branch-table td{padding:10px;border-bottom:1px solid rgba(255,255,255,.09);text-align:left;font-size:12px}.mo-branch-table th{color:#f4c86f}.mo-saved-banner{padding:11px;border:1px solid rgba(244,200,111,.35);border-radius:13px;background:rgba(244,200,111,.08);margin:10px 0}
@media(max-width:700px){.mo-next-grid{grid-template-columns:1fr}.mo-branch-table{font-size:10px}.mo-branch-table th,.mo-branch-table td{padding:7px 4px}}
.mo-pay-card{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px;background:rgba(255,255,255,.04);margin:9px 0}.mo-pay-card strong{display:block}.mo-pay-card small{color:#abc0b6}.mo-pair-card{display:grid;grid-template-columns:70px 1fr auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.09)}.mo-pair-card img{width:70px;height:70px;object-fit:cover;border-radius:14px}.mo-pair-card button{min-height:40px;border:0;border-radius:11px;background:#f4efe6;color:#07331f;font-weight:900;padding:0 11px}.mo-share-box{width:100%;min-height:110px;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:#0d3628;color:#fff;padding:10px}
`;document.head.appendChild(style);

function sheet(title,sub){
 let m=$('#moCustomerNextSheet');
 if(!m){m=document.createElement('div');m.id='moCustomerNextSheet';m.className='mo-sheet';m.innerHTML='<div class="mo-sheet-card"><div class="mo-sheet-head"><div><div class="mo-kicker">Customer Tools</div><h2 id="moNextTitle"></h2><p id="moNextSub"></p></div><button class="mo-x">×</button></div><div id="moNextBody"></div></div>';document.body.appendChild(m);m.querySelector('.mo-x').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('#moNextTitle').textContent=title;m.querySelector('#moNextSub').textContent=sub||'';m.classList.add('open');return m.querySelector('#moNextBody');
}
function toast(t){let e=$('#moShopToast');if(e){e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}else alert(t)}

function openSaved(){
 const saved=get('mo_saved_for_later_v1',[]),out=sheet('Saved for Later','Items you removed from the active cart without losing them.');
 out.innerHTML=saved.length?saved.map((x,i)=>'<div class="mo-result"><img src="'+esc(x.img||'')+'" alt=""><div><b>'+esc(x.name)+'</b><small>'+esc(x.size||'')+' • '+esc(x.style||'')+' • '+money(x.price)+'</small></div><button data-move="'+i+'">Move to Cart</button></div>').join(''):'<div class="empty">Nothing saved yet.</div>';
 out.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const arr=get('mo_saved_for_later_v1',[]),x=arr.splice(+b.dataset.move,1)[0],s=st();if(s&&x){s.cart.push({...x,key:Date.now()+Math.random()});localStorage.setItem('menuOrbitCart',JSON.stringify(s.cart));put('mo_saved_for_later_v1',arr);try{saveCart()}catch{}toast('Moved back to cart');openSaved()}});
}
function patchCart(){
 const target=$('#cartContent');if(!target)return;
 const apply=()=>{
   $$('#cartContent .cart-row').forEach(row=>{
     if(row.querySelector('.mo-save-later'))return;
     const rem=row.querySelector('[data-remove]');if(!rem)return;
     const btn=document.createElement('button');btn.className='mo-save-later';btn.textContent='Save for Later';btn.onclick=()=>{
       const s=st(),key=Number(rem.dataset.remove),item=s?.cart?.find(x=>x.key===key);if(!item)return;
       const saved=get('mo_saved_for_later_v1',[]);saved.unshift({...item});put('mo_saved_for_later_v1',saved.slice(0,30));s.cart=s.cart.filter(x=>x.key!==key);try{saveCart();openCart()}catch{}toast('Saved for later');
     };row.lastElementChild?.appendChild(btn);
   });
 };
 new MutationObserver(apply).observe(target,{childList:true,subtree:true});apply();
}
function openBranchCompare(){
 const selected=get('menuOrbitPickup',{}).store||'Starbucks SM City Bacoor';
 const branches=[
  {name:'Starbucks SM City Bacoor',queue:3,prep:'8–12m',seats:12,avail:'High',deal:'₱50 demo voucher'},
  {name:'Starbucks Molino Boulevard',queue:5,prep:'12–16m',seats:8,avail:'Medium',deal:'2× Stars demo'},
  {name:'Starbucks Vista Mall Daang Hari',queue:2,prep:'6–10m',seats:18,avail:'High',deal:'Pastry bundle demo'}
 ];
 const out=sheet('Compare Branches','Compare queue, prep time, seats, availability, and offers before choosing pickup.');
 out.innerHTML='<div class="mo-saved-banner"><b>Current branch:</b> '+esc(selected)+'</div><div style="overflow:auto"><table class="mo-branch-table"><thead><tr><th>Branch</th><th>Queue</th><th>Prep</th><th>Seats</th><th>Availability</th><th>Offer</th><th></th></tr></thead><tbody>'+branches.map(b=>'<tr><td><b>'+esc(b.name)+'</b></td><td>'+b.queue+'</td><td>'+b.prep+'</td><td>'+b.seats+'</td><td>'+b.avail+'</td><td>'+b.deal+'</td><td><button data-branch="'+esc(b.name)+'">Choose</button></td></tr>').join('')+'</tbody></table></div><p class="demo-banner">Comparison values are demo data for presentation only.</p>';
 out.querySelectorAll('[data-branch]').forEach(b=>b.onclick=()=>{const p=get('menuOrbitPickup',{});p.store=b.dataset.branch;put('menuOrbitPickup',p);toast('Branch selected');openBranchCompare()});
}
function openReviews(){
 const reviews=[
  {name:'Joanne',stars:5,text:'Balanced and smooth.',photo:true,video:false,date:'Newest'},
  {name:'Marco',stars:4,text:'Good iced option.',photo:false,video:false,date:'Older'},
  {name:'Ana',stars:5,text:'Would order again.',photo:true,video:true,date:'Older'},
  {name:'Bea',stars:3,text:'A little sweet for me.',photo:false,video:false,date:'Newest'}
 ];
 const out=sheet('Review Filters','Filter customer reviews by freshness, rating, and media.');
 const render=(mode='Newest')=>{
   let list=[...reviews];
   if(mode==='Highest Rated')list.sort((a,b)=>b.stars-a.stars);
   else if(mode==='With Photo')list=list.filter(x=>x.photo);
   else if(mode==='With Video')list=list.filter(x=>x.video);
   else list.sort((a,b)=>a.date==='Newest'?-1:1);
   $('#moReviewList').innerHTML=list.map(r=>'<div class="mo-review-row"><b>'+esc(r.name)+'</b> <span class="mo-review-stars">'+('★'.repeat(r.stars))+'</span><br>'+esc(r.text)+'<br><small>'+[r.photo?'📷 Photo':'',r.video?'🎥 Video':''].filter(Boolean).join(' • ')+'</small></div>').join('');
 };
 out.innerHTML='<div class="mo-filterbar"><button class="on" data-rf="Newest">Newest</button><button data-rf="Highest Rated">Highest Rated</button><button data-rf="With Photo">With Photo</button><button data-rf="With Video">With Video</button></div><div id="moReviewList"></div>';
 out.querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>{out.querySelectorAll('[data-rf]').forEach(x=>x.classList.remove('on'));b.classList.add('on');render(b.dataset.rf)});render();
}
function openPrefs(){
 const prefs=get('mo_notification_prefs_v1',{orders:true,rewards:true,deals:true,newMenu:true});
 const out=sheet('Notification Preferences','Choose which Menu Orbit demo notifications you want to receive.');
 const rows=[['orders','Order updates','Accepted, preparing, ready, collected'],['rewards','Rewards','Stars and reward activity'],['deals','Deals & vouchers','Happy Hour and expiring offers'],['newMenu','New menu','Seasonal and newly featured products']];
 out.innerHTML=rows.map(([k,t,d])=>'<label class="mo-pref"><span><b>'+t+'</b><small>'+d+'</small></span><input type="checkbox" data-pref="'+k+'" '+(prefs[k]?'checked':'')+'></label>').join('')+'<button class="mo-primary" style="width:100%;margin-top:14px" id="moSavePrefs">SAVE PREFERENCES</button>';
 $('#moSavePrefs').onclick=()=>{const p={};out.querySelectorAll('[data-pref]').forEach(i=>p[i.dataset.pref]=i.checked);put('mo_notification_prefs_v1',p);toast('Notification preferences saved');};
}

function openSearchHistory(){
 const hist=get('mo_search_history_v1',[]),out=sheet('Search History','Recent Menu Orbit searches saved on this browser.');
 out.innerHTML=hist.length?hist.map((q,i)=>'<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(q)+'</b><small>Recent search</small></div><button data-search-again="'+i+'">Search</button></div>').join('')+'<button class="mo-primary" style="width:100%;margin-top:12px" id="moClearSearchHistory">CLEAR HISTORY</button>':'<div class="empty">No recent searches yet.</div>';
 out.querySelectorAll('[data-search-again]').forEach(b=>b.onclick=()=>{const q=hist[+b.dataset.searchAgain],input=$('#searchInput');if(input){input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));$('#moCustomerNextSheet')?.classList.remove('open');$('#searchPanel')?.classList.add('open')}});
 $('#moClearSearchHistory')?.addEventListener('click',()=>{put('mo_search_history_v1',[]);openSearchHistory()});
}
function hookSearchHistory(){
 const input=$('#searchInput');if(!input||input.dataset.historyHooked)return;input.dataset.historyHooked='1';
 input.addEventListener('change',()=>{const q=input.value.trim();if(!q)return;let h=get('mo_search_history_v1',[]);h=[q,...h.filter(x=>x.toLowerCase()!==q.toLowerCase())].slice(0,10);put('mo_search_history_v1',h)});
 input.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=input.value.trim();if(!q)return;let h=get('mo_search_history_v1',[]);h=[q,...h.filter(x=>x.toLowerCase()!==q.toLowerCase())].slice(0,10);put('mo_search_history_v1',h)}});
}
function openPayments(){
 const cards=get('mo_saved_payments_v1',[{type:'GCash',label:'GCash •••• 0917',default:true},{type:'Card',label:'Visa •••• 4242',default:false},{type:'Starbucks Card',label:'Starbucks Card •••• 2026',default:false}]),out=sheet('Saved Payments','Demo payment methods only. No real financial credentials are stored or processed.');
 out.innerHTML='<div class="demo-banner">For presentation only. This prototype never stores real card, GCash, or wallet credentials.</div>'+cards.map((x,i)=>'<div class="mo-pay-card"><strong>'+esc(x.type)+'</strong><small>'+esc(x.label)+'</small><div class="mo-complete-row" style="margin-top:8px"><button data-default-pay="'+i+'">'+(x.default?'Default ✓':'Set Default')+'</button><button data-remove-pay="'+i+'">Remove</button></div></div>').join('')+'<button class="mo-primary" style="width:100%;margin-top:10px" id="moAddDemoPayment">ADD DEMO PAYMENT</button>';
 out.querySelectorAll('[data-default-pay]').forEach(b=>b.onclick=()=>{cards.forEach((x,i)=>x.default=i===+b.dataset.defaultPay);put('mo_saved_payments_v1',cards);openPayments()});
 out.querySelectorAll('[data-remove-pay]').forEach(b=>b.onclick=()=>{cards.splice(+b.dataset.removePay,1);put('mo_saved_payments_v1',cards);openPayments()});
 $('#moAddDemoPayment').onclick=()=>{cards.push({type:'Card',label:'Demo Mastercard •••• '+String(Date.now()).slice(-4),default:cards.length===0});put('mo_saved_payments_v1',cards);openPayments()};
}
function openPairings(){
 const last=get('menuOrbitLastOrder',{}),name=last?.items?.[0]?.name||'Caramel Macchiato';
 const rules=[
  {match:/matcha/i,names:['Cookies and Cream Cheesecake (Slice)','Cranberry Pistachio Crunch Blondies']},
  {match:/cold brew|americano/i,names:['Ham and Cheese Croffle with Pork','Spinach, Tomato, Egg and Mushroom Wrap']},
  {match:/caramel|latte|mocha/i,names:['Cookies and Cream Cheesecake (Slice)','Ham and Cheese Croffle with Pork']}
 ];
 const rule=rules.find(r=>r.match.test(name))||rules[2];
 const items=rule.names.map(n=>catalog().find(p=>p.name===n)).filter(Boolean);
 const out=sheet('Recommended Pairings','Suggested food pairings based on your recent drink.');
 out.innerHTML='<div class="mo-saved-banner"><b>Because you ordered:</b> '+esc(name)+'</div>'+(items.length?items.map(p=>'<div class="mo-pair-card"><img src="'+esc(p.img)+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+money(p.price)+' • '+esc(p.cat)+'</small></div><button data-pair-add="'+esc(p.id)+'">Add</button></div>').join(''):'<div class="empty">No pairing suggestions available.</div>');
 out.querySelectorAll('[data-pair-add]').forEach(b=>b.onclick=()=>{const p=catalog().find(x=>x.id===b.dataset.pairAdd),s=st();if(p&&s){s.cart.push({key:Date.now()+Math.random(),id:p.id,name:p.name,price:p.price,img:p.img,qty:1,size:'Regular',style:p.temps?.[0]||'Ready to eat'});localStorage.setItem('menuOrbitCart',JSON.stringify(s.cart));try{saveCart()}catch{}toast('Pairing added to cart')}});
}
function openShareCart(){
 const s=st(),cart=s?.cart||get('menuOrbitCart',[]),total=cart.reduce((a,b)=>a+(b.price||0)*(b.qty||1),0);
 const text='Menu Orbit Cart\n'+(cart.length?cart.map(x=>(x.qty||1)+' × '+x.name+' — '+money((x.price||0)*(x.qty||1))).join('\n')+'\nTotal: '+money(total):'Cart is empty');
 const out=sheet('Share Cart','Share a text summary of your current customized cart.');
 out.innerHTML='<textarea class="mo-share-box" id="moShareText" readonly>'+esc(text)+'</textarea><div class="mo-complete-row" style="margin-top:10px"><button class="primary" id="moNativeShare">SHARE</button><button id="moCopyCart">COPY</button></div><p class="demo-banner">Only the cart summary is shared. No account or payment information is included.</p>';
 $('#moNativeShare').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'Menu Orbit Cart',text})}catch{}}else{navigator.clipboard?.writeText(text);toast('Cart copied')}};
 $('#moCopyCart').onclick=()=>navigator.clipboard?.writeText(text).then(()=>toast('Cart copied'));
}
function addTools(){
 const tools=$('.mo-commerce-tools');if(!tools)return;
 [['moSavedLater','♡ Saved Later',openSaved,'saved-for-later-v1'],['moBranchCompare','⇄ Compare Branches',openBranchCompare,'branch-comparison-v1'],['moReviewFilters','★ Review Filters',openReviews,'review-filters-v1'],['moNotifPrefs','⚙ Notifications',openPrefs,'notification-preferences-v1'],['moSearchHistory','⌕ Search History',openSearchHistory,'search-history-v2'],['moPayments','💳 Payments',openPayments,'saved-payments-v2'],['moPairings','🥐 Pairings',openPairings,'pairing-recommendations-v2'],['moShareCart','↗ Share Cart',openShareCart,'share-cart-v2']].forEach(([id,label,fn,key])=>{
  if($('#'+id))return;const b=document.createElement('button');b.className='mo-tool';b.id=id;b.textContent=label;b.onclick=fn;tools.appendChild(b);window.NewFeatureHighlight?.register(b,key,'NEW');
 });
}
function refreshNewestHighlights(){
  setTimeout(()=>{
    [['#moSearchHistory','search-history-v2'],['#moPayments','saved-payments-v2'],['#moPairings','pairing-recommendations-v2'],['#moShareCart','share-cart-v2']]
      .forEach(([s,k])=>window.NewFeatureHighlight?.register(s,k,'NEW'));
  },250);
}
function init(){addTools();patchCart();hookSearchHistory();refreshNewestHighlights();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,1000));else setTimeout(init,1000);
})();