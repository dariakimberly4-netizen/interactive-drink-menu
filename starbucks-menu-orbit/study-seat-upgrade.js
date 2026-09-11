/* Menu Orbit — Study Seat Booking Upgrade
   Additive customer-side enhancement. Existing orbit/rewards/inventory logic stays untouched. */
(() => {
  const STORAGE_KEY = 'menuOrbitSeatBookings';
  const TIME_SLOTS = [
    '8:00 AM – 10:00 AM',
    '10:30 AM – 12:30 PM',
    '1:00 PM – 3:00 PM',
    '3:30 PM – 5:30 PM'
  ];
  const SEATS = [
    { id: 'SEAT 01', name: 'Window Seat', note: 'Power outlet' },
    { id: 'SEAT 02', name: 'Window Seat', note: 'Power outlet' },
    { id: 'SEAT 03', name: 'Quiet Zone', note: 'Library Seat' },
    { id: 'SEAT 04', name: 'Community Table', note: 'Shared Seat' }
  ];
  const ACTIVE_STATUSES = new Set(['BOOKED', 'CHECKED IN']);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today = () => new Date().toISOString().slice(0,10);

  function normalizeSeat(raw) {
    const s = String(raw || '').toUpperCase();
    if (s.includes('SEAT 01') || s.includes('WINDOW 01')) return 'SEAT 01';
    if (s.includes('SEAT 02') || s.includes('WINDOW 02')) return 'SEAT 02';
    if (s.includes('SEAT 03') || s.includes('LIBRARY 03')) return 'SEAT 03';
    if (s.includes('SEAT 04') || s.includes('COMMUNITY 04')) return 'SEAT 04';
    return String(raw || 'SEAT 01');
  }

  function normalizeBooking(b = {}) {
    const code = b.code || ('SEAT-' + String(Date.now()).slice(-6));
    return {
      id: b.id || code,
      code,
      name: b.name || 'Guest',
      seat: normalizeSeat(b.seat),
      date: b.date || today(),
      time: b.time || TIME_SLOTS[0],
      hours: Number(b.hours || 2),
      status: String(b.status || 'BOOKED').toUpperCase(),
      createdAt: b.createdAt || new Date().toISOString(),
      checkedInAt: b.checkedInAt || null,
      completedAt: b.completedAt || null
    };
  }

  function getBookings() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(raw) ? raw.map(normalizeBooking) : [];
    } catch {
      return [];
    }
  }

  function saveBookings(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map(normalizeBooking)));
  }

  function isSeatBooked(date, time, seat) {
    return getBookings().some(b => b.date === date && b.time === time && normalizeSeat(b.seat) === seat && ACTIVE_STATUSES.has(b.status));
  }

  function getSeatAvailability(date, time) {
    const all = getBookings();
    return SEATS.map(seat => {
      const booking = all.find(b => b.date === date && b.time === time && normalizeSeat(b.seat) === seat.id && ACTIVE_STATUSES.has(b.status));
      return { ...seat, available: !booking, booking: booking || null };
    });
  }

  function createBooking(payload) {
    const seat = normalizeSeat(payload.seat);
    if (isSeatBooked(payload.date, payload.time, seat)) {
      return { ok: false, reason: 'BOOKED' };
    }
    const stamp = Date.now();
    const booking = normalizeBooking({
      id: 'seat-' + stamp + '-' + Math.random().toString(36).slice(2,6),
      code: 'SEAT-' + String(stamp).slice(-6),
      name: payload.name || 'Guest',
      seat,
      date: payload.date,
      time: payload.time,
      hours: 2,
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
      checkedInAt: null,
      completedAt: null
    });
    const all = getBookings();
    all.push(booking);
    saveBookings(all);
    return { ok: true, booking };
  }

  function updateBookingStatus(code, status) {
    const all = getBookings();
    const item = all.find(b => b.code === code);
    if (!item) return null;
    item.status = String(status || item.status).toUpperCase();
    if (item.status === 'CHECKED IN') item.checkedInAt = item.checkedInAt || new Date().toISOString();
    if (item.status === 'COMPLETED') item.completedAt = item.completedAt || new Date().toISOString();
    saveBookings(all);
    return item;
  }

  window.MenuOrbitStudySeats = { getBookings, saveBookings, isSeatBooked, createBooking, updateBookingStatus, getSeatAvailability, seats: SEATS, timeSlots: TIME_SLOTS };

  function addStyles() {
    if (document.querySelector('#studySeatUpgradeStyles')) return;
    const style = document.createElement('style');
    style.id = 'studySeatUpgradeStyles';
    style.textContent = `
      .study-upgrade .study-hero{padding:18px;border:1px solid rgba(244,200,111,.28);border-radius:20px;background:linear-gradient(135deg,rgba(0,117,74,.28),rgba(255,255,255,.045));margin-bottom:14px}
      .study-upgrade .study-badge{display:inline-block;padding:7px 10px;border-radius:999px;background:rgba(244,200,111,.14);border:1px solid rgba(244,200,111,.4);color:#ffe2a0;font-size:11px;font-weight:900;letter-spacing:.08em}
      .study-upgrade .study-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
      .study-upgrade .study-btn,.study-upgrade .seat-card{min-height:52px;border-radius:15px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-weight:900;padding:12px;cursor:pointer}
      .study-upgrade .study-btn.primary{border:0;background:linear-gradient(135deg,#00a862,#00754a)}
      .study-upgrade .study-btn.cream{background:#f4efe6;color:#073421}
      .study-upgrade .study-form{display:grid;gap:12px}
      .study-upgrade .study-form label{display:grid;gap:7px;color:#d7e4dd;font-size:12px;font-weight:800}
      .study-upgrade .study-form input,.study-upgrade .study-form select{width:100%;min-height:54px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#0d3628;color:#fff;padding:0 13px;font:inherit}
      .study-upgrade .seat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .study-upgrade .seat-card{text-align:left;min-height:118px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .16s ease,border-color .16s ease,background .16s ease}
      .study-upgrade .seat-card b{font-size:17px}.study-upgrade .seat-card small{display:block;color:#b8cbc1;margin-top:3px}
      .study-upgrade .seat-card .seat-status{display:inline-flex;align-self:flex-start;margin-top:12px;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:900;letter-spacing:.05em;background:rgba(0,168,98,.18);color:#aaf0cb;border:1px solid rgba(0,168,98,.35)}
      .study-upgrade .seat-card.selected{border-color:#f4c86f;background:rgba(244,200,111,.13);box-shadow:0 0 0 2px rgba(244,200,111,.12)}
      .study-upgrade .seat-card.booked{opacity:.55;cursor:not-allowed;background:rgba(255,255,255,.035)}
      .study-upgrade .seat-card.booked .seat-status{background:rgba(214,96,96,.15);color:#ffc3c3;border-color:rgba(214,96,96,.35)}
      .study-upgrade .study-error{padding:13px;border-radius:14px;background:rgba(214,96,96,.14);border:1px solid rgba(214,96,96,.36);color:#ffd0d0;font-weight:800}
      .study-upgrade .study-success{padding:18px;border-radius:20px;background:linear-gradient(135deg,rgba(0,168,98,.19),rgba(255,255,255,.045));border:1px solid rgba(0,168,98,.34);text-align:center}
      .study-upgrade .study-success h3{margin:8px 0 14px;font-size:24px}.study-upgrade .study-success dl{display:grid;grid-template-columns:1fr 1fr;text-align:left;gap:10px;margin:14px 0}.study-upgrade .study-success dl div{padding:11px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.045)}.study-upgrade .study-success dt{font-size:10px;color:#a9beb3;text-transform:uppercase;letter-spacing:.08em}.study-upgrade .study-success dd{margin:4px 0 0;font-weight:900}
      .study-upgrade .wifi-card{padding:18px;border-radius:20px;border:1px solid rgba(244,200,111,.45);background:linear-gradient(135deg,#0b4936,#08251b);text-align:center}.study-upgrade .wifi-pass{font-size:22px;font-weight:950;letter-spacing:.05em;color:#ffe2a0;word-break:break-word}
      .study-upgrade .study-note{font-size:11px;color:#a9beb3;line-height:1.5;margin-top:10px}
      @media(max-width:620px){.study-upgrade .study-actions,.study-upgrade .seat-grid,.study-upgrade .study-success dl{grid-template-columns:1fr}.study-upgrade .seat-card{min-height:104px}.study-upgrade .study-btn{min-height:56px;font-size:15px}}
      @media(prefers-reduced-motion:reduce){.study-upgrade *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function findCoffeeHubLauncher(out) {
    return [...document.querySelectorAll('button,a')].find(el => !out.contains(el) && /coffee\s*(shopping\s*)?hub/i.test(el.textContent || ''));
  }

  function closeStudy(out) {
    document.querySelector('#hubModal')?.classList.remove('open');
    const launcher = findCoffeeHubLauncher(out);
    if (launcher) setTimeout(() => launcher.click(), 0);
  }

  function installStudyUpgrade(out) {
    if (!out || out.dataset.studyUpgradeActive === '1') return;
    out.dataset.studyUpgradeActive = '1';
    out.classList.add('study-upgrade');
    let selectedSeat = '';
    let lastBooking = null;

    const head = (title, sub) => `<div class="drawer-head"><div><h2 id="hubTitle">${esc(title)}</h2><small style="color:#abc0b6">${esc(sub)}</small></div><button class="close" id="studyClose" aria-label="Close">×</button></div>`;
    const bindClose = () => { const b = out.querySelector('#studyClose'); if (b) b.onclick = () => document.querySelector('#hubModal')?.classList.remove('open'); };

    function renderLanding() {
      selectedSeat = '';
      const mine = getBookings().filter(b => b.date >= today() && !['CANCELLED','NO SHOW'].includes(b.status)).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
      out.innerHTML = head('Wi‑Fi & Study Seats','Bacoor café demo — device-local only') + `
        <section class="study-hero">
          <span class="study-badge">STUDY MODE • DEMO</span>
          <h3 style="margin:10px 0 6px">Work comfortably. Stay connected.</h3>
          <p style="margin:0;color:#c9d9d1">Get a demo Wi‑Fi guest pass or reserve one of four study seats.</p>
          <div class="study-actions">
            <button class="study-btn cream" id="wifiPassUpgrade">GET WI‑FI GUEST PASS</button>
            <button class="study-btn primary" id="chooseSeatUpgrade">CHOOSE A STUDY SEAT</button>
          </div>
        </section>
        ${mine.length ? `<div class="section-title">Your next saved demo booking</div><div class="study-success" style="text-align:left"><b>${esc(mine[0].seat)} • ${esc(mine[0].status)}</b><br><small>${esc(mine[0].date)} • ${esc(mine[0].time)}<br>${esc(mine[0].code)}</small><div class="study-actions"><button class="study-btn" id="viewMine">VIEW MY BOOKING</button><button class="study-btn" id="bookAnother">BOOK ANOTHER TIME</button></div></div>` : ''}
        <p class="study-note">Demo only. No real Starbucks Wi‑Fi access or seat reservation is created.</p>`;
      bindClose();
      out.querySelector('#wifiPassUpgrade').onclick = renderWifi;
      out.querySelector('#chooseSeatUpgrade').onclick = () => renderBookingForm();
      out.querySelector('#viewMine')?.addEventListener('click', () => renderConfirmation(mine[0], false));
      out.querySelector('#bookAnother')?.addEventListener('click', () => renderBookingForm());
    }

    function renderWifi() {
      const password = 'MO-' + Math.random().toString(36).slice(2,8).toUpperCase();
      out.innerHTML = head('Demo Wi‑Fi Access','Temporary guest pass — demo only') + `
        <div class="wifi-card">
          <span class="study-badge">DEMO WI‑FI ACCESS</span>
          <h3>MenuOrbit-Guest</h3>
          <p style="margin:5px 0;color:#b8cbc1">Temporary Password</p>
          <div class="wifi-pass" id="wifiPasswordText">${esc(password)}</div>
          <p><b>Validity:</b> 2 Hours</p>
          <div class="study-actions"><button class="study-btn cream" id="copyWifiPass">COPY PASSWORD</button><button class="study-btn primary" id="wifiDone">DONE</button></div>
        </div>
        <p class="study-note">This is a demonstration credential only and is not a real Starbucks network.</p>`;
      bindClose();
      out.querySelector('#copyWifiPass').onclick = async () => {
        try { await navigator.clipboard.writeText(password); out.querySelector('#copyWifiPass').textContent = 'COPIED ✓'; }
        catch { out.querySelector('#copyWifiPass').textContent = password; }
      };
      out.querySelector('#wifiDone').onclick = renderLanding;
    }

    function seatCards(date, time) {
      return getSeatAvailability(date, time).map(s => `
        <button type="button" class="seat-card ${s.available ? '' : 'booked'} ${selectedSeat === s.id ? 'selected' : ''}" data-seat-id="${s.id}" ${s.available ? '' : 'disabled'}>
          <span><b>${s.id}</b><small>${esc(s.name)}</small><small>${esc(s.note)}</small></span>
          <span class="seat-status">${s.available ? 'AVAILABLE' : 'DEMO BOOKED'}</span>
        </button>`).join('');
    }

    function renderBookingForm(prefill = {}) {
      selectedSeat = prefill.seat || '';
      const date = prefill.date || today();
      const time = prefill.time || TIME_SLOTS[0];
      out.innerHTML = head('Choose a Study Seat','Select date and time to see live demo availability') + `
        <form class="study-form" id="studyUpgradeForm">
          <label>Visit date<input id="studyDateUpgrade" type="date" min="${today()}" value="${esc(date)}" required></label>
          <label>Time slot<select id="studyTimeUpgrade">${TIME_SLOTS.map(t => `<option ${t===time?'selected':''}>${esc(t)}</option>`).join('')}</select></label>
          <div><div class="section-title" style="margin-top:4px">Choose one available seat</div><div class="seat-grid" id="studySeatGrid"></div></div>
          <label>Your first name<input id="studyNameUpgrade" maxlength="30" value="${esc(prefill.name || 'Kimmy')}" required></label>
          <div id="studyBookingError"></div>
          <button class="study-btn primary" type="submit">RESERVE DEMO SEAT</button>
          <button class="study-btn" type="button" id="studyBackLanding">BACK</button>
        </form>`;
      bindClose();
      const dateEl = out.querySelector('#studyDateUpgrade');
      const timeEl = out.querySelector('#studyTimeUpgrade');
      const grid = out.querySelector('#studySeatGrid');
      const error = out.querySelector('#studyBookingError');
      const refreshSeats = () => {
        if (selectedSeat && isSeatBooked(dateEl.value, timeEl.value, selectedSeat)) selectedSeat = '';
        grid.innerHTML = seatCards(dateEl.value, timeEl.value);
        grid.querySelectorAll('[data-seat-id]').forEach(btn => btn.onclick = () => {
          selectedSeat = btn.dataset.seatId;
          refreshSeats();
          error.innerHTML = '';
        });
      };
      dateEl.onchange = () => { selectedSeat = ''; refreshSeats(); };
      timeEl.onchange = () => { selectedSeat = ''; refreshSeats(); };
      refreshSeats();
      out.querySelector('#studyBackLanding').onclick = renderLanding;
      out.querySelector('#studyUpgradeForm').onsubmit = e => {
        e.preventDefault();
        if (!selectedSeat) {
          error.innerHTML = '<div class="study-error">Please choose an AVAILABLE study seat.</div>';
          return;
        }
        const result = createBooking({ name: out.querySelector('#studyNameUpgrade').value.trim() || 'Guest', seat: selectedSeat, date: dateEl.value, time: timeEl.value });
        if (!result.ok) {
          error.innerHTML = '<div class="study-error"><b>SEAT ALREADY BOOKED</b><br>Please choose another available study seat or time slot.</div>';
          selectedSeat = '';
          refreshSeats();
          return;
        }
        lastBooking = result.booking;
        renderConfirmation(result.booking, true);
      };
    }

    function renderConfirmation(b, newlyCreated = true) {
      if (!b) return renderLanding();
      out.innerHTML = head(newlyCreated ? 'Study Seat Reserved' : 'My Study Booking','Device-local demo booking') + `
        <div class="study-success">
          <span class="study-badge">${newlyCreated ? '✓ STUDY SEAT RESERVED' : esc(b.status)}</span>
          <h3>${esc(b.seat)}</h3>
          <dl>
            <div><dt>Seat</dt><dd>${esc(b.seat)}</dd></div>
            <div><dt>Status</dt><dd>${esc(b.status)}</dd></div>
            <div><dt>Date</dt><dd>${esc(b.date)}</dd></div>
            <div><dt>Time</dt><dd>${esc(b.time)}</dd></div>
            <div style="grid-column:1/-1"><dt>Booking Code</dt><dd>${esc(b.code)}</dd></div>
          </dl>
          <p><b>SHOW THIS CODE TO STAFF</b></p>
          <div class="study-actions">
            <button class="study-btn cream" id="studyViewBooking">VIEW MY BOOKING</button>
            <button class="study-btn" id="studyBookAnother">BOOK ANOTHER TIME</button>
          </div>
          <button class="study-btn primary" id="studyBackHub" style="width:100%;margin-top:10px">BACK TO COFFEE HUB</button>
        </div>
        <p class="study-note">Saved only on this device for demonstration. No real reservation is transmitted.</p>`;
      bindClose();
      out.querySelector('#studyViewBooking').onclick = () => renderConfirmation(b, false);
      out.querySelector('#studyBookAnother').onclick = () => renderBookingForm({ name: b.name, date: b.date, time: b.time });
      out.querySelector('#studyBackHub').onclick = () => closeStudy(out);
    }

    renderLanding();
  }

  function setup() {
    addStyles();
    const out = document.querySelector('#hubContent');
    if (!out) return;
    const watch = () => {
      const title = out.querySelector('#hubTitle')?.textContent || '';
      if (/Wi‑Fi\s*&\s*Study Seats/i.test(title)) {
        if (out.dataset.studyUpgradeActive !== '1') installStudyUpgrade(out);
      } else {
        out.dataset.studyUpgradeActive = '';
        out.classList.remove('study-upgrade');
      }
    };
    const observer = new MutationObserver(watch);
    observer.observe(out, { childList: true, subtree: true });
    watch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();
