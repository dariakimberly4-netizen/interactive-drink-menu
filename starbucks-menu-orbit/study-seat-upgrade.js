/* Menu Orbit — Demo-only Study Seat Experience
   LocalStorage only. Existing orbit/rewards/inventory/Supabase features remain untouched. */
(() => {
  const KEY = 'menuOrbitSeatBookings';
  const LAST_KEY = 'menuOrbitLastStudyBookingCode';
  const BRANCH = 'MENU ORBIT BACOOR DEMO CAFÉ';
  const TIME_SLOTS = ['8:00 AM – 10:00 AM','10:30 AM – 12:30 PM','1:00 PM – 3:00 PM','3:30 PM – 5:30 PM'];
  const SEATS = [
    {id:'SEAT 01',name:'Window Seat',note:'Power outlet'},
    {id:'SEAT 02',name:'Window Seat',note:'Power outlet'},
    {id:'SEAT 03',name:'Quiet Zone',note:'Library Seat'},
    {id:'SEAT 04',name:'Community Table',note:'Shared Seat'}
  ];
  const LOCKED = new Set(['BOOKED','CHECKED IN','COMPLETED']);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nowIso = () => new Date().toISOString();
  const today = () => new Date().toISOString().slice(0,10);

  function normalizeSeat(raw){
    const s=String(raw||'').toUpperCase();
    if(s.includes('SEAT 01')||s.includes('WINDOW 01'))return'SEAT 01';
    if(s.includes('SEAT 02')||s.includes('WINDOW 02'))return'SEAT 02';
    if(s.includes('SEAT 03')||s.includes('LIBRARY 03'))return'SEAT 03';
    if(s.includes('SEAT 04')||s.includes('COMMUNITY 04'))return'SEAT 04';
    return String(raw||'SEAT 01');
  }
  function normalizeHistory(history,createdAt,status){
    if(Array.isArray(history)&&history.length)return history.map(h=>({action:String(h.action||'UPDATE').toUpperCase(),time:h.time||createdAt||nowIso(),detail:h.detail||''}));
    return [{action:String(status||'BOOKED').toUpperCase(),time:createdAt||nowIso(),detail:''}];
  }
  function normalizeBooking(b={}){
    const code=b.code||('SEAT-'+String(Date.now()).slice(-6));
    const createdAt=b.createdAt||nowIso();
    const status=String(b.status||'BOOKED').toUpperCase();
    return {
      id:b.id||code, code, name:b.name||'Demo Guest', branch:b.branch||BRANCH,
      seat:normalizeSeat(b.seat), date:b.date||today(), time:b.time||TIME_SLOTS[0], hours:Number(b.hours||2), status,
      createdAt, checkedInAt:b.checkedInAt||null, completedAt:b.completedAt||null, cancelledAt:b.cancelledAt||null,
      history:normalizeHistory(b.history,createdAt,status)
    };
  }
  function getBookings(){
    try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(raw)?raw.map(normalizeBooking):[]}catch{return[]}
  }
  function saveBookings(list){localStorage.setItem(KEY,JSON.stringify(list.map(normalizeBooking)))}
  function addHistory(b,action,detail=''){b.history=Array.isArray(b.history)?b.history:[];b.history.push({action,time:nowIso(),detail})}
  function isSeatBooked(date,time,seat,excludeCode=''){
    return getBookings().some(b=>b.code!==excludeCode&&b.date===date&&b.time===time&&normalizeSeat(b.seat)===normalizeSeat(seat)&&LOCKED.has(b.status));
  }
  function getSeatAvailability(date,time,excludeCode=''){
    const all=getBookings();
    return SEATS.map(seat=>{
      const booking=all.find(b=>b.code!==excludeCode&&b.date===date&&b.time===time&&normalizeSeat(b.seat)===seat.id&&LOCKED.has(b.status));
      return {...seat,available:!booking,booking:booking||null};
    });
  }
  function createBooking(payload){
    const seat=normalizeSeat(payload.seat);
    if(isSeatBooked(payload.date,payload.time,seat))return{ok:false,reason:'BOOKED'};
    const stamp=Date.now(),createdAt=nowIso(),code='SEAT-'+String(stamp).slice(-6);
    const booking=normalizeBooking({
      id:'seat-'+stamp+'-'+Math.random().toString(36).slice(2,6),code,name:payload.name||'Demo Guest',branch:BRANCH,seat,
      date:payload.date,time:payload.time,hours:2,status:'BOOKED',createdAt,history:[{action:'BOOKED',time:createdAt,detail:`${seat} • ${payload.date} • ${payload.time}`}]
    });
    const all=getBookings();all.push(booking);saveBookings(all);localStorage.setItem(LAST_KEY,code);return{ok:true,booking};
  }
  function rescheduleBooking(code,payload){
    const seat=normalizeSeat(payload.seat);
    if(isSeatBooked(payload.date,payload.time,seat,code))return{ok:false,reason:'BOOKED'};
    const all=getBookings(),b=all.find(x=>x.code===code);if(!b)return{ok:false,reason:'NOT_FOUND'};
    const old=`${b.seat} • ${b.date} • ${b.time}`;
    b.seat=seat;b.date=payload.date;b.time=payload.time;b.status='BOOKED';b.checkedInAt=null;b.completedAt=null;b.cancelledAt=null;
    addHistory(b,'RESCHEDULED',`${old} → ${seat} • ${payload.date} • ${payload.time}`);
    saveBookings(all);localStorage.setItem(LAST_KEY,code);return{ok:true,booking:b};
  }
  function updateBookingStatus(code,status){
    const all=getBookings(),b=all.find(x=>x.code===code);if(!b)return null;
    status=String(status||b.status).toUpperCase();b.status=status;
    if(status==='CHECKED IN'){b.checkedInAt=b.checkedInAt||nowIso();addHistory(b,'CHECKED IN')}
    if(status==='COMPLETED'){b.completedAt=b.completedAt||nowIso();addHistory(b,'COMPLETED')}
    if(status==='CANCELLED'){b.cancelledAt=b.cancelledAt||nowIso();addHistory(b,'CANCELLED')}
    if(status==='NO SHOW')addHistory(b,'NO SHOW');
    saveBookings(all);return b;
  }
  function cancelBooking(code){return updateBookingStatus(code,'CANCELLED')}
  function getMyBooking(){
    const code=localStorage.getItem(LAST_KEY),all=getBookings();
    return (code&&all.find(b=>b.code===code))||all.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))[0]||null;
  }
  window.MenuOrbitStudySeats={getBookings,saveBookings,isSeatBooked,createBooking,rescheduleBooking,updateBookingStatus,cancelBooking,getSeatAvailability,getMyBooking,seats:SEATS,timeSlots:TIME_SLOTS,branch:BRANCH};

  function addStyles(){
    if(document.querySelector('#studySeatDemoStyles'))return;
    const style=document.createElement('style');style.id='studySeatDemoStyles';style.textContent=`
      .study-demo-root .study-hero,.study-demo-root .study-card{padding:18px;border:1px solid rgba(244,200,111,.28);border-radius:20px;background:linear-gradient(135deg,rgba(0,117,74,.24),rgba(255,255,255,.045));margin-bottom:14px}
      .study-demo-root .study-badge{display:inline-block;padding:7px 10px;border-radius:999px;background:rgba(244,200,111,.14);border:1px solid rgba(244,200,111,.4);color:#ffe2a0;font-size:11px;font-weight:900;letter-spacing:.07em}
      .study-demo-root .study-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
      .study-demo-root .study-btn,.study-demo-root .seat-card{min-height:52px;border-radius:15px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-weight:900;padding:12px;cursor:pointer}
      .study-demo-root .study-btn.primary{border:0;background:linear-gradient(135deg,#00a862,#00754a)}.study-demo-root .study-btn.cream{background:#f4efe6;color:#073421}.study-demo-root .study-btn.danger{border-color:rgba(214,96,96,.5);color:#ffc8c8}
      .study-demo-root .study-form{display:grid;gap:12px}.study-demo-root .study-form label{display:grid;gap:7px;color:#d7e4dd;font-size:12px;font-weight:800}.study-demo-root .study-form input,.study-demo-root .study-form select{width:100%;min-height:54px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#0d3628;color:#fff;padding:0 13px;font:inherit}
      .study-demo-root .seat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.study-demo-root .seat-card{text-align:left;min-height:118px;display:flex;flex-direction:column;justify-content:space-between}.study-demo-root .seat-card b{font-size:17px}.study-demo-root .seat-card small{display:block;color:#b8cbc1;margin-top:3px}.study-demo-root .seat-status{display:inline-flex;align-self:flex-start;margin-top:12px;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:900;background:rgba(0,168,98,.18);color:#aaf0cb}.study-demo-root .seat-card.selected{border-color:#f4c86f;background:rgba(244,200,111,.13)}.study-demo-root .seat-card.booked{opacity:.55;cursor:not-allowed}.study-demo-root .seat-card.booked .seat-status{background:rgba(214,96,96,.15);color:#ffc3c3}
      .study-demo-root .study-error{padding:13px;border-radius:14px;background:rgba(214,96,96,.14);border:1px solid rgba(214,96,96,.36);color:#ffd0d0;font-weight:800}.study-demo-root .study-success{padding:18px;border-radius:20px;background:linear-gradient(135deg,rgba(0,168,98,.19),rgba(255,255,255,.045));border:1px solid rgba(0,168,98,.34)}
      .study-demo-root .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:14px 0}.study-demo-root .detail-grid>div{padding:11px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.045)}.study-demo-root .detail-grid small{display:block;color:#a9beb3;font-size:10px;text-transform:uppercase}.study-demo-root .detail-grid b{display:block;margin-top:4px}
      .study-demo-root .wifi-card,.study-demo-root .pass-card{padding:18px;border-radius:20px;border:1px solid rgba(244,200,111,.45);background:linear-gradient(135deg,#0b4936,#08251b);text-align:center}.study-demo-root .wifi-pass{font-size:22px;font-weight:950;letter-spacing:.05em;color:#ffe2a0;word-break:break-word}.study-demo-root .qr-box{width:190px;height:190px;margin:14px auto;padding:10px;background:#fff;border-radius:18px;display:grid;place-items:center}.study-demo-root .qr-box img,.study-demo-root .qr-box canvas{max-width:100%;max-height:100%}.study-demo-root .pass-card.show-staff{transform:scale(1.02);box-shadow:0 0 0 3px rgba(244,200,111,.18),0 18px 45px rgba(0,0,0,.35)}
      .study-demo-root .timeline{margin:14px 0 0;padding:0;list-style:none}.study-demo-root .timeline li{padding:10px 0 10px 20px;border-left:2px solid rgba(244,200,111,.3);position:relative}.study-demo-root .timeline li:before{content:'';position:absolute;left:-6px;top:17px;width:10px;height:10px;border-radius:50%;background:#d4ad62}.study-demo-root .timeline small{display:block;color:#a9beb3;margin-top:3px}.study-demo-root .study-note{font-size:11px;color:#a9beb3;line-height:1.5;margin-top:10px}.study-demo-root .branch-line{margin:10px 0 0;color:#dce8e1;font-size:12px;font-weight:800}
      @media(max-width:620px){.study-demo-root .study-actions,.study-demo-root .seat-grid,.study-demo-root .detail-grid{grid-template-columns:1fr}.study-demo-root .study-btn{min-height:56px;font-size:15px}.study-demo-root .seat-card{min-height:104px}}
      @media(prefers-reduced-motion:reduce){.study-demo-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    `;document.head.appendChild(style);
  }
  function head(title,sub){return`<div class="drawer-head"><div><h2 id="hubTitle">${esc(title)}</h2><small style="color:#abc0b6">${esc(sub)}</small></div><button class="close" id="studyClose" aria-label="Close">×</button></div>`}
  function bindClose(out){out.querySelector('#studyClose')?.addEventListener('click',()=>document.querySelector('#hubModal')?.classList.remove('open'))}
  function fmt(iso){try{return new Date(iso).toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'})}catch{return iso||''}}
  function loadQrLibrary(cb){
    if(window.QRCode)return cb();
    let s=document.querySelector('script[data-study-qr]');
    if(s){s.addEventListener('load',cb,{once:true});return}
    s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';s.defer=true;s.dataset.studyQr='1';s.onload=cb;document.head.appendChild(s);
  }
  function drawQr(el,code){if(!el)return;el.innerHTML='';loadQrLibrary(()=>{if(!window.QRCode){el.textContent=code;return}new QRCode(el,{text:code,width:170,height:170,correctLevel:QRCode.CorrectLevel.M})})}

  function install(out){
    let selectedSeat='';
    out.classList.add('study-demo-root');
    const renderLanding=()=>{
      const mine=getMyBooking();
      out.innerHTML=head('Wi‑Fi & Study Seats','Demo location • device-local only')+`<div data-study-demo-root>
        <section class="study-hero"><span class="study-badge">DEMO LOCATION</span><h3 style="margin:10px 0 5px">${BRANCH}</h3><p style="margin:0;color:#c9d9d1">Get a demo Wi‑Fi pass or reserve one of four study seats.</p><div class="study-actions"><button class="study-btn cream" id="wifiBtn">GET WI‑FI GUEST PASS</button><button class="study-btn primary" id="reserveBtn">CHOOSE A STUDY SEAT</button></div></section>
        ${mine?`<section class="study-card"><span class="study-badge">MY STUDY BOOKING</span><div class="detail-grid"><div><small>Seat</small><b>${esc(mine.seat)}</b></div><div><small>Status</small><b>${esc(mine.status)}</b></div><div><small>Date</small><b>${esc(mine.date)}</b></div><div><small>Time</small><b>${esc(mine.time)}</b></div><div><small>Booking Code</small><b>${esc(mine.code)}</b></div><div><small>Branch</small><b>DEMO LOCATION</b></div></div><div class="study-actions"><button class="study-btn" id="viewMine">VIEW BOOKING</button><button class="study-btn" id="rescheduleMine" ${mine.status==='BOOKED'?'':'disabled'}>RESCHEDULE</button><button class="study-btn danger" id="cancelMine" ${mine.status==='BOOKED'?'':'disabled'}>CANCEL BOOKING</button></div></section>`:''}
        <p class="study-note">Portfolio demo only. No real Starbucks reservation, Wi‑Fi access, payment, or identity verification is created.</p></div>`;
      bindClose(out);out.querySelector('#wifiBtn').onclick=renderWifi;out.querySelector('#reserveBtn').onclick=()=>renderForm();
      out.querySelector('#viewMine')?.addEventListener('click',()=>renderBooking(mine));
      out.querySelector('#rescheduleMine')?.addEventListener('click',()=>renderForm(mine,true));
      out.querySelector('#cancelMine')?.addEventListener('click',()=>renderCancel(mine));
    };
    const renderWifi=()=>{
      const password='MO-'+Math.random().toString(36).slice(2,8).toUpperCase();
      out.innerHTML=head('Demo Wi‑Fi Access','Not a real Starbucks network')+`<div data-study-demo-root><div class="wifi-card"><span class="study-badge">DEMO WI‑FI ACCESS</span><h3>MenuOrbit-Guest</h3><p style="margin:5px 0;color:#b8cbc1">Temporary Password</p><div class="wifi-pass">${esc(password)}</div><p><b>Validity:</b> 2 Hours</p><div class="study-actions"><button class="study-btn cream" id="copyWifi">COPY PASSWORD</button><button class="study-btn primary" id="wifiDone">DONE</button></div></div><p class="study-note">This demo credential does not connect to a real network.</p></div>`;
      bindClose(out);out.querySelector('#copyWifi').onclick=async()=>{try{await navigator.clipboard.writeText(password);out.querySelector('#copyWifi').textContent='COPIED ✓'}catch{out.querySelector('#copyWifi').textContent=password}};out.querySelector('#wifiDone').onclick=renderLanding;
    };
    function cards(date,time,excludeCode=''){
      return getSeatAvailability(date,time,excludeCode).map(s=>`<button type="button" class="seat-card ${s.available?'':'booked'} ${selectedSeat===s.id?'selected':''}" data-seat="${s.id}" ${s.available?'':'disabled'}><span><b>${s.id}</b><small>${esc(s.name)}</small><small>${esc(s.note)}</small></span><span class="seat-status">${s.available?'AVAILABLE':'DEMO BOOKED'}</span></button>`).join('');
    }
    function renderForm(existing=null,isReschedule=false){
      selectedSeat=existing?.seat||'';const date=existing?.date||today(),time=existing?.time||TIME_SLOTS[0];
      out.innerHTML=head(isReschedule?'Reschedule Study Seat':'Choose a Study Seat','Select date and time to see demo availability')+`<div data-study-demo-root><form class="study-form" id="studyForm"><div class="branch-line"><span class="study-badge">DEMO LOCATION</span> ${BRANCH}</div><label>Visit date<input id="studyDate" type="date" min="${today()}" value="${esc(date)}" required></label><label>Time slot<select id="studyTime">${TIME_SLOTS.map(t=>`<option ${t===time?'selected':''}>${esc(t)}</option>`).join('')}</select></label><div><div class="section-title">Choose a seat</div><div class="seat-grid" id="seatGrid">${cards(date,time,existing?.code||'')}</div></div><label>First name<input id="studyName" maxlength="30" value="${esc(existing?.name||'Kimmy')}" required></label><div id="studyError"></div><button class="study-btn primary" type="submit">${isReschedule?'SAVE NEW STUDY SEAT':'RESERVE DEMO SEAT'}</button><button class="study-btn" type="button" id="backStudy">BACK</button></form></div>`;
      bindClose(out);const refresh=()=>{const d=out.querySelector('#studyDate').value,t=out.querySelector('#studyTime').value;if(selectedSeat&&isSeatBooked(d,t,selectedSeat,existing?.code||''))selectedSeat='';out.querySelector('#seatGrid').innerHTML=cards(d,t,existing?.code||'');out.querySelectorAll('[data-seat]').forEach(btn=>btn.onclick=()=>{selectedSeat=btn.dataset.seat;refresh()})};out.querySelectorAll('[data-seat]').forEach(btn=>btn.onclick=()=>{selectedSeat=btn.dataset.seat;refresh()});out.querySelector('#studyDate').onchange=refresh;out.querySelector('#studyTime').onchange=refresh;out.querySelector('#backStudy').onclick=renderLanding;
      out.querySelector('#studyForm').onsubmit=e=>{e.preventDefault();const d=out.querySelector('#studyDate').value,t=out.querySelector('#studyTime').value,n=out.querySelector('#studyName').value.trim()||'Demo Guest';if(!selectedSeat){out.querySelector('#studyError').innerHTML='<div class="study-error">Please choose an AVAILABLE seat.</div>';return}const result=isReschedule?rescheduleBooking(existing.code,{name:n,seat:selectedSeat,date:d,time:t}):createBooking({name:n,seat:selectedSeat,date:d,time:t});if(!result.ok){out.querySelector('#studyError').innerHTML='<div class="study-error"><b>SEAT ALREADY BOOKED</b><br>Please choose another available study seat or time slot.</div>';refresh();return}renderBooking(result.booking,isReschedule)};
    }
    function timeline(b){return`<ul class="timeline">${(b.history||[]).slice().reverse().map(h=>`<li><b>${esc(h.action)}</b>${h.detail?`<div>${esc(h.detail)}</div>`:''}<small>${esc(fmt(h.time))}</small></li>`).join('')}</ul>`}
    function renderBooking(b,updated=false){
      b=normalizeBooking(b);out.innerHTML=head(updated?'Booking Updated':'Study Seat Pass','Demo booking details')+`<div data-study-demo-root><div class="study-success"><span class="study-badge">${updated?'✓ BOOKING UPDATED':'STUDY SEAT PASS'}</span><h3 style="text-align:center">${esc(b.code)}</h3><div class="detail-grid"><div><small>Customer</small><b>${esc(b.name)}</b></div><div><small>Status</small><b>${esc(b.status)}</b></div><div><small>Seat</small><b>${esc(b.seat)}</b></div><div><small>Date</small><b>${esc(b.date)}</b></div><div><small>Time</small><b>${esc(b.time)}</b></div><div><small>Location</small><b>DEMO LOCATION</b></div></div></div><div class="pass-card" id="passCard" style="margin-top:14px"><span class="study-badge">DEMO QR — NOT A REAL PAYMENT OR ID</span><div class="qr-box" id="studyQr"></div><b>${esc(b.code)}</b><p style="margin:6px 0 0;color:#b8cbc1">QR contains booking code only.</p><button class="study-btn cream" id="showStaff" style="width:100%;margin-top:12px">SHOW TO STAFF</button></div><div class="study-card" style="margin-top:14px"><b>BOOKING TIMELINE</b>${timeline(b)}</div><div class="study-actions"><button class="study-btn" id="backBooking">BACK TO STUDY HUB</button>${b.status==='BOOKED'?`<button class="study-btn" id="rescheduleBooking">RESCHEDULE</button><button class="study-btn danger" id="cancelBooking">CANCEL BOOKING</button>`:''}</div></div>`;
      bindClose(out);drawQr(out.querySelector('#studyQr'),b.code);out.querySelector('#showStaff').onclick=()=>{out.querySelector('#passCard').classList.toggle('show-staff');out.querySelector('#showStaff').textContent='READY TO SHOW ✓'};out.querySelector('#backBooking').onclick=renderLanding;out.querySelector('#rescheduleBooking')?.addEventListener('click',()=>renderForm(b,true));out.querySelector('#cancelBooking')?.addEventListener('click',()=>renderCancel(b));
    }
    function renderCancel(b){
      out.innerHTML=head('Cancel Study Seat','Demo cancellation')+`<div data-study-demo-root><div class="study-card" style="text-align:center"><span class="study-badge">CANCEL THIS STUDY SEAT?</span><h3>${esc(b.code)}</h3><p>${esc(b.seat)} • ${esc(b.date)} • ${esc(b.time)}</p><div class="study-actions"><button class="study-btn" id="keepBooking">KEEP BOOKING</button><button class="study-btn danger" id="confirmCancel">CANCEL BOOKING</button></div></div></div>`;bindClose(out);out.querySelector('#keepBooking').onclick=()=>renderBooking(b);out.querySelector('#confirmCancel').onclick=()=>{const updated=cancelBooking(b.code);out.innerHTML=head('Booking Cancelled','The demo seat is available again')+`<div data-study-demo-root><div class="study-success" style="text-align:center"><span class="study-badge">BOOKING CANCELLED</span><h3>${esc(updated.code)}</h3><p>${esc(updated.seat)} has been released for this demo time slot.</p><button class="study-btn primary" id="cancelDone">BACK TO STUDY HUB</button></div></div>`;bindClose(out);out.querySelector('#cancelDone').onclick=renderLanding};
    }
    renderLanding();
  }

  function start(){
    addStyles();const root=document.querySelector('#hubContent');if(!root)return;
    const check=()=>{const title=root.querySelector('#hubTitle')?.textContent||'';if(/Wi.?Fi\s*&\s*Study\s*Seats/i.test(title)&&!root.querySelector('[data-study-demo-root]'))install(root)};
    new MutationObserver(()=>queueMicrotask(check)).observe(root,{childList:true,subtree:true});check();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
