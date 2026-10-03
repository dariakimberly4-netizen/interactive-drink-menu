(()=>{
  if(window.__presentationFixV89)return;window.__presentationFixV89=true;
  const KEY='mo_browse_presentation_v55';
  const applyFallback=(force)=>{
    const on=force==null?!document.body.classList.contains('browse-presentation-v55'):!!force;
    document.body.classList.toggle('browse-presentation-v55',on);
    try{localStorage.setItem(KEY,on?'1':'0')}catch{}
    const btn=document.getElementById('browsePresentationV55');
    if(btn)btn.textContent=on?'× Exit Presentation':'▣ Presentation Mode';
    if(on){try{window.scrollTo({top:0,behavior:'smooth'})}catch{}}
  };
  const useRealButton=()=>{
    const real=document.getElementById('browsePresentationV55');
    const before=document.body.classList.contains('browse-presentation-v55');
    if(real){
      real.click();
      setTimeout(()=>{
        const after=document.body.classList.contains('browse-presentation-v55');
        if(after===before)applyFallback(!before);
      },80);
    }else applyFallback(!before);
  };
  const openFromSettings=()=>{
    const run=()=>setTimeout(useRealButton,120);
    if(!document.body.classList.contains('show-product-results')){
      try{location.hash='/Browse';window.dispatchEvent(new HashChangeEvent('hashchange'))}catch{}
      run();
    }else run();
  };
  const installAlias=()=>{
    if(document.getElementById('moPresentationBtn'))return;
    const b=document.createElement('button');
    b.id='moPresentationBtn';b.type='button';b.hidden=true;b.tabIndex=-1;b.setAttribute('aria-hidden','true');
    b.addEventListener('click',openFromSettings);
    document.body.appendChild(b);
  };
  const style=document.createElement('style');
  style.textContent='#browsePresentationV55{pointer-events:auto!important;position:relative!important;z-index:2147483600!important;touch-action:manipulation!important}';
  document.head.appendChild(style);
  const start=()=>{installAlias();new MutationObserver(installAlias).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();