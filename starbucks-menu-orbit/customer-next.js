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

function openProfileDashboard(){
 const orders=get('menuOrbitOrders',[]),favs=get('menuOrbitFavorites',[]),saved=get('mo_saved_for_later_v1',[]),prefs=get('mo_notification_prefs_v1',{}),payments=get('mo_saved_payments_v1',[]),notices=get('mo_demo_notifications_v1',[]);
 const out=sheet('Customer Profile','Orders, rewards, favorites, payments, receipts, and notification settings in one place.');
 const stars=(()=>{try{return JSON.parse(localStorage.getItem('starRewardsMember')||'{}').stars||0}catch{return 0}})();
 out.innerHTML='<div class="mo-statgrid"><div class="mo-stat"><b>'+orders.length+'</b><small>Orders</small></div><div class="mo-stat"><b>'+stars+'</b><small>Stars</small></div><div class="mo-stat"><b>'+favs.length+'</b><small>Favorites</small></div></div>'+
 '<div class="mo-next-grid">'+
 '<div class="mo-next-card"><h4>🧾 Receipts</h4><small>'+orders.length+' receipt'+(orders.length===1?'':'s')+' available</small><button id="moProfileReceipts">Open</button></div>'+
 '<div class="mo-next-card"><h4>♡ Saved</h4><small>'+saved.length+' saved for later</small><button id="moProfileSaved">Open</button></div>'+
 '<div class="mo-next-card"><h4>💳 Payments</h4><small>'+payments.length+' demo payment method'+(payments.length===1?'':'s')+'</small><button id="moProfilePayments">Manage</button></div>'+
 '<div class="mo-next-card"><h4>🔔 Notifications</h4><small>'+notices.filter(x=>!x.read).length+' unread • '+Object.values(prefs).filter(Boolean).length+' preferences on</small><button id="moProfilePrefs">Manage</button></div>'+
 '</div>';
 $('#moProfileReceipts').onclick=()=>document.querySelector('#moReceiptsBtn')?.click();
 $('#moProfileSaved').onclick=openSaved;
 $('#moProfilePayments').onclick=openPayments;
 $('#moProfilePrefs').onclick=openPrefs;
}
function openScheduledOrder(){
 const current=get('mo_scheduled_order_v1',null),out=sheet('Scheduled Ordering','Choose a later pickup date and time for this demo.');
 const now=new Date(),min=new Date(now.getTime()+30*60000),date=min.toISOString().slice(0,10),time=min.toTimeString().slice(0,5);
 out.innerHTML='<div class="mo-form"><input id="moScheduleDate" type="date" min="'+date+'" value="'+esc(current?.date||date)+'"><input id="moScheduleTime" type="time" value="'+esc(current?.time||time)+'"><select id="moScheduleType"><option '+(current?.type==='Pickup'?'selected':'')+'>Pickup</option><option '+(current?.type==='Curbside'?'selected':'')+'>Curbside</option></select><button class="mo-primary" id="moSaveSchedule">SAVE SCHEDULE</button></div><div id="moScheduleStatus"></div><p class="demo-banner">Demo scheduling only. Real deployment requires verified branch hours and live capacity.</p>';
 const status=()=>{const s=get('mo_scheduled_order_v1',null);$('#moScheduleStatus').innerHTML=s?'<div class="mo-saved-banner"><b>Scheduled:</b> '+esc(s.date)+' at '+esc(s.time)+' • '+esc(s.type)+'</div>':''};status();
 $('#moSaveSchedule').onclick=()=>{put('mo_scheduled_order_v1',{date:$('#moScheduleDate').value,time:$('#moScheduleTime').value,type:$('#moScheduleType').value});toast('Scheduled pickup saved');status()};
}
function openDietFilters(){
 const s=st(),out=sheet('Allergen & Diet Filters','Filter the Orbit using demo dietary preferences.');
 const prefs=get('mo_diet_filters_v1',[]);
 const filters=[['vegetarian','Vegetarian'],['dairyfree','Dairy-Free'],['lowerSugar','Lower Sugar'],['noCoffee','No Coffee'],['lowCal','Under 200 Calories']];
 out.innerHTML='<div class="mo-filterbar" style="flex-wrap:wrap">'+filters.map(([k,l])=>'<button data-diet="'+k+'" class="'+(prefs.includes(k)?'on':'')+'">'+l+'</button>').join('')+'</div><button class="mo-primary" style="width:100%" id="moApplyDiet">APPLY TO ORBIT</button><p class="demo-banner">These are demo filters based on menu metadata and name/category heuristics. Always confirm official allergen information before ordering.</p>';
 out.querySelectorAll('[data-diet]').forEach(b=>b.onclick=()=>b.classList.toggle('on'));
 $('#moApplyDiet').onclick=()=>{const active=out.querySelectorAll('[data-diet].on');const keys=[...active].map(x=>x.dataset.diet);put('mo_diet_filters_v1',keys);
   try{
     const prods=catalog(),match=p=>{
       return keys.every(k=>{
         if(k==='vegetarian')return !/ham|pork|chicken|beef|tuna/i.test(p.name);
         if(k==='dairyfree')return !/cream|cheese|milk|mocha|chocolate/i.test(p.name);
         if(k==='lowerSugar')return !/caramel|white mocha|frappuccino|chocolate/i.test(p.name);
         if(k==='noCoffee')return !/coffee|espresso|latte|americano|mocha|cold brew|macchiato/i.test(p.name);
         if(k==='lowCal')return Number(p.cal||999)<200;
         return true;
       })
     };
     const ids=prods.filter(match).map(p=>p.id);
     document.querySelectorAll('.product').forEach(el=>el.style.display=ids.includes(el.dataset.id)?'':'none');
     toast(ids.length+' items match');
   }catch{}
 };
}
function openDealReminders(){
 const saved=get('mo_deal_reminders_v1',[]),out=sheet('Deal Reminders','Save demo reminders for Happy Hour and expiring offers.');
 const deals=[
   {id:'happy-hour',name:'Happy Hour',when:'Today • 3:00 PM'},
   {id:'voucher-expiry',name:'₱50 Voucher',when:'Expires tonight'},
   {id:'seasonal',name:'Seasonal Menu Drop',when:'Demo reminder'}
 ];
 out.innerHTML=deals.map(d=>'<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(d.name)+'</b><small>'+esc(d.when)+'</small></div><button data-remind="'+d.id+'">'+(saved.includes(d.id)?'Reminder On ✓':'Remind Me')+'</button></div>').join('')+'<p class="demo-banner">Reminders are stored locally for this prototype.</p>';
 out.querySelectorAll('[data-remind]').forEach(b=>b.onclick=()=>{let arr=get('mo_deal_reminders_v1',[]),id=b.dataset.remind;arr=arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];put('mo_deal_reminders_v1',arr);openDealReminders()});
}

