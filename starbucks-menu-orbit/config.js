window.MENU_ORBIT_CONFIG = {
  supabaseUrl: "https://hknjlixpgznqqxxjffwi.supabase.co",
  supabasePublishableKey: "sb_publishable_6tKxtD2AR4oErplieVyrtQ_jjKytRrY",
  branches: []
};

/* Keep the Menu Orbit visible. Hide only the unwanted gesture/tilt/voice controls. */
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
      const text = (btn.textContent || '').replace(/\s+/g,' ').trim();
      if (/^(?:☝️?\s*)?Gestures$/i.test(text) || /^📱?\s*Use Phone Tilt$/i.test(text) || /^🎙️?\s*Voice Control$/i.test(text)) {
        btn.remove();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDisabledControls, { once: true });
  } else {
    removeDisabledControls();
  }

  new MutationObserver(removeDisabledControls).observe(document.documentElement, { childList: true, subtree: true });
})();
