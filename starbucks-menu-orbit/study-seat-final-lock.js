/* Final duplicate-booking guard for Study Seats.
   A completed reservation still owns its original date + time + seat slot.
   Cancelled and no-show reservations release the slot. */
(() => {
  const KEY='menuOrbitSeatBookings';
  const RELEASED=new Set(['CANCELLED','NO SHOW']);
  const normalizeSeat=raw=>{const s=String(raw||'').toUpperCase();if(s.includes('SEAT 01')||s.includes('WINDOW 01'))return'SEAT 01';if(s.includes('SEAT 02')||s.includes('WINDOW 02'))return'SEAT 02';if(s.includes('SEAT 03')||s.includes('LIBRARY 03'))return'SEAT 03';if(s.includes('SEAT 04')||s.includes('COMMUNITY 04'))return'SEAT 04';return String(raw||'')};
  const bookings=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const isLocked=(date,time,seat)=>bookings().some(b=>String(b.date||'')===date&&String(b.time||'')===time&&normalizeSeat(b.seat)===seat&&!RELEASED.has(String(b.status||'BOOKED').toUpperCase()));

  function enforce(){
    const form=document.querySelector('#studyUpgradeForm');
    if(!form)return;
    const date=form.querySelector('#studyDateUpgrade')?.value||'';
    const time=form.querySelector('#studyTimeUpgrade')?.value||'';
    form.querySelectorAll('[data-seat-id]').forEach(btn=>{
      const locked=isLocked(date,time,btn.dataset.seatId);
      if(locked){
        btn.disabled=true;
        btn.classList.add('booked');
        btn.classList.remove('selected');
        const status=btn.querySelector('.seat-status');
        if(status)status.textContent='DEMO BOOKED';
      }
    });
  }

  document.addEventListener('submit',e=>{
    if(e.target?.id!=='studyUpgradeForm')return;
    const form=e.target,date=form.querySelector('#studyDateUpgrade')?.value||'',time=form.querySelector('#studyTimeUpgrade')?.value||'',seat=form.querySelector('.seat-card.selected')?.dataset.seatId||'';
    if(seat&&isLocked(date,time,seat)){
      e.preventDefault();e.stopImmediatePropagation();
      const error=form.querySelector('#studyBookingError');
      if(error)error.innerHTML='<div class="study-error"><b>SEAT ALREADY BOOKED</b><br>Please choose another available study seat or time slot.</div>';
      enforce();
    }
  },true);

  const start=()=>{
    const root=document.querySelector('#hubContent')||document.body;
    new MutationObserver(()=>queueMicrotask(enforce)).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('change',e=>{if(e.target?.id==='studyDateUpgrade'||e.target?.id==='studyTimeUpgrade')queueMicrotask(enforce)});
    window.addEventListener('storage',e=>{if(e.key===KEY)queueMicrotask(enforce)});
    enforce();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
