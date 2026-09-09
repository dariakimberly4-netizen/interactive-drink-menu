window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Menu Orbit gesture patch
   Adds one-finger horizontal swipe on touchscreens and click-drag on desktop.
   Keeps normal taps/clicks working and adds light inertial rotation. */
(() => {
  const DRAG_THRESHOLD = 8;
  const ANGLE_PER_PIXEL = 0.0085;
  const FRICTION = 0.93;
  const MIN_VELOCITY = 0.00008;

  let stage = null;
  let dragging = false;
  let activePointerId = null;
  let startX = 0;
  let lastX = 0;
  let lastTime = 0;
  let moved = false;
  let suppressNextClick = false;
  let velocity = 0;
  let rafId = 0;
  let gestureOffset = 0;
  let geometry = null;

  const products = () => [...document.querySelectorAll('#orbit .product')];

  function readGeometry(resetOffset = false) {
    if (!stage) return null;
    const items = products();
    if (!items.length) return null;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cx = w / 2;
    const cy = h * 0.48;

    const points = items.map((el) => ({
      el,
      x: parseFloat(el.style.left) || el.offsetLeft,
      y: parseFloat(el.style.top) || el.offsetTop
    }));

    let rx = Math.max(...points.map(p => Math.abs(p.x - cx)));
    let ry = Math.max(...points.map(p => Math.abs(p.y - cy)));
    if (!Number.isFinite(rx) || rx < 20) rx = Math.min(w * 0.39, 430);
    if (!Number.isFinite(ry) || ry < 20) ry = Math.min(h * 0.34, 235);

    const bases = points.map(p => ({
      el: p.el,
      angle: Math.atan2((p.y - cy) / ry, (p.x - cx) / rx)
    }));

    if (resetOffset) gestureOffset = 0;
    geometry = { w, h, cx, cy, rx, ry, bases };
    return geometry;
  }

  function applyRotation() {
    const g = geometry || readGeometry(false);
    if (!g) return;

    g.bases.forEach(({ el, angle }) => {
      if (!el.isConnected) return;
      const a = angle + gestureOffset;
      const x = g.cx + Math.cos(a) * g.rx;
      const y = g.cy + Math.sin(a) * g.ry;
      const depth = (Math.sin(a) + 1) / 2;
      const scale = 0.72 + depth * 0.38;

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `translate(-50%,-50%) scale(${scale})`;
      el.classList.toggle('back', depth < 0.44);
      el.classList.toggle('front', depth > 0.68);
    });
  }

  function stopMomentum() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function startMomentum() {
    stopMomentum();
    let previous = performance.now();

    const tick = (now) => {
      const dt = Math.min(34, now - previous);
      previous = now;
      gestureOffset += velocity * dt;
      applyRotation();
      velocity *= Math.pow(FRICTION, dt / 16.67);

      if (Math.abs(velocity) > MIN_VELOCITY) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    if (Math.abs(velocity) > MIN_VELOCITY) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('header,.toolbar,.control-dock,.drawer,.modal,.search-panel,.gesture-box')) return;

    stopMomentum();
    readGeometry(false);
    dragging = true;
    activePointerId = e.pointerId;
    startX = lastX = e.clientX;
    lastTime = performance.now();
    moved = false;
    velocity = 0;

    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-dragging');
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== activePointerId) return;

    const now = performance.now();
    const dx = e.clientX - lastX;
    const totalDx = e.clientX - startX;
    const dt = Math.max(1, now - lastTime);

    if (Math.abs(totalDx) >= DRAG_THRESHOLD) moved = true;
    if (!moved) return;

    e.preventDefault();
    const deltaAngle = dx * ANGLE_PER_PIXEL;
    gestureOffset += deltaAngle;
    velocity = deltaAngle / dt;
    applyRotation();

    lastX = e.clientX;
    lastTime = now;
  }

  function endPointer(e) {
    if (!dragging || e.pointerId !== activePointerId) return;

    dragging = false;
    activePointerId = null;
    stage.classList.remove('is-dragging');
    try { stage.releasePointerCapture?.(e.pointerId); } catch (_) {}

    if (moved) {
      suppressNextClick = true;
      setTimeout(() => { suppressNextClick = false; }, 450);
      startMomentum();
    }
  }

  function onClickCapture(e) {
    if (!suppressNextClick) return;
    if (!e.target.closest('#orbit .product')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    suppressNextClick = false;
  }

  function install() {
    stage = document.querySelector('#stage');
    const orbit = document.querySelector('#orbit');
    if (!stage || !orbit || stage.dataset.swipeInstalled === '1') return;

    stage.dataset.swipeInstalled = '1';
    stage.style.touchAction = 'none';
    stage.style.cursor = 'grab';

    const style = document.createElement('style');
    style.textContent = `
      #stage.is-dragging{cursor:grabbing!important;user-select:none;-webkit-user-select:none}
      #stage.is-dragging .product{pointer-events:none}
      @media (hover:none){#stage{cursor:default}}
    `;
    document.head.appendChild(style);

    stage.addEventListener('pointerdown', onPointerDown, { passive: true });
    stage.addEventListener('pointermove', onPointerMove, { passive: false });
    stage.addEventListener('pointerup', endPointer, { passive: true });
    stage.addEventListener('pointercancel', endPointer, { passive: true });
    stage.addEventListener('lostpointercapture', endPointer, { passive: true });
    document.addEventListener('click', onClickCapture, true);

    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => readGeometry(true));
    });
    observer.observe(orbit, { childList: true });

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => readGeometry(true));
    });

    requestAnimationFrame(() => readGeometry(true));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
