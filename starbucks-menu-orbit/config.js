window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Gestures are intentionally disabled and hidden in the customer system. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #gestureBtn,
    [id*="gestureBtn"],
    .gesture-box,
    #gestureBox,
    .hand-cursor,
    #handCursor {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  const removeGestureControls = () => {
    document.querySelectorAll('#gestureBtn,[id*="gestureBtn"],.gesture-box,#gestureBox,.hand-cursor,#handCursor').forEach(el => el.remove());
    document.querySelectorAll('button').forEach(btn => {
      if (/^\s*(?:☝️?\s*)?gestures?\s*$/i.test(btn.textContent || '')) btn.remove();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeGestureControls, { once: true });
  } else {
    removeGestureControls();
  }

  new MutationObserver(removeGestureControls).observe(document.documentElement, { childList: true, subtree: true });
})();
