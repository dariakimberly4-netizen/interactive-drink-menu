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
