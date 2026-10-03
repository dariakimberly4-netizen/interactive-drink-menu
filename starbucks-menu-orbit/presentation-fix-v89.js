(()=>{
  if(window.__presentationRemovedV90)return;window.__presentationRemovedV90=true;
  const KEY='mo_browse_presentation_v55';

  const style=document.createElement('style');
  style.textContent=`
    #browsePresentationV55,#moPresentationBtn{display:none!important;visibility:hidden!important;pointer-events:none!important}
  `;
  document.head.appendChild(style);

  const removePresentation=()=>{
    document.body.classList.remove('browse-presentation-v55');
    try{localStorage.removeItem(KEY)}catch{}
    document.getElementById('browsePresentationV55')?.remove();
    document.getElementById('moPresentationBtn')?.remove();
    document.querySelectorAll('button').forEach(btn=>{
      const text=(btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(text==='presentation mode'||text==='▣ presentation mode'||text==='× exit presentation'||text==='exit presentation')btn.remove();
    });
  };

  const start=()=>{
    removePresentation();
    new MutationObserver(removePresentation).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();