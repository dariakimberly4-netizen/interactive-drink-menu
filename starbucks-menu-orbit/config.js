window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Keep all original DOM nodes intact so Menu Orbit initialization can run.
   Only visually hide the removed customer controls. */
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
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 24;
      height: 72px;
      padding: 7px max(12px, env(safe-area-inset-right)) calc(7px + env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      background: rgba(2, 20, 14, .90);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid rgba(212,173,98,.42);
      box-shadow: 0 -10px 36px rgba(0,0,0,.30);
    }
    .customer-footer button {
      min-width: 0;
      border: 0;
      border-radius: 14px;
      background: transparent;
      color: #dce8e2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .01em;
      padding: 5px 3px;
    }
    .customer-footer button:active,
    .customer-footer button.active {
      background: rgba(255,255,255,.08);
      color: #f4efe6;
    }
    .customer-footer .footer-icon {
      font-size: 20px;
      line-height: 1;
    }
    .stage { bottom: 72px !important; }

    @media (min-width: 800px) {
      .customer-footer {
        left: 50%;
        right: auto;
        width: min(620px, calc(100% - 32px));
        transform: translateX(-50%);
        bottom: 14px;
        height: 68px;
        border: 1px solid rgba(212,173,98,.34);
        border-radius: 22px;
        padding: 7px 12px;
      }
      .stage { bottom: 92px !important; }
    }
  `;
  document.head.appendChild(style);

  const installFooter = () => {
    if (document.querySelector('.customer-footer')) return;

    const footer = document.createElement('nav');
    footer.className = 'customer-footer';
    footer.setAttribute('aria-label', 'Customer navigation');
    footer.innerHTML = `
      <button type="button" data-footer-action="menu" class="active" aria-label="Menu Orbit"><span class="footer-icon">◉</span><span>Menu Orbit</span></button>
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
