window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Camera gestures, phone tilt, voice control, and swipe messaging are intentionally disabled and hidden in the customer system. */
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
  `;
  document.head.appendChild(style);

  const removeDisabledControls = () => {
    document.querySelectorAll('#gestureBtn,[id*="gestureBtn"],.gesture-box,#gestureBox,.hand-cursor,#handCursor,.control-dock,.instructions').forEach(el => el.remove());

    document.querySelectorAll('button').forEach(btn => {
      const text = (btn.textContent || '').trim();
      if (/gestures?/i.test(text) || /use phone tilt/i.test(text) || /voice control/i.test(text)) btn.remove();
    });

    document.querySelectorAll('div,p,span,small').forEach(el => {
      const text = (el.textContent || '').trim();
      if (/use tilt or voice without the camera/i.test(text) || /swipe remains available/i.test(text)) el.remove();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDisabledControls, { once: true });
  } else {
    removeDisabledControls();
  }

  new MutationObserver(removeDisabledControls).observe(document.documentElement, { childList: true, subtree: true });
})();
