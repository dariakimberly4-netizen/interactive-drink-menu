(()=>{
  const removePresentation=()=>{
    document.body?.classList.remove('browse-presentation-v55');
    try{localStorage.removeItem('mo_browse_presentation_v55')}catch{}
    document.getElementById('browsePresentationV55')?.remove();
    document.getElementById('moPresentationBtn')?.remove();
    document.querySelectorAll('button').forEach(btn=>{
      const t=(btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(t==='presentation mode'||t==='▣ presentation mode'||t==='× exit presentation')btn.remove();
    });
  };
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('button');
    if(!btn)return;
    const t=(btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(t.includes('presentation mode')||t.includes('exit presentation')){
      e.preventDefault();
      e.stopImmediatePropagation();
      removePresentation();
    }
  },true);
  const start=()=>{
    removePresentation();
    new MutationObserver(removePresentation).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();