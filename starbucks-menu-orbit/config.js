window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Keep all original DOM nodes intact so Menu Orbit initialization can run.
   Hide unwanted gesture/tilt/voice controls and add a floating customer dock. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #gestureBtn,
    [id*="gestureBtn"],
    .gesture-box,
    #gestureBox,
    .hand-cursor,
    #handCursor,
    .control-dock,
    .instructions {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .customer-footer {
      position: fixed;
      left: 50%;
      bottom: calc(14px + env(safe-area-inset-bottom));
      transform: translateX(-50%);
      z-index: 30;
      width: min(92vw, 560px);
      height: 66px;
      padding: 7px 10px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      background: rgba(4, 28, 20, .82);
      backdrop-filter: blur(22px) saturate(125%);
      -webkit-backdrop-filter: blur(22px) saturate(125%);
      border: 1px solid rgba(212,173,98,.34);
      border-radius: 999px;
      box-shadow: 0 14px 40px rgba(0,0,0,.40), inset 0 1px 0 rgba(255,255,255,.06);
    }

    .customer-footer::before {
      content: "";
      position: absolute;
      left: 14%;
      right: 14%;
      top: -1px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(244,200,111,.72), transparent);
      pointer-events: none;
    }

    .customer-footer button {
      position: relative;
      min-width: 0;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: #cbd9d2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      font-size: 10.5px;
      font-weight: 800;
      padding: 5px 3px;
      transition: transform .18s ease, background .18s ease, color .18s ease;
    }

    .customer-footer button:active {
      transform: translateY(-2px) scale(.98);
    }

    .customer-footer button.active {
      color: #fff8e9;
      background: rgba(255,255,255,.07);
    }

    .customer-footer button.active::after {
      content: "";
      position: absolute;
      bottom: 3px;
      width: 24px;
      height: 2px;
      border-radius: 99px;
      background: #d4ad62;
      box-shadow: 0 0 10px rgba(212,173,98,.55);
    }

    .customer-footer .footer-icon {
      font-size: 19px;
      line-height: 1;
    }

    .stage { bottom: 94px !important; }

    @media (max-width: 520px) {
      .customer-footer {
        width: calc(100% - 24px);
        height: 64px;
        bottom: calc(10px + env(safe-area-inset-bottom));
        padding: 6px 8px;
      }
      .customer-footer button { font-size: 10px; }
      .customer-footer .footer-icon { font-size: 18px; }
      .stage { bottom: 86px !important; }
    }
  `;
  document.head.appendChild(style);

  const installFooter = () => {
    document.querySelector('.customer-footer')?.remove();

    const footer = document.createElement('nav');
    footer.className = 'customer-footer';
    footer.setAttribute('aria-label', 'Customer navigation');
    footer.innerHTML = `
      <button type="button" data-footer-action="menu" class="active" aria-label="Menu Orbit"><span class="footer-icon">◉</span><span>Menu</span></button>
      <button type="button" data-footer-action="pickup" aria-label="Pickup"><span class="footer-icon">⌖</span><span>Pickup</span></button>
      <button type="button" data-footer-action="cart" aria-label="Cart"><span class="footer-icon">▣</span><span>Cart</span></button>
      <button type="button" data-footer-action="account" aria-label="My Account"><span class="footer-icon">◌</span><span>Account</span></button>
    `;

    footer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-footer-action]');
      if (!btn) return;
      footer.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));

      const action = btn.dataset.footerAction;
      if (action === 'menu') {
        document.querySelector('#detail')?.classList.remove('open');
        document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
        return;
      }
      if (action === 'pickup') document.querySelector('#pickupBtn')?.click();
      if (action === 'cart') document.querySelector('#cartBtn')?.click();
      if (action === 'account') document.querySelector('#customerAccountBtn')?.click();
    });

    document.body.appendChild(footer);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installFooter, { once: true });
  } else {
    installFooter();
  }
})();

/* Shared order → inventory automation. Live UUID orders are processed by Supabase;
   demo orders are mirrored into the browser inventory used by inventory.html. */
(() => {
  if (document.querySelector('script[data-menu-orbit-inventory-engine]')) return;
  const script=document.createElement('script');
  script.src='inventory-engine.js?v=20260911a';
  script.defer=true;
  script.dataset.menuOrbitInventoryEngine='true';
  document.head.appendChild(script);
})();

/* Premium motion layer inspired by Emil Kowalski's interaction principles.
   Motion only: no interface structure, catalog, commerce, or inventory behavior is redesigned. */
(() => {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOK = () => !reduceMQ.matches && !document.body.classList.contains('reduce-motion');
  let selectedId = null;
  let selectedOrigin = null;
  let focusClone = null;
  let openTimer = 0;

  const motionStyle = document.createElement('style');
  motionStyle.textContent = `
    :root {
      --orbit-motion-fast: 180ms;
      --orbit-motion-medium: 320ms;
      --orbit-motion-slow: 520ms;
      --orbit-ease-out: cubic-bezier(.16,1,.3,1);
      --orbit-ease-physical: cubic-bezier(.2,.82,.24,1);
      --orbit-ease-return: cubic-bezier(.32,.72,0,1);
    }

    .orbit,
    .orbit-line,
    .stage::before {
      transition: filter var(--orbit-motion-medium) var(--orbit-ease-out),
                  opacity var(--orbit-motion-medium) var(--orbit-ease-out);
    }

    body.product-focus .orbit-line,
    body.product-focus .stage::before {
      opacity: .34;
      filter: saturate(.76) brightness(.72);
    }

    body.product-focus .product:not(.motion-selected) {
      filter: brightness(.56) saturate(.68);
      opacity: .56;
    }

    .product {
      transition: transform var(--orbit-motion-fast) var(--orbit-ease-out),
                  filter var(--orbit-motion-medium) var(--orbit-ease-out),
                  opacity var(--orbit-motion-medium) var(--orbit-ease-out) !important;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
    }

    .product.motion-selected {
      z-index: 24 !important;
      filter: brightness(1.08) saturate(1.04) !important;
      opacity: 1 !important;
    }

    .motion-focus-clone,
    .motion-cart-clone {
      position: fixed;
      z-index: 110;
      pointer-events: none;
      border-radius: 50%;
      overflow: hidden;
      will-change: transform, opacity;
      contain: layout paint style;
      box-shadow: 0 22px 55px rgba(0,0,0,.46), 0 0 0 5px rgba(212,173,98,.16);
    }

    .motion-focus-clone img,
    .motion-cart-clone img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    #detail.motion-enter .drawer-head,
    #detail.motion-enter .detail-img,
    #detail.motion-enter .price-line,
    #detail.motion-enter .favorite-toggle,
    #detail.motion-enter .desc,
    #detail.motion-enter .facts,
    #detail.motion-enter .section-title,
    #detail.motion-enter .options,
    #detail.motion-enter #commerceProductInfo,
    #detail.motion-enter .add,
    #detail.motion-enter .notice {
      opacity: 0;
      transform: translateY(10px) scale(.99);
      animation: orbitLayerIn 360ms var(--orbit-ease-out) forwards;
    }

    #detail.motion-enter .drawer-head { animation-delay: 40ms; }
    #detail.motion-enter .detail-img { animation-delay: 70ms; }
    #detail.motion-enter .price-line,
    #detail.motion-enter .favorite-toggle { animation-delay: 105ms; }
    #detail.motion-enter .desc,
    #detail.motion-enter .facts { animation-delay: 135ms; }
    #detail.motion-enter .section-title,
    #detail.motion-enter .options { animation-delay: 165ms; }
    #detail.motion-enter #commerceProductInfo { animation-delay: 195ms; }
    #detail.motion-enter .add { animation-delay: 220ms; }
    #detail.motion-enter .notice { animation-delay: 245ms; }

    @keyframes orbitLayerIn {
      0% { opacity: 0; transform: translateY(10px) scale(.99); }
      72% { opacity: 1; transform: translateY(-1px) scale(1.002); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes cartPulse {
      0% { transform: scale(1); }
      42% { transform: scale(1.105) translateY(-1px); }
      68% { transform: scale(.985) translateY(0); }
      100% { transform: scale(1); }
    }

    .cart-pulse {
      animation: cartPulse 390ms cubic-bezier(.22,.9,.28,1) !important;
      transform-origin: 50% 55%;
    }

    @media (prefers-reduced-motion: reduce) {
      .orbit,
      .orbit-line,
      .stage::before,
      .product,
      .customer-footer button,
      .cart-pulse {
        transition: none !important;
        animation: none !important;
      }
      #detail.motion-enter * {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .motion-focus-clone,
      .motion-cart-clone { display: none !important; }
    }
  `;
  document.head.appendChild(motionStyle);

  function clearFocusClone(){
    focusClone?.remove();
    focusClone = null;
  }

  function setOrbitFocus(id, active=true){
    document.body.classList.toggle('product-focus', active);
    document.querySelectorAll('.product').forEach(el => {
      el.classList.toggle('motion-selected', active && el.dataset.id === id);
    });
  }

  function animateNeighbors(source){
    if (!motionOK() || !source) return;
    const products = [...document.querySelectorAll('.product')];
    const i = products.indexOf(source);
    [-2,-1,1,2].forEach(offset => {
      const el = products[(i + offset + products.length) % products.length];
      if (!el || el === source) return;
      const strength = Math.abs(offset) === 1 ? 10 : 5;
      const rect = el.getBoundingClientRect();
      const srect = source.getBoundingClientRect();
      const dx = rect.left + rect.width/2 - (srect.left + srect.width/2);
      const dy = rect.top + rect.height/2 - (srect.top + srect.height/2);
      const len = Math.max(1, Math.hypot(dx,dy));
      const tx = dx / len * strength;
      const ty = dy / len * strength;
      el.animate([
        { transform: getComputedStyle(el).transform },
        { transform: `${getComputedStyle(el).transform} translate(${tx}px,${ty}px)` },
        { transform: getComputedStyle(el).transform }
      ], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  }

  function makeCloneFromProduct(product){
    const photo = product?.querySelector('.photo');
    const img = photo?.querySelector('img');
    if (!photo || !img) return null;
    const r = photo.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.className = 'motion-focus-clone';
    clone.style.left = `${r.left}px`;
    clone.style.top = `${r.top}px`;
    clone.style.width = `${r.width}px`;
    clone.style.height = `${r.height}px`;
    clone.innerHTML = `<img src="${img.currentSrc || img.src}" alt="">`;
    document.body.appendChild(clone);
    return { clone, rect:r };
  }

  function animateProductToCenter(product){
    if (!motionOK() || !product) return;
    clearFocusClone();
    const made = makeCloneFromProduct(product);
    if (!made) return;
    focusClone = made.clone;
    const r = made.rect;
    const targetX = innerWidth * (innerWidth < 700 ? .50 : .57);
    const targetY = innerHeight * .46;
    const startX = r.left + r.width/2;
    const startY = r.top + r.height/2;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const curveX = dx * .52 + (dy > 0 ? -34 : 34);
    const curveY = dy * .42 - 38;
    const targetScale = Math.min(1.48, Math.max(1.18, 176 / Math.max(r.width,1)));

    product.animate([
      { transform: getComputedStyle(product).transform },
      { transform: `${getComputedStyle(product).transform} translateY(-7px) scale(1.025)` }
    ], { duration: 145, easing:'cubic-bezier(.16,1,.3,1)', fill:'both' });

    animateNeighbors(product);

    const a = focusClone.animate([
      { transform:'translate3d(0,0,0) scale(1)', opacity:1 },
      { transform:`translate3d(${curveX}px,${curveY}px,0) scale(${1 + (targetScale-1)*.48})`, opacity:1, offset:.48 },
      { transform:`translate3d(${dx}px,${dy}px,0) scale(${targetScale})`, opacity:.98 }
    ], { duration: 430, easing:'cubic-bezier(.2,.82,.24,1)', fill:'forwards' });
    a.onfinish = () => {
      if (focusClone) focusClone.style.opacity = '0';
    };
  }

  function staggerDetail(){
    const detail = document.querySelector('#detail');
    if (!detail?.classList.contains('open')) return;
    detail.classList.remove('motion-enter');
    void detail.offsetWidth;
    detail.classList.add('motion-enter');
    clearTimeout(openTimer);
    openTimer = setTimeout(() => detail.classList.remove('motion-enter'), 700);
  }

  function animateReturn(){
    const detail = document.querySelector('#detail');
    const product = selectedId && document.querySelector(`.product[data-id="${CSS.escape(selectedId)}"]`);
    const targetPhoto = product?.querySelector('.photo');
    const sourceImg = detail?.querySelector('.detail-img');
    if (!motionOK() || !product || !targetPhoto || !sourceImg) {
      setOrbitFocus(selectedId, false);
      selectedId = null;
      selectedOrigin = null;
      clearFocusClone();
      return;
    }

    const from = sourceImg.getBoundingClientRect();
    const to = targetPhoto.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.className = 'motion-focus-clone';
    clone.style.left = `${from.left}px`;
    clone.style.top = `${from.top}px`;
    clone.style.width = `${from.width}px`;
    clone.style.height = `${from.height}px`;
    clone.innerHTML = `<img src="${sourceImg.currentSrc || sourceImg.src}" alt="">`;
    document.body.appendChild(clone);

    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const sx = to.width / Math.max(from.width,1);
    const sy = to.height / Math.max(from.height,1);
    const curveX = dx * .5 - 28;
    const curveY = dy * .42 + 24;
    const anim = clone.animate([
      { transform:'translate3d(0,0,0) scale(1)', opacity:.95 },
      { transform:`translate3d(${curveX}px,${curveY}px,0) scale(${.72 + sx*.28})`, opacity:.92, offset:.50 },
      { transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`, opacity:0 }
    ], { duration:390, easing:'cubic-bezier(.32,.72,0,1)', fill:'forwards' });
    anim.onfinish = () => clone.remove();

    setOrbitFocus(selectedId, false);
    selectedId = null;
    selectedOrigin = null;
    clearFocusClone();
  }

  function curvedCartCompanion(originalFly){
    if (!motionOK() || !originalFly || originalFly.dataset.curveEnhanced) return;
    originalFly.dataset.curveEnhanced = 'true';
    const img = originalFly.querySelector('img');
    const cart = document.querySelector('#cartBtn');
    if (!img || !cart) return;

    originalFly.style.visibility = 'hidden';
    const from = originalFly.getBoundingClientRect();
    const to = cart.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.className = 'motion-cart-clone';
    clone.style.left = `${from.left}px`;
    clone.style.top = `${from.top}px`;
    clone.style.width = `${from.width}px`;
    clone.style.height = `${from.height}px`;
    clone.innerHTML = `<img src="${img.currentSrc || img.src}" alt="">`;
    document.body.appendChild(clone);

    const dx = to.left + to.width/2 - (from.left + from.width/2);
    const dy = to.top + to.height/2 - (from.top + from.height/2);
    const side = dx >= 0 ? 1 : -1;
    const anim = clone.animate([
      { transform:'translate3d(0,0,0) scale(1)', opacity:1 },
      { transform:`translate3d(${dx*.48 + 56*side}px,${dy*.30 - 62}px,0) scale(.86)`, opacity:1, offset:.42 },
      { transform:`translate3d(${dx*.82 + 24*side}px,${dy*.72 - 24}px,0) scale(.54)`, opacity:.86, offset:.76 },
      { transform:`translate3d(${dx}px,${dy}px,0) scale(.18)`, opacity:.16 }
    ], { duration:540, easing:'cubic-bezier(.2,.85,.25,1)', fill:'forwards' });
    anim.onfinish = () => clone.remove();
  }

  document.addEventListener('pointerdown', e => {
    const product = e.target.closest('.product');
    if (!product || !motionOK()) return;
    product.animate([
      { transform:getComputedStyle(product).transform },
      { transform:`${getComputedStyle(product).transform} scale(.975)` }
    ], { duration:90, direction:'alternate', iterations:2, easing:'ease-out' });
  }, { passive:true, capture:true });

  document.addEventListener('click', e => {
    const product = e.target.closest('.product');
    if (product) {
      selectedId = product.dataset.id;
      selectedOrigin = product.getBoundingClientRect();
      setOrbitFocus(selectedId, true);
      animateProductToCenter(product);
      requestAnimationFrame(() => requestAnimationFrame(staggerDetail));
      return;
    }

    if (e.target.closest('#detailClose')) {
      animateReturn();
      return;
    }

    if (e.target.closest('#addBtn')) {
      setTimeout(() => {
        setOrbitFocus(selectedId, false);
        selectedId = null;
        selectedOrigin = null;
        clearFocusClone();
      }, 40);
    }
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.querySelector('#detail.open')) animateReturn();
  }, true);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        const flies = node.matches('.cart-fly-item') ? [node] : [...node.querySelectorAll?.('.cart-fly-item') || []];
        flies.forEach(curvedCartCompanion);
      }
    }
    if (document.querySelector('#detail.open')) staggerDetail();
  });

  const start = () => observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