function openGiftOrder(){
 const current=get('mo_gift_order_v1',null),out=sheet('Gift Order','Prepare the current cart as a gift for someone else.');
 out.innerHTML='<div class="mo-form"><input id="moGiftName" placeholder="Recipient name" value="'+esc(current?.name||'')+'"><input id="moGiftContact" placeholder="Recipient contact (demo)" value="'+esc(current?.contact||'')+'"><textarea id="moGiftNote" placeholder="Gift note">'+esc(current?.note||'')+'</textarea><select id="moGiftHandoff"><option '+(current?.handoff==='Recipient pickup'?'selected':'')+'>Recipient pickup</option><option '+(current?.handoff==='I will pick up'?'selected':'')+'>I will pick up</option></select><button class="mo-primary" id="moSaveGift">SAVE GIFT ORDER</button></div><div id="moGiftStatus"></div><p class="demo-banner">Demo only. No message or personal information is sent anywhere.</p>';
 const render=()=>{const g=get('mo_gift_order_v1',null);$('#moGiftStatus').innerHTML=g?'<div class="mo-saved-banner"><b>Gift for:</b> '+esc(g.name||'Recipient')+' • '+esc(g.handoff)+'</div>':''};render();
 $('#moSaveGift').onclick=()=>{const g={name:$('#moGiftName').value.trim(),contact:$('#moGiftContact').value.trim(),note:$('#moGiftNote').value.trim(),handoff:$('#moGiftHandoff').value};put('mo_gift_order_v1',g);toast('Gift order details saved');render()};
}
function openGroupOrder(){
 const group=get('mo_group_order_v1',{code:'GRP-'+Date.now().toString().slice(-5),members:[]}),out=sheet('Group Order','Let several demo participants contribute items to one shared cart on this device.');
 out.innerHTML='<div class="mo-saved-banner"><b>Group code:</b> '+esc(group.code)+'</div><div class="mo-form"><input id="moGroupMember" placeholder="Participant name"><button class="mo-primary" id="moAddMember">ADD PARTICIPANT</button></div><div class="section-title">Participants</div><div id="moGroupMembers">'+(group.members.length?group.members.map((m,i)=>'<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(m.name)+'</b><small>'+esc(m.items||0)+' item(s) assigned</small></div><button data-group-remove="'+i+'">Remove</button></div>').join(''):'<div class="empty">No participants yet.</div>')+'</div><button class="mo-primary" style="width:100%;margin-top:12px" id="moAssignCart">ASSIGN CURRENT CART TO LAST PARTICIPANT</button><p class="demo-banner">This demo shares one browser/localStorage session. It is not real multi-device collaboration.</p>';
 $('#moAddMember').onclick=()=>{const name=$('#moGroupMember').value.trim();if(!name)return;group.members.push({name,items:0});put('mo_group_order_v1',group);openGroupOrder()};
 out.querySelectorAll('[data-group-remove]').forEach(b=>b.onclick=()=>{group.members.splice(+b.dataset.groupRemove,1);put('mo_group_order_v1',group);openGroupOrder()});
 $('#moAssignCart').onclick=()=>{if(!group.members.length)return toast('Add a participant first');const cart=st()?.cart||get('menuOrbitCart',[]);group.members[group.members.length-1].items=cart.reduce((n,x)=>n+(x.qty||1),0);put('mo_group_order_v1',group);toast('Current cart assigned to '+group.members[group.members.length-1].name);openGroupOrder()};
}
function openLoyaltyMilestones(){
 const orders=get('menuOrbitOrders',[]),drinkCount=orders.flatMap(o=>o.items||[]).filter(x=>!/croffle|cake|wrap|lasagna|blondie|pao/i.test(x.name||'')).reduce((n,x)=>n+(x.qty||1),0);
 const goal=5,next=Math.max(0,goal-(drinkCount%goal||goal)),progress=(drinkCount%goal)/goal*100;
 const out=sheet('Loyalty Milestones','See progress toward the next demo reward.');
 out.innerHTML='<div class="mo-banner"><b>'+drinkCount+' eligible drink'+(drinkCount===1?'':'s')+' ordered</b><br>'+(next===0?'Reward milestone reached!':next+' more until the next demo reward.')+'</div><div class="progress-shell" style="margin:16px 0"><i style="width:'+Math.min(100,progress)+'%"></i></div><div class="mo-next-grid"><div class="mo-next-card"><h4>☕ 5 Drinks</h4><small>Unlock a demo free-drink milestone.</small></div><div class="mo-next-card"><h4>★ 10 Drinks</h4><small>Unlock a demo bonus Stars milestone.</small></div></div><p class="demo-banner">Milestones are presentation logic only and are not an official Starbucks rewards program.</p>';
}
function openDynamicEta(){
 const q=get('mo_demo_orders_v1',[]).filter(o=>!['COLLECTED'].includes(o.status)).length,base=6,per=2,eta=base+q*per,store=get('menuOrbitPickup',{}).store||'Selected branch';
 const out=sheet('Dynamic Pickup ETA','Estimated preparation time based on the current demo queue.');
 out.innerHTML='<div class="mo-statgrid"><div class="mo-stat"><b>'+q+'</b><small>Active orders</small></div><div class="mo-stat"><b>'+eta+'m</b><small>Estimated prep</small></div><div class="mo-stat"><b>'+Math.max(1,q+1)+'</b><small>Your queue position</small></div></div><div class="mo-saved-banner"><b>'+esc(store)+'</b><br>Estimated pickup window: '+eta+'–'+(eta+4)+' minutes from now.</div><p class="demo-banner">ETA is calculated from demo queue data in this browser, not a live Starbucks branch queue.</p>';
}

/* Customer completion batch: tracking, reorder, recents, recommendations, presets */
const app=()=>window.MenuOrbitApp||null;

function orderTrackingStatus(order){
 const saved=get('mo_order_tracking_v1',{});
 return saved[order?.code]||order?.status||'Order received';
}
function openOrderTracking(){
 const orders=get('menuOrbitOrders',[]);
 const out=sheet('Order Tracking','Follow your latest demo order from receipt through pickup.');
 if(!orders.length){out.innerHTML='<div class="empty">No orders to track yet.</div>';return}
 out.innerHTML=orders.slice(0,8).map((o,i)=>{
   const status=orderTrackingStatus(o);
   const steps=['Order received','Preparing your order','Ready for pickup','Collected'];
   const normalized=/collected/i.test(status)?3:/ready/i.test(status)?2:/prepar/i.test(status)?1:0;
   return '<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(o.code||('Order '+(i+1)))+'</h4><small>'+esc(o.createdAt||'')+' • '+esc(o.pickup?.store||'Selected branch')+'</small>'+
     '<div style="margin-top:12px">'+steps.map((s,ix)=>'<div class="status-step '+(ix<=normalized?'active':'')+'"><b>'+(ix+1)+'</b>'+esc(s)+'</div>').join('')+'</div>'+
     (normalized<3?'<button data-track-advance="'+i+'" style="margin-top:10px">ADVANCE DEMO STATUS</button>':'')+
     '</div>'
 }).join('');
 out.querySelectorAll('[data-track-advance]').forEach(b=>b.onclick=()=>{
   const o=orders[+b.dataset.trackAdvance],steps=['Order received','Preparing your order','Ready for pickup','Collected'];
   const current=orderTrackingStatus(o);
   let ix=/collected/i.test(current)?3:/ready/i.test(current)?2:/prepar/i.test(current)?1:0;
   ix=Math.min(3,ix+1);
   const map=get('mo_order_tracking_v1',{});map[o.code]=steps[ix];put('mo_order_tracking_v1',map);
   toast('Order status updated');openOrderTracking();
 });
}

function addOrderItemsToCart(order){
 const a=app();
 if(!order?.items?.length)return false;
 if(a?.addToCart){
   order.items.forEach(x=>a.addToCart({...x,key:Date.now()+Math.random(),qty:x.qty||1}));
   return true;
 }
 const cart=get('menuOrbitCart',[]);
 order.items.forEach(x=>cart.push({...x,key:Date.now()+Math.random(),qty:x.qty||1}));
 put('menuOrbitCart',cart);
 return true;
}
function openReorder(){
 const orders=get('menuOrbitOrders',[]);
 const out=sheet('Reorder','Add a previous order back to your current cart.');
 out.innerHTML=orders.length?orders.slice(0,10).map((o,i)=>
   '<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(o.code||('Order '+(i+1)))+'</b><small>'+esc((o.items||[]).map(x=>(x.qty||1)+' × '+x.name).join(' • '))+'<br>'+money(o.total||0)+'</small></div><button data-reorder="'+i+'">Reorder</button></div>'
 ).join(''):'<div class="empty">No previous orders yet.</div>';
 out.querySelectorAll('[data-reorder]').forEach(b=>b.onclick=()=>{
   const o=orders[+b.dataset.reorder];
   if(addOrderItemsToCart(o)){toast('Previous order added to cart');setTimeout(()=>app()?.openCart?.(),250)}
 });
}

function openRecentlyViewed(){
 const recent=get('mo_recently_viewed_v1',[]);
 const out=sheet('Recently Viewed','Products you opened recently on this device.');
 out.innerHTML=recent.length?recent.map((p,i)=>
   '<div class="mo-result"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat||'Menu')+' • '+money(p.price)+'</small></div><button data-recent-view="'+esc(p.id)+'">View</button></div>'
 ).join('')+'<button class="mo-primary" style="width:100%;margin-top:12px" id="moClearRecent">CLEAR RECENTLY VIEWED</button>':'<div class="empty">No recently viewed products yet. Open a menu item first.</div>';
 out.querySelectorAll('[data-recent-view]').forEach(b=>b.onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');app()?.openProduct?.(b.dataset.recentView)});
 $('#moClearRecent')?.addEventListener('click',()=>{put('mo_recently_viewed_v1',[]);openRecentlyViewed()});
}

function recommendationList(){
 const a=app(),products=a?.products||[],recent=get('mo_recently_viewed_v1',[]),favs=get('menuOrbitFavorites',[]),orders=get('menuOrbitOrders',[]);
 const seedIds=[...recent.map(x=>x.id),...favs,...orders.flatMap(o=>(o.items||[]).map(x=>x.id))].filter(Boolean);
 const seedProducts=seedIds.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 const cats=new Map();
 seedProducts.forEach(p=>cats.set(p.cat,(cats.get(p.cat)||0)+1));
 return products.filter(p=>!seedIds.includes(p.id)).map(p=>({
   p,score:(cats.get(p.cat)||0)*5+(p.cat==='Featured'?2:0)+(p.kind==='drink'?1:0)
 })).sort((a,b)=>b.score-a.score||a.p.price-b.p.price).slice(0,8).map(x=>x.p);
}
function openRecommended(){
 const list=recommendationList();
 const out=sheet('Recommended for You','Demo suggestions based on your recent views, favorites, and previous orders.');
 out.innerHTML=list.length?list.map(p=>
   '<div class="mo-result"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat)+' • '+money(p.price)+'</small></div><button data-rec-open="'+esc(p.id)+'">View</button></div>'
 ).join('')+'<p class="demo-banner">Recommendations are generated locally from this browser’s demo activity.</p>':'<div class="empty">Browse or favorite a few products first so recommendations can learn from your activity.</div>';
 out.querySelectorAll('[data-rec-open]').forEach(b=>b.onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');app()?.openProduct?.(b.dataset.recOpen)});
}

function currentPresetDraft(){
 const a=app(),s=a?.getState?.(),p=s?.selected;
 if(!p)return null;
 const size=document.querySelector('[name=size]:checked')?.value||'Regular';
 const styleValue=document.querySelector('[name=temp]:checked')?.value||p.temps?.[0]||'';
 const milk=$('#milk')?.value||'';
 const shots=$('#shots')?.value||'0';
 const whip=!!$('#whip')?.checked,drizzle=!!$('#drizzle')?.checked;
 const live=String($('#livePrice')?.textContent||'').replace(/[^0-9.]/g,'');
 return {id:'PRE-'+Date.now().toString().slice(-6),productId:p.id,productName:p.name,img:p.img,size,style:styleValue,milk,shots,whip,drizzle,price:Number(live)||p.price,name:p.name+' preset'};
}
function openPresets(){
 const presets=get('mo_drink_presets_v1',[]),draft=currentPresetDraft(),out=sheet('Saved Drink Presets','Save a customized drink and add it back to your cart in one tap.');
 out.innerHTML=(draft?'<div class="mo-form"><input id="moPresetName" value="'+esc(draft.productName+' preset')+'" placeholder="Preset name"><button class="mo-primary" id="moSaveCurrentPreset">SAVE CURRENT CUSTOMIZATION</button></div>':'<div class="mo-saved-banner">Open and customize a drink first, then return here to save it as a preset.</div>')+
 '<div class="section-title">Saved presets</div>'+
 (presets.length?presets.map((p,i)=>'<div class="mo-pair-card"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.productName)+' • '+esc(p.size)+' • '+esc(p.style)+' • '+money(p.price)+'</small></div><div><button data-preset-add="'+i+'">Add</button><button data-preset-remove="'+i+'" style="margin-top:6px">Remove</button></div></div>').join(''):'<div class="empty">No saved drink presets yet.</div>')+
 '<p class="demo-banner">Presets are stored only in this browser.</p>';
 $('#moSaveCurrentPreset')?.addEventListener('click',()=>{
   const d=currentPresetDraft();if(!d)return;
   d.name=$('#moPresetName').value.trim()||d.name;
   const arr=get('mo_drink_presets_v1',[]);arr.unshift(d);put('mo_drink_presets_v1',arr.slice(0,20));toast('Drink preset saved');openPresets();
 });
 out.querySelectorAll('[data-preset-add]').forEach(b=>b.onclick=()=>{
   const p=get('mo_drink_presets_v1',[])[+b.dataset.presetAdd];if(!p)return;
   app()?.addToCart?.({id:p.productId,name:p.productName,img:p.img,size:p.size,style:p.style,milk:p.milk,price:p.price,qty:1,note:'Saved preset'});
   toast('Preset added to cart');
 });
 out.querySelectorAll('[data-preset-remove]').forEach(b=>b.onclick=()=>{
   const arr=get('mo_drink_presets_v1',[]);arr.splice(+b.dataset.presetRemove,1);put('mo_drink_presets_v1',arr);openPresets();
 });
}
function hookPresetButton(){
 const detail=$('#detail');if(!detail)return;
 const apply=()=>{
   if(!detail.classList.contains('open')||$('#moSavePresetFromDetail'))return;
   const add=$('#addBtn');if(!add)return;
   const b=document.createElement('button');b.id='moSavePresetFromDetail';b.className='favorite-toggle';b.style.cssText='float:none;width:100%;margin:10px 0 0';b.textContent='☆ Save as Drink Preset';b.onclick=openPresets;
   add.insertAdjacentElement('beforebegin',b);
 };
 new MutationObserver(apply).observe(detail,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});apply();
}


function openModifyCancel(){
 const orders=get('menuOrbitOrders',[]),statusMap=get('mo_order_tracking_v1',{}),out=sheet('Modify / Cancel Order','Changes are available only before preparation begins in this demo.');
 if(!orders.length){out.innerHTML='<div class="empty">No active orders available.</div>';return}
 out.innerHTML=orders.slice(0,8).map((o,i)=>{
   const status=statusMap[o.code]||o.status||'Order received';
   const locked=/prepar|ready|collected|cancel/i.test(status);
   return '<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(o.code||('Order '+(i+1)))+'</h4><small>'+esc(status)+' • '+esc(o.pickup?.store||'Selected branch')+'</small><div class="mo-complete-row" style="margin-top:10px"><button data-modify="'+i+'" '+(locked?'disabled':'')+'>Modify</button><button data-cancel="'+i+'" '+(locked?'disabled':'')+'>Cancel</button></div></div>'
 }).join('')+'<p class="demo-banner">Demo rule: an order locks once preparation begins.</p>';
 out.querySelectorAll('[data-modify]').forEach(b=>b.onclick=()=>{
   const o=orders[+b.dataset.modify]; if(!o)return;
   addOrderItemsToCart(o); toast('Items copied to cart for modification'); setTimeout(()=>app()?.openCart?.(),250);
 });
 out.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>{
   const o=orders[+b.dataset.cancel];if(!o)return;
   const map=get('mo_order_tracking_v1',{});map[o.code]='Cancelled';put('mo_order_tracking_v1',map);toast('Order cancelled');openModifyCancel();
 });
}
function openStoreAvailability(){
 const a=app(),products=a?.products||[],pickup=get('menuOrbitPickup',{}),store=pickup.store||'Starbucks SM City Bacoor';
 const unavailable=store.includes('Molino')?['raclette-lasagna','mango-dragonfruit-lemonade']:store.includes('Vista')?['ham-cheese-croffle','cold-brew']:[];
 const out=sheet('Store Availability','Check demo item availability for your selected pickup branch.');
 out.innerHTML='<div class="mo-saved-banner"><b>'+esc(store)+'</b></div>'+
 (products.slice(0,30).map(p=>'<div class="mo-result" style="grid-template-columns:1fr auto"><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat)+' • '+money(p.price)+'</small></div><button disabled>'+(unavailable.includes(p.id)?'Unavailable':'Available ✓')+'</button></div>').join('')||'<div class="empty">No catalog loaded.</div>')+
 '<p class="demo-banner">Availability is prototype data and not connected to live store inventory.</p>';
}
function openVoucherWallet(){
 const claimed=get('mo_voucher_wallet_v1',[{id:'WELCOME50',name:'₱50 Welcome Voucher',status:'active',expires:'2026-12-31'},{id:'PAIR10',name:'Pair & Save Demo',status:'used',expires:'2026-09-20'}]),out=sheet('Voucher Wallet','View active, used, and expired demo vouchers.');
 const now=new Date().toISOString().slice(0,10);
 const normalized=claimed.map(v=>({...v,status:v.status==='active'&&v.expires<now?'expired':v.status}));
 const tabs=['active','used','expired'];
 out.innerHTML='<div class="mo-filterbar" id="moVoucherTabs">'+tabs.map((t,i)=>'<button data-vtab="'+t+'" class="'+(i===0?'on':'')+'">'+t.toUpperCase()+'</button>').join('')+'</div><div id="moVoucherList"></div><p class="demo-banner">Demo voucher wallet only.</p>';
 const render=tab=>{const list=normalized.filter(v=>v.status===tab);$('#moVoucherList').innerHTML=list.length?list.map(v=>'<div class="mo-next-card" style="margin-bottom:10px"><h4>'+esc(v.name)+'</h4><small>Code: '+esc(v.id)+' • Expires '+esc(v.expires)+'</small></div>').join(''):'<div class="empty">No '+tab+' vouchers.</div>'};
 out.querySelectorAll('[data-vtab]').forEach(b=>b.onclick=()=>{out.querySelectorAll('[data-vtab]').forEach(x=>x.classList.remove('on'));b.classList.add('on');render(b.dataset.vtab)});render('active');
}
function openRewardsHistory(){
 let audit=[];try{audit=JSON.parse(localStorage.getItem('starRewardsAudit')||'[]')}catch{}
 const orders=get('menuOrbitOrders',[]),out=sheet('Rewards History','See demo Stars earned and rewards redeemed.');
 if(!audit.length){
   audit=orders.slice(0,8).map(o=>({label:'Stars earned',detail:(o.items||[]).filter(x=>!/cake|wrap|croffle|lasagna|blondie/i.test(x.name||'')).length+' Star(s) • '+(o.code||'Order'),date:o.createdAt||''}));
 }
 out.innerHTML=audit.length?audit.map(x=>'<div class="mo-next-card" style="margin-bottom:10px"><h4>'+esc(x.label||x.type||'Reward activity')+'</h4><small>'+esc(x.detail||x.note||'')+'<br>'+esc(x.date||x.createdAt||'')+'</small></div>').join(''):'<div class="empty">No rewards activity yet.</div>';
}
function openPostPickupFeedback(){
 const orders=get('menuOrbitOrders',[]).filter(o=>/collected|completed/i.test(orderTrackingStatus(o))),feedback=get('mo_order_feedback_v1',{}),out=sheet('Post-Pickup Feedback','Rate completed orders and save a short comment.');
 if(!orders.length){out.innerHTML='<div class="empty">Complete or collect an order first.</div>';return}
 out.innerHTML=orders.slice(0,8).map((o,i)=>'<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(o.code||('Order '+(i+1)))+'</h4><small>'+esc(o.pickup?.store||'Selected branch')+'</small><div class="mo-filterbar" data-rate-wrap="'+i+'" style="margin-top:10px">'+[1,2,3,4,5].map(n=>'<button data-rate-order="'+i+'" data-rate="'+n+'" class="'+(feedback[o.code]?.rating===n?'on':'')+'">'+n+'★</button>').join('')+'</div><textarea data-feedback="'+i+'" class="mo-share-box" style="min-height:70px" placeholder="Comment">'+esc(feedback[o.code]?.comment||'')+'</textarea><button data-save-feedback="'+i+'" style="margin-top:8px;width:100%">SAVE FEEDBACK</button></div>').join('');
 out.querySelectorAll('[data-rate-order]').forEach(b=>b.onclick=()=>{const wrap=b.closest('[data-rate-wrap]');wrap.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')});
 out.querySelectorAll('[data-save-feedback]').forEach(b=>b.onclick=()=>{const i=+b.dataset.saveFeedback,o=orders[i],wrap=out.querySelector('[data-rate-wrap="'+i+'"]'),rating=Number(wrap.querySelector('.on')?.dataset.rate||0),comment=out.querySelector('[data-feedback="'+i+'"]').value.trim();const all=get('mo_order_feedback_v1',{});all[o.code]={rating,comment,savedAt:new Date().toISOString()};put('mo_order_feedback_v1',all);toast('Feedback saved')});
}


function openFavoriteStore(){
 const branches=['Starbucks SM City Bacoor','Starbucks Molino Boulevard','Starbucks Vista Mall Daang Hari'];
 const current=get('mo_favorite_store_v1',''),pickup=get('menuOrbitPickup',{});
 const out=sheet('Favorite Store','Save a default branch for faster pickup planning.');
 out.innerHTML='<div class="mo-form">'+branches.map(name=>'<label class="mo-pref"><span><b>'+esc(name)+'</b><small>'+(name===pickup.store?'Current pickup branch':'Tap to save as favorite')+'</small></span><input type="radio" name="moFavoriteStore" value="'+esc(name)+'" '+(current===name?'checked':'')+'></label>').join('')+'<button class="mo-primary" id="moSaveFavoriteStore">SAVE FAVORITE STORE</button></div><div id="moFavoriteStoreStatus"></div><p class="demo-banner">Saved on this browser only.</p>';
 const status=()=>{const fav=get('mo_favorite_store_v1','');$('#moFavoriteStoreStatus').innerHTML=fav?'<div class="mo-saved-banner"><b>Favorite store:</b> '+esc(fav)+'</div>':''};status();
 $('#moSaveFavoriteStore').onclick=()=>{const selected=out.querySelector('input[name="moFavoriteStore"]:checked')?.value;if(!selected)return toast('Choose a store first');put('mo_favorite_store_v1',selected);const p=get('menuOrbitPickup',{});p.store=selected;put('menuOrbitPickup',p);toast('Favorite store saved');status()};
}

function unavailableIdsForStore(store){
 if((store||'').includes('Molino'))return ['raclette-lasagna','mango-dragonfruit-lemonade'];
 if((store||'').includes('Vista'))return ['ham-cheese-croffle','cold-brew'];
 return [];
}
function substitutionFor(p,products,unavailable){
 const candidates=products.filter(x=>x.id!==p.id&&!unavailable.includes(x.id));
 return candidates.find(x=>x.cat===p.cat&&x.kind===p.kind)||
        candidates.find(x=>x.kind===p.kind)||
        candidates[0]||null;
}
function openSmartSubstitutions(){
 const a=app(),products=a?.products||[],store=get('menuOrbitPickup',{}).store||get('mo_favorite_store_v1','Starbucks SM City Bacoor');
 const unavailable=unavailableIdsForStore(store),items=products.filter(p=>unavailable.includes(p.id));
 const out=sheet('Smart Substitutions','Find a similar available choice when a selected branch is out of an item.');
 out.innerHTML='<div class="mo-saved-banner"><b>'+esc(store)+'</b></div>'+
 (items.length?items.map(p=>{const alt=substitutionFor(p,products,unavailable);return '<div class="mo-pair-card"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>Unavailable at this demo branch'+(alt?'<br>Try: '+esc(alt.name)+' • '+money(alt.price):'')+'</small></div>'+(alt?'<button data-substitute="'+esc(alt.id)+'">View Alternative</button>':'')+'</div>'}).join(''):'<div class="empty">No unavailable items at this demo branch right now.</div>')+
 '<p class="demo-banner">Substitutions are demo suggestions based on category/type similarity, not live Starbucks inventory.</p>';
 out.querySelectorAll('[data-substitute]').forEach(b=>b.onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');a?.openProduct?.(b.dataset.substitute)});
}

function openFavoriteCollections(){
 const a=app(),products=a?.products||[],favoriteIds=get('menuOrbitFavorites',[]),collections=get('mo_favorite_collections_v1',[]);
 const favProducts=favoriteIds.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 const out=sheet('Favorites Collections','Organize saved drinks and food into your own groups.');
 out.innerHTML='<div class="mo-form"><input id="moCollectionName" placeholder="Collection name, e.g. Weekend"><button class="mo-primary" id="moCreateCollection">CREATE COLLECTION</button></div>'+
 '<div class="section-title">Collections</div>'+
 (collections.length?collections.map((col,i)=>'<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(col.name)+'</h4><small>'+col.ids.length+' saved item'+(col.ids.length===1?'':'s')+'</small><div class="mo-complete-row" style="margin-top:8px"><button data-collection-open="'+i+'">Open</button><button data-collection-delete="'+i+'">Delete</button></div></div>').join(''):'<div class="empty">No collections yet.</div>')+
 '<div class="section-title">Saved favorites</div>'+
 (favProducts.length?favProducts.map(p=>'<div class="mo-result"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat)+' • '+money(p.price)+'</small></div><select data-fav-collection="'+esc(p.id)+'"><option value="">Add to…</option>'+collections.map((col,i)=>'<option value="'+i+'">'+esc(col.name)+'</option>').join('')+'</select></div>').join(''):'<div class="empty">Favorite a product first.</div>');
 $('#moCreateCollection').onclick=()=>{const name=$('#moCollectionName').value.trim();if(!name)return;const arr=get('mo_favorite_collections_v1',[]);arr.push({name,ids:[]});put('mo_favorite_collections_v1',arr);toast('Collection created');openFavoriteCollections()};
 out.querySelectorAll('[data-fav-collection]').forEach(sel=>sel.onchange=()=>{if(sel.value==='')return;const arr=get('mo_favorite_collections_v1',[]),col=arr[+sel.value],id=sel.dataset.favCollection;if(col&&!col.ids.includes(id)){col.ids.push(id);put('mo_favorite_collections_v1',arr);toast('Added to '+col.name)}});
 out.querySelectorAll('[data-collection-open]').forEach(b=>b.onclick=()=>{const col=get('mo_favorite_collections_v1',[])[+b.dataset.collectionOpen];if(!col)return;out.innerHTML='<div class="mo-saved-banner"><b>'+esc(col.name)+'</b></div>'+(col.ids.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(p=>'<div class="mo-result"><img src="'+esc(p.img||'')+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.cat)+' • '+money(p.price)+'</small></div><button data-open-col-product="'+esc(p.id)+'">View</button></div>').join('')||'<div class="empty">This collection is empty.</div>');out.querySelectorAll('[data-open-col-product]').forEach(x=>x.onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');a?.openProduct?.(x.dataset.openColProduct)})});
 out.querySelectorAll('[data-collection-delete]').forEach(b=>b.onclick=()=>{const arr=get('mo_favorite_collections_v1',[]);arr.splice(+b.dataset.collectionDelete,1);put('mo_favorite_collections_v1',arr);toast('Collection deleted');openFavoriteCollections()});
}

function openRefundIssueStatus(){
 const orders=get('menuOrbitOrders',[]),issues=get('mo_customer_issues_v1',[]);
 const out=sheet('Refund / Issue Status','Submit and track demo order issues from reported to resolved.');
 out.innerHTML='<div class="mo-form"><select id="moIssueOrder"><option value="">Choose order</option>'+orders.slice(0,10).map(o=>'<option value="'+esc(o.code||'')+'">'+esc(o.code||'Order')+'</option>').join('')+'</select><select id="moIssueType"><option>Missing item</option><option>Wrong item</option><option>Quality issue</option><option>Refund request</option></select><textarea id="moIssueNote" placeholder="Describe the issue"></textarea><button class="mo-primary" id="moSubmitIssue">SUBMIT ISSUE</button></div><div class="section-title">My requests</div>'+
 (issues.length?issues.map((x,i)=>'<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(x.type)+' • '+esc(x.orderCode)+'</h4><small>'+esc(x.status)+'<br>'+esc(x.note||'')+'</small>'+(x.status!=='Resolved'?'<button data-issue-advance="'+i+'" style="margin-top:8px;width:100%">ADVANCE DEMO STATUS</button>':'')+'</div>').join(''):'<div class="empty">No issue requests yet.</div>')+
 '<p class="demo-banner">Demo workflow only. No real refund is processed.</p>';
 $('#moSubmitIssue').onclick=()=>{const orderCode=$('#moIssueOrder').value,type=$('#moIssueType').value,note=$('#moIssueNote').value.trim();if(!orderCode)return toast('Choose an order');const arr=get('mo_customer_issues_v1',[]);arr.unshift({id:'ISS-'+Date.now().toString().slice(-6),orderCode,type,note,status:'Reported',createdAt:new Date().toISOString()});put('mo_customer_issues_v1',arr);toast('Issue submitted');openRefundIssueStatus()};
 out.querySelectorAll('[data-issue-advance]').forEach(b=>b.onclick=()=>{const arr=get('mo_customer_issues_v1',[]),x=arr[+b.dataset.issueAdvance];if(!x)return;const flow=['Reported','Reviewing','Resolved'];x.status=flow[Math.min(flow.length-1,flow.indexOf(x.status)+1)];put('mo_customer_issues_v1',arr);toast('Issue status updated');openRefundIssueStatus()});
}

function buildNotifications(){
 const orders=get('menuOrbitOrders',[]),issues=get('mo_customer_issues_v1',[]),vouchers=get('mo_voucher_wallet_v1',[]),reminders=get('mo_deal_reminders_v1',[]);
 const list=[];
 orders.slice(0,4).forEach(o=>list.push({id:'order-'+(o.code||''),type:'Order',title:(o.code||'Order')+' • '+orderTrackingStatus(o),time:o.createdAt||''}));
 issues.slice(0,4).forEach(x=>list.push({id:'issue-'+x.id,type:'Support',title:x.type+' • '+x.status,time:x.createdAt||''}));
 vouchers.filter(v=>v.status==='active').slice(0,3).forEach(v=>list.push({id:'voucher-'+v.id,type:'Voucher',title:v.name+' • expires '+v.expires,time:''}));
 reminders.slice(0,3).forEach(id=>list.push({id:'reminder-'+id,type:'Reminder',title:'Deal reminder: '+id,time:''}));
 return list;
}
function openNotificationCenter(){
 const read=get('mo_notification_center_read_v1',{}),list=buildNotifications(),out=sheet('Notification Center','Order, support, voucher, reward, and reminder updates in one place.');
 out.innerHTML='<div class="mo-complete-row"><button id="moMarkAllRead">MARK ALL READ</button><button id="moClearNotifRead">RESET READ STATE</button></div><div class="section-title">Updates</div>'+
 (list.length?list.map(n=>'<div class="mo-next-card" style="margin-bottom:10px;opacity:'+(read[n.id]?.read?'.62':'1')+'"><h4>'+(!read[n.id]?.read?'● ':'')+esc(n.title)+'</h4><small>'+esc(n.type)+(n.time?' • '+esc(n.time):'')+'</small><button data-notif-read="'+esc(n.id)+'" style="margin-top:8px">'+(read[n.id]?.read?'Read ✓':'Mark Read')+'</button></div>').join(''):'<div class="empty">No notifications yet.</div>');
 out.querySelectorAll('[data-notif-read]').forEach(b=>b.onclick=()=>{const r=get('mo_notification_center_read_v1',{});r[b.dataset.notifRead]={read:true,at:new Date().toISOString()};put('mo_notification_center_read_v1',r);openNotificationCenter()});
 $('#moMarkAllRead').onclick=()=>{const r={};list.forEach(n=>r[n.id]={read:true,at:new Date().toISOString()});put('mo_notification_center_read_v1',r);toast('All notifications marked read');openNotificationCenter()};
 $('#moClearNotifRead').onclick=()=>{put('mo_notification_center_read_v1',{});openNotificationCenter()};
}


function openQuickOrder(){
 const a=app(),orders=get('menuOrbitOrders',[]),favStore=get('mo_favorite_store_v1',''),pickup=get('menuOrbitPickup',{}),presets=get('mo_drink_presets_v1',[]);
 const last=orders[0]||null;
 const out=sheet('Quick Order','Build a cart in one tap using your saved store and recent choices.');
 out.innerHTML='<div class="mo-saved-banner"><b>Default pickup:</b> '+esc(favStore||pickup.store||'Not set')+'</div>'+
 '<div class="mo-next-grid">'+
 '<div class="mo-next-card"><h4>↻ Reorder Last</h4><small>'+(last?esc((last.items||[]).map(x=>x.name).join(' • ')):'No previous order')+'</small><button id="moQuickReorder" '+(!last?'disabled':'')+'>ADD LAST ORDER</button></div>'+
 '<div class="mo-next-card"><h4>★ Saved Preset</h4><small>'+(presets[0]?esc(presets[0].name):'No saved preset')+'</small><button id="moQuickPreset" '+(!presets.length?'disabled':'')+'>ADD PRESET</button></div>'+
 '</div><button class="mo-primary" style="width:100%;margin-top:12px" id="moQuickOpenCart">OPEN CART</button><p class="demo-banner">Quick Order uses locally saved demo preferences only.</p>';
 $('#moQuickReorder')?.addEventListener('click',()=>{if(last&&addOrderItemsToCart(last))toast('Last order added')});
 $('#moQuickPreset')?.addEventListener('click',()=>{const p=presets[0];if(!p)return;a?.addToCart?.({id:p.productId,name:p.productName,img:p.img,size:p.size,style:p.style,milk:p.milk,price:p.price,qty:1,note:'Quick Order preset'});toast('Preset added')});
 $('#moQuickOpenCart').onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');setTimeout(()=>a?.openCart?.(),160)};
}

function openPickupNotes(){
 const saved=get('mo_pickup_notes_v1',{note:'',method:'Counter pickup',arrival:false}),out=sheet('Pickup Notes','Save instructions that can follow your demo pickup preference.');
 out.innerHTML='<div class="mo-form"><select id="moPickupMethod"><option '+(saved.method==='Counter pickup'?'selected':'')+'>Counter pickup</option><option '+(saved.method==='Curbside pickup'?'selected':'')+'>Curbside pickup</option><option '+(saved.method==='Call on arrival'?'selected':'')+'>Call on arrival</option></select><textarea id="moPickupNote" placeholder="Special pickup instruction">'+esc(saved.note||'')+'</textarea><label class="mo-pref"><span><b>Arrival reminder</b><small>Show a local demo reminder when the order is ready.</small></span><input id="moArrivalReminder" type="checkbox" '+(saved.arrival?'checked':'')+'></label><button class="mo-primary" id="moSavePickupNotes">SAVE PICKUP NOTES</button></div><div id="moPickupNotesStatus"></div>';
 const render=()=>{const x=get('mo_pickup_notes_v1',null);$('#moPickupNotesStatus').innerHTML=x?'<div class="mo-saved-banner"><b>'+esc(x.method)+'</b><br>'+esc(x.note||'No special note')+'</div>':''};render();
 $('#moSavePickupNotes').onclick=()=>{put('mo_pickup_notes_v1',{method:$('#moPickupMethod').value,note:$('#moPickupNote').value.trim(),arrival:$('#moArrivalReminder').checked});toast('Pickup notes saved');render()};
}

function openReceiptSearch(){
 const orders=get('menuOrbitOrders',[]),out=sheet('Receipt Search','Search previous receipts by order code, product, date, or branch.');
 out.innerHTML='<div class="mo-form"><input id="moReceiptQuery" type="search" placeholder="Search receipts"><select id="moReceiptFilter"><option value="all">All fields</option><option value="code">Order code</option><option value="item">Product</option><option value="branch">Branch</option></select></div><div id="moReceiptResults"></div>';
 const render=()=>{
   const q=($('#moReceiptQuery').value||'').trim().toLowerCase(),filter=$('#moReceiptFilter').value;
   const list=orders.filter(o=>{
     const code=String(o.code||'').toLowerCase(),items=(o.items||[]).map(x=>x.name).join(' ').toLowerCase(),branch=String(o.pickup?.store||'').toLowerCase(),date=String(o.createdAt||'').toLowerCase();
     if(!q)return true;
     if(filter==='code')return code.includes(q);
     if(filter==='item')return items.includes(q);
     if(filter==='branch')return branch.includes(q);
     return [code,items,branch,date].some(x=>x.includes(q));
   });
   $('#moReceiptResults').innerHTML=list.length?list.slice(0,30).map(o=>'<div class="mo-next-card" style="margin-bottom:10px"><h4>'+esc(o.code||'Order')+'</h4><small>'+esc(o.createdAt||'')+' • '+esc(o.pickup?.store||'')+'<br>'+esc((o.items||[]).map(x=>(x.qty||1)+' × '+x.name).join(' • '))+'<br><b>'+money(o.total||0)+'</b></small></div>').join(''):'<div class="empty">No matching receipts.</div>';
 };
 $('#moReceiptQuery').addEventListener('input',render);$('#moReceiptFilter').addEventListener('change',render);render();
}

function applyAccessibilityPrefs(prefs){
 document.documentElement.style.fontSize=prefs.largeText?'112.5%':'';
 document.body.classList.toggle('mo-high-contrast',!!prefs.highContrast);
 document.body.classList.toggle('mo-simple-nav',!!prefs.simpleNav);
 if(prefs.reduceMotion)document.documentElement.style.setProperty('scroll-behavior','auto');
 else document.documentElement.style.removeProperty('scroll-behavior');
}
function openAccessibilityProfile(){
 const prefs=get('mo_accessibility_profile_v1',{largeText:false,reduceMotion:false,highContrast:false,simpleNav:false}),out=sheet('Accessibility Profile','Save display and navigation preferences on this device.');
 const rows=[['largeText','Larger text','Increase overall interface text size.'],['reduceMotion','Reduce motion','Minimize animated transitions.'],['highContrast','Higher contrast','Increase visual separation for controls.'],['simpleNav','Simplified navigation','Prefer clearer navigation presentation.']];
 out.innerHTML='<div class="mo-form">'+rows.map(([k,t,s])=>'<label class="mo-pref"><span><b>'+t+'</b><small>'+s+'</small></span><input type="checkbox" data-access="'+k+'" '+(prefs[k]?'checked':'')+'></label>').join('')+'<button class="mo-primary" id="moSaveAccessibility">SAVE ACCESSIBILITY PROFILE</button></div>';
 $('#moSaveAccessibility').onclick=()=>{const next={};out.querySelectorAll('[data-access]').forEach(x=>next[x.dataset.access]=x.checked);put('mo_accessibility_profile_v1',next);applyAccessibilityPrefs(next);toast('Accessibility profile saved')};
}
function restoreAccessibilityProfile(){applyAccessibilityPrefs(get('mo_accessibility_profile_v1',{largeText:false,reduceMotion:false,highContrast:false,simpleNav:false}))}

function openPrivacyDataControls(){
 const out=sheet('Privacy & Data Controls','Choose which locally stored demo activity to clear.');
 const actions=[
  ['recent','Recently viewed','mo_recently_viewed_v1'],
  ['search','Search history','mo_search_history_v1'],
  ['recommend','Recommendation activity','mo_recently_viewed_v1'],
  ['favorites','Favorites & collections','menuOrbitFavorites|mo_favorite_collections_v1'],
  ['orders','Orders & receipts','menuOrbitOrders|menuOrbitLastOrder|mo_order_tracking_v1'],
  ['support','Support & feedback','mo_customer_issues_v1|mo_order_feedback_v1']
 ];
 out.innerHTML='<div class="mo-next-grid">'+actions.map(([id,label])=>'<div class="mo-next-card"><h4>'+esc(label)+'</h4><small>Clear this category from the current browser.</small><button data-clear-data="'+id+'">CLEAR</button></div>').join('')+'</div><button class="mo-primary" style="width:100%;margin-top:14px" id="moClearPersonalization">CLEAR PERSONALIZATION ONLY</button><p class="demo-banner">This prototype stores these items in your browser. These controls do not affect any external Starbucks account.</p>';
 out.querySelectorAll('[data-clear-data]').forEach(b=>b.onclick=()=>{
   const row=actions.find(x=>x[0]===b.dataset.clearData);if(!row)return;
   row[2].split('|').forEach(k=>localStorage.removeItem(k));toast(row[1]+' cleared');openPrivacyDataControls();
 });
 $('#moClearPersonalization').onclick=()=>{['mo_recently_viewed_v1','mo_search_history_v1','mo_drink_presets_v1','mo_favorite_collections_v1','mo_favorite_store_v1','mo_pickup_notes_v1'].forEach(k=>localStorage.removeItem(k));toast('Personalization data cleared');openPrivacyDataControls()};
}


function openRecentlyOrdered(){
 const orders=get('menuOrbitOrders',[]),a=app(),seen=new Map();
 orders.flatMap(o=>(o.items||[]).map(x=>({...x,orderCode:o.code,createdAt:o.createdAt}))).forEach(x=>{if(x.id&&!seen.has(x.id))seen.set(x.id,x)});
 const items=[...seen.values()].slice(0,12),out=sheet('Recently Ordered','Jump back to items you ordered most recently.');
 out.innerHTML=items.length?items.map(x=>'<div class="mo-result"><img src="'+esc(x.img||'')+'" alt=""><div><b>'+esc(x.name)+'</b><small>'+esc(x.orderCode||'Previous order')+' • '+esc(x.createdAt||'')+'</small></div><button data-recent-order="'+esc(x.id)+'">View</button></div>').join(''):'<div class="empty">No recently ordered items yet.</div>';
 out.querySelectorAll('[data-recent-order]').forEach(b=>b.onclick=()=>{document.querySelector('#moCustomerNextSheet')?.classList.remove('open');a?.openProduct?.(b.dataset.recentOrder)});
}

function openSavedBasket(){
 const a=app(),saved=get('mo_saved_baskets_v1',[]),cart=a?.getState?.()?.cart||get('menuOrbitCart',[]),out=sheet('Saved Basket','Save an entire multi-item cart and restore it later.');
 out.innerHTML='<div class="mo-form"><input id="moBasketName" placeholder="Basket name" value="My saved order"><button class="mo-primary" id="moSaveBasket" '+(!cart.length?'disabled':'')+'>SAVE CURRENT CART</button></div><div class="section-title">Saved baskets</div>'+
 (saved.length?saved.map((b,i)=>'<div class="mo-next-card" style="margin-bottom:12px"><h4>'+esc(b.name)+'</h4><small>'+b.items.reduce((n,x)=>n+(x.qty||1),0)+' item(s) • '+money(b.items.reduce((n,x)=>n+(x.price||0)*(x.qty||1),0))+'</small><div class="mo-complete-row" style="margin-top:8px"><button data-basket-load="'+i+'">Add to Cart</button><button data-basket-delete="'+i+'">Delete</button></div></div>').join(''):'<div class="empty">No saved baskets yet.</div>');
 $('#moSaveBasket')?.addEventListener('click',()=>{const name=$('#moBasketName').value.trim()||'Saved Basket',items=(a?.getState?.()?.cart||get('menuOrbitCart',[])).map(x=>({...x}));if(!items.length)return;const arr=get('mo_saved_baskets_v1',[]);arr.unshift({id:'BASK-'+Date.now(),name,items,createdAt:new Date().toISOString()});put('mo_saved_baskets_v1',arr.slice(0,12));toast('Basket saved');openSavedBasket()});
 out.querySelectorAll('[data-basket-load]').forEach(b=>b.onclick=()=>{const basket=get('mo_saved_baskets_v1',[])[+b.dataset.basketLoad];if(!basket)return;basket.items.forEach(x=>a?.addToCart?.({...x,key:Date.now()+Math.random()}));toast('Saved basket added to cart')});
 out.querySelectorAll('[data-basket-delete]').forEach(b=>b.onclick=()=>{const arr=get('mo_saved_baskets_v1',[]);arr.splice(+b.dataset.basketDelete,1);put('mo_saved_baskets_v1',arr);toast('Saved basket deleted');openSavedBasket()});
}

function openOrderSpendInsights(){
 const orders=get('menuOrbitOrders',[]);
 const total=orders.reduce((n,o)=>n+Number(o.total||0),0);
 const items=orders.flatMap(o=>o.items||[]);
 const countByName={},storeCount={};
 items.forEach(x=>countByName[x.name]=(countByName[x.name]||0)+(x.qty||1));
 orders.forEach(o=>{const s=o.pickup?.store||'Selected branch';storeCount[s]=(storeCount[s]||0)+1});
 const favorite=Object.entries(countByName).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
 const topStore=Object.entries(storeCount).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
 const monthKey=new Date().toISOString().slice(0,7);
 const monthOrders=orders.filter(o=>{const d=new Date(o.createdAt||0);return !isNaN(d)&&d.toISOString().slice(0,7)===monthKey}).length;
 const out=sheet('Order & Spend Insights','A local summary of your demo ordering activity.');
 out.innerHTML='<div class="mo-statgrid"><div class="mo-stat"><b>'+orders.length+'</b><small>Total orders</small></div><div class="mo-stat"><b>'+monthOrders+'</b><small>This month</small></div><div class="mo-stat"><b>'+money(total)+'</b><small>Demo spend</small></div></div><div class="mo-next-grid" style="margin-top:12px"><div class="mo-next-card"><h4>Favorite item</h4><small>'+esc(favorite)+'</small></div><div class="mo-next-card"><h4>Most-used store</h4><small>'+esc(topStore)+'</small></div></div><p class="demo-banner">Insights use only order data stored in this browser.</p>';
}

function openIngredientAvailability(){
 const a=app(),products=a?.products||[],store=get('menuOrbitPickup',{}).store||get('mo_favorite_store_v1','Starbucks SM City Bacoor'),out=sheet('Ingredient Availability','Check demo customization availability at your selected branch.');
 const profiles={
  'Starbucks Molino Boulevard':{milk:['Whole milk','Soy milk','Almond milk'],syrup:['Vanilla','Caramel'],size:['Tall','Grande','Venti']},
  'Starbucks Vista Mall Daang Hari':{milk:['Whole milk','Nonfat milk','Oat milk'],syrup:['Vanilla','Hazelnut'],size:['Tall','Grande']},
  default:{milk:['Whole milk','Nonfat milk','Soy milk','Oat milk','Almond milk'],syrup:['Vanilla','Caramel','Hazelnut'],size:['Short','Tall','Grande','Venti']}
 };
 const p=profiles[store]||profiles.default;
 out.innerHTML='<div class="mo-saved-banner"><b>'+esc(store)+'</b></div><div class="mo-next-grid">'+
 '<div class="mo-next-card"><h4>Milk</h4><small>'+p.milk.map(x=>'✓ '+esc(x)).join('<br>')+'</small></div>'+
 '<div class="mo-next-card"><h4>Syrups</h4><small>'+p.syrup.map(x=>'✓ '+esc(x)).join('<br>')+'</small></div>'+
 '<div class="mo-next-card"><h4>Sizes</h4><small>'+p.size.map(x=>'✓ '+esc(x)).join('<br>')+'</small></div>'+
 '<div class="mo-next-card"><h4>Menu items</h4><small>'+products.length+' items in the current reference catalog.</small></div>'+
 '</div><p class="demo-banner">Ingredient availability is prototype data and is not connected to live branch inventory.</p>';
}

function openPickupReminder(){
 const scheduled=get('mo_scheduled_order_v1',null),pickup=get('menuOrbitPickup',{}),saved=get('mo_pickup_reminder_v1',{enabled:false,minutes:15,ready:true}),out=sheet('Pickup Reminder','Save a local reminder preference for scheduled or ready orders.');
 out.innerHTML='<div class="mo-saved-banner"><b>Pickup:</b> '+esc(pickup.store||get('mo_favorite_store_v1','Selected branch'))+(scheduled?'<br>'+esc(scheduled.date)+' at '+esc(scheduled.time):'<br>No scheduled pickup yet.')+'</div><div class="mo-form"><label class="mo-pref"><span><b>Enable pickup reminder</b><small>Remember this preference on this device.</small></span><input id="moPickupReminderEnabled" type="checkbox" '+(saved.enabled?'checked':'')+'></label><select id="moPickupReminderMinutes"><option value="10" '+(saved.minutes===10?'selected':'')+'>10 minutes before</option><option value="15" '+(saved.minutes===15?'selected':'')+'>15 minutes before</option><option value="30" '+(saved.minutes===30?'selected':'')+'>30 minutes before</option></select><label class="mo-pref"><span><b>Ready-for-pickup alert</b><small>Include order-ready status in the local notification center.</small></span><input id="moPickupReadyAlert" type="checkbox" '+(saved.ready?'checked':'')+'></label><button class="mo-primary" id="moSavePickupReminder">SAVE REMINDER</button></div><div id="moPickupReminderStatus"></div><p class="demo-banner">This prototype stores reminder preferences locally; it does not send background push notifications.</p>';
 const render=()=>{const x=get('mo_pickup_reminder_v1',null);$('#moPickupReminderStatus').innerHTML=x&&x.enabled?'<div class="mo-saved-banner">Reminder on • '+x.minutes+' minutes before pickup'+(x.ready?' • ready alerts on':'')+'</div>':''};render();
 $('#moSavePickupReminder').onclick=()=>{put('mo_pickup_reminder_v1',{enabled:$('#moPickupReminderEnabled').checked,minutes:Number($('#moPickupReminderMinutes').value),ready:$('#moPickupReadyAlert').checked});toast('Pickup reminder saved');render()};
}


function openSupportHistory(){
 const issues=get('mo_customer_issues_v1',[]),feedback=get('mo_order_feedback_v1',{}),notices=get('mo_support_history_v1',[]);
 const rows=[
   ...issues.map(x=>({kind:'Issue',title:x.type+' • '+x.orderCode,status:x.status,when:x.createdAt||'',detail:x.note||''})),
   ...Object.entries(feedback).map(([code,x])=>({kind:'Feedback',title:'Feedback • '+code,status:(x.rating||0)+'★',when:x.savedAt||'',detail:x.comment||''})),
   ...notices
 ].sort((a,b)=>String(b.when||'').localeCompare(String(a.when||'')));
 const out=sheet('Support History','View previous issue requests, feedback, and saved support activity.');
 out.innerHTML=rows.length?rows.map(x=>'<div class="mo-next-card" style="margin-bottom:10px"><h4>'+esc(x.title)+'</h4><small>'+esc(x.kind)+' • '+esc(x.status||'Saved')+(x.when?'<br>'+esc(x.when):'')+(x.detail?'<br>'+esc(x.detail):'')+'</small></div>').join(''):'<div class="empty">No support history yet.</div>';
}

function logAccountActivity(type,detail){
 const arr=get('mo_account_activity_v1',[]);
 arr.unshift({type,detail,at:new Date().toISOString()});
 put('mo_account_activity_v1',arr.slice(0,60));
}
function openAccountActivityLog(){
 const activity=get('mo_account_activity_v1',[]),orders=get('menuOrbitOrders',[]);
 const derived=orders.slice(0,10).map(o=>({type:'Order',detail:(o.code||'Order')+' • '+money(o.total||0),at:o.createdAt||''}));
 const rows=[...activity,...derived].sort((a,b)=>String(b.at||'').localeCompare(String(a.at||''))).slice(0,40);
 const out=sheet('Account Activity Log','Review recent customer-side changes saved in this browser.');
 out.innerHTML=rows.length?rows.map(x=>'<div class="mo-next-card" style="margin-bottom:10px"><h4>'+esc(x.type)+'</h4><small>'+esc(x.detail||'')+(x.at?'<br>'+esc(x.at):'')+'</small></div>').join(''):'<div class="empty">No account activity yet.</div>';
}

function applyLanguage(){
 const lang=get('mo_language_v1','English');
 document.documentElement.setAttribute('lang',lang==='Filipino'?'fil':'en');
}
function openLanguageSelector(){
 const current=get('mo_language_v1','English'),out=sheet('Language','Choose a preferred interface language for this prototype.');
 out.innerHTML='<div class="mo-form"><label class="mo-pref"><span><b>English</b><small>Default prototype language.</small></span><input type="radio" name="moLanguage" value="English" '+(current==='English'?'checked':'')+'></label><label class="mo-pref"><span><b>Filipino</b><small>Remember Filipino as your preferred language.</small></span><input type="radio" name="moLanguage" value="Filipino" '+(current==='Filipino'?'checked':'')+'></label><button class="mo-primary" id="moSaveLanguage">SAVE LANGUAGE</button></div><p class="demo-banner">This saves the language preference and document language setting. Existing feature copy remains primarily English in this prototype.</p>';
 $('#moSaveLanguage').onclick=()=>{const lang=out.querySelector('input[name="moLanguage"]:checked')?.value||'English';put('mo_language_v1',lang);applyLanguage();logAccountActivity('Language preference','Changed to '+lang);toast('Language preference saved')};
}

function updateConnectionBanner(){
 let b=$('#moConnectionBanner');
 if(!b){b=document.createElement('div');b.id='moConnectionBanner';b.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;padding:10px 14px;border-radius:14px;background:#5c271f;color:#fff;font:800 12px system-ui;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.3);display:none';document.body.appendChild(b)}
 if(navigator.onLine){b.style.display='none'}else{b.textContent='OFFLINE • Your cart and saved demo data remain on this device.';b.style.display='block'}
}
function openOfflineReconnect(){
 const out=sheet('Offline / Reconnect','See connection status and how Menu Orbit protects local demo data.');
 out.innerHTML='<div class="mo-statgrid"><div class="mo-stat"><b>'+(navigator.onLine?'ONLINE':'OFFLINE')+'</b><small>Connection</small></div><div class="mo-stat"><b>'+get('menuOrbitCart',[]).length+'</b><small>Cart items preserved</small></div><div class="mo-stat"><b>'+get('menuOrbitOrders',[]).length+'</b><small>Orders stored locally</small></div></div><div class="mo-saved-banner" style="margin-top:12px">'+(navigator.onLine?'Connection available. Menu Orbit can continue normally.':'Connection unavailable. Local cart, preferences, and saved data remain available in this browser.')+'</div><button class="mo-primary" style="width:100%;margin-top:12px" id="moRetryConnection">RECHECK CONNECTION</button><p class="demo-banner">This is a browser-side resilience demo; it does not provide true offline server ordering.</p>';
 $('#moRetryConnection').onclick=()=>{updateConnectionBanner();openOfflineReconnect()};
}

function openSavedPickupPreferences(){
 const current=get('mo_saved_pickup_preferences_v1',{method:'Counter pickup',window:'Any time',note:'',useFavoriteStore:true});
 const out=sheet('Saved Pickup Preferences','Remember the customer’s preferred pickup method, time window, and default notes.');
 out.innerHTML='<div class="mo-form"><select id="moSavedPickupMethod"><option '+(current.method==='Counter pickup'?'selected':'')+'>Counter pickup</option><option '+(current.method==='Curbside pickup'?'selected':'')+'>Curbside pickup</option><option '+(current.method==='Call on arrival'?'selected':'')+'>Call on arrival</option></select><select id="moSavedPickupWindow"><option '+(current.window==='Any time'?'selected':'')+'>Any time</option><option '+(current.window==='Morning'?'selected':'')+'>Morning</option><option '+(current.window==='Afternoon'?'selected':'')+'>Afternoon</option><option '+(current.window==='Evening'?'selected':'')+'>Evening</option></select><textarea id="moSavedPickupNote" placeholder="Default pickup note">'+esc(current.note||'')+'</textarea><label class="mo-pref"><span><b>Use Favorite Store by default</b><small>Apply your saved favorite store when planning pickup.</small></span><input id="moUseFavoriteStore" type="checkbox" '+(current.useFavoriteStore?'checked':'')+'></label><button class="mo-primary" id="moSavePickupPrefs">SAVE PICKUP PREFERENCES</button></div><div id="moSavedPickupStatus"></div>';
 const render=()=>{const x=get('mo_saved_pickup_preferences_v1',null);$('#moSavedPickupStatus').innerHTML=x?'<div class="mo-saved-banner"><b>'+esc(x.method)+'</b> • '+esc(x.window)+(x.note?'<br>'+esc(x.note):'')+'</div>':''};render();
 $('#moSavePickupPrefs').onclick=()=>{const x={method:$('#moSavedPickupMethod').value,window:$('#moSavedPickupWindow').value,note:$('#moSavedPickupNote').value.trim(),useFavoriteStore:$('#moUseFavoriteStore').checked};put('mo_saved_pickup_preferences_v1',x);if(x.useFavoriteStore){const fav=get('mo_favorite_store_v1','');if(fav){const p=get('menuOrbitPickup',{});p.store=fav;put('menuOrbitPickup',p)}}logAccountActivity('Pickup preferences',x.method+' • '+x.window);toast('Pickup preferences saved');render()};
}
function restoreCustomerFinalPrefs(){applyLanguage();updateConnectionBanner()}
window.addEventListener('online',()=>{updateConnectionBanner();toast('Connection restored')});
window.addEventListener('offline',updateConnectionBanner);

window.MenuOrbitCustomer={openOrderTracking,openReorder,openRecentlyViewed,openRecommended,openPresets,openModifyCancel,openStoreAvailability,openVoucherWallet,openRewardsHistory,openPostPickupFeedback,openFavoriteStore,openSmartSubstitutions,openFavoriteCollections,openRefundIssueStatus,openNotificationCenter,openQuickOrder,openPickupNotes,openReceiptSearch,openAccessibilityProfile,openPrivacyDataControls,openRecentlyOrdered,openSavedBasket,openOrderSpendInsights,openIngredientAvailability,openPickupReminder,openSupportHistory,openAccountActivityLog,openLanguageSelector,openOfflineReconnect,openSavedPickupPreferences};

function addTools(){
 const tools=$('.mo-commerce-tools');if(!tools)return;
 [['moSavedLater','♡ Saved Later',openSaved,'saved-for-later-v1'],['moBranchCompare','⇄ Compare Branches',openBranchCompare,'branch-comparison-v1'],['moReviewFilters','★ Review Filters',openReviews,'review-filters-v1'],['moNotifPrefs','⚙ Notifications',openPrefs,'notification-preferences-v1'],['moSearchHistory','⌕ Search History',openSearchHistory,'search-history-v2'],['moPayments','💳 Payments',openPayments,'saved-payments-v2'],['moPairings','🥐 Pairings',openPairings,'pairing-recommendations-v2'],['moShareCart','↗ Share Cart',openShareCart,'share-cart-v2'],['moProfileDash','👤 Profile',openProfileDashboard,'customer-profile-dashboard-v1'],['moSchedule','🗓 Schedule',openScheduledOrder,'scheduled-ordering-v1'],['moDiet','🥗 Diet Filters',openDietFilters,'allergen-diet-filters-v1'],['moDealReminders','⏰ Deal Reminders',openDealReminders,'deal-reminders-v1'],['moGiftOrder','🎁 Gift Order',openGiftOrder,'gift-order-v1'],['moGroupOrder','👥 Group Order',openGroupOrder,'group-order-v1'],['moLoyalty','🏆 Milestones',openLoyaltyMilestones,'loyalty-milestones-v1'],['moDynamicEta','⏱ Pickup ETA',openDynamicEta,'dynamic-pickup-eta-v1']].forEach(([id,label,fn,key])=>{
  if($('#'+id))return;const b=document.createElement('button');b.className='mo-tool';b.id=id;b.textContent=label;b.onclick=fn;tools.appendChild(b);window.NewFeatureHighlight?.register(b,key,'NEW');
 });
}
function refreshNewestHighlights(){
  // Visible NEW state is handled by the orbit nodes for the latest customer batch.
}
function init(){addTools();patchCart();hookSearchHistory();hookPresetButton();restoreAccessibilityProfile();restoreCustomerFinalPrefs();refreshNewestHighlights();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,1000));else setTimeout(init,1000);
})();