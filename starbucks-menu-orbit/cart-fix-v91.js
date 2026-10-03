(()=>{
  if(window.__cartFixV91)return;window.__cartFixV91=true;

  const style=document.createElement('style');
  style.textContent=`
    #mainMenuDirect #mainSubmenuDirect>button[aria-label="Cart"],
    #mainMenuDirect #mainSubmenuDirect>button[data-cart-fix-v91="1"]{
      pointer-events:auto!important;
      touch-action:manipulation!important;
      z-index:80!important;
      cursor:pointer!important;
    }
  `;
  document.head.appendChild(style);

  let lastOpen=0;
  const openCart=()=>{
    const now=Date.now();
    if(now-lastOpen<450)return;
    lastOpen=now;

    const cartBtn=document.getElementById('cartBtn');
    if(cartBtn){
      try{
        if(typeof cartBtn.onclick==='function'){
          cartBtn.onclick.call(cartBtn,new MouseEvent('click',{bubbles:false,cancelable:true}));
        }else{
          cartBtn.click();
        }
      }catch{
        try{cartBtn.click()}catch{}
      }
    }

    setTimeout(()=>{
      const modal=document.getElementById('cartModal');
      if(modal&&!modal.classList.contains('open')){
        try{cartBtn?.click()}catch{}
      }
    },80);
  };

  const markCart=()=>{
    document.querySelectorAll('#mainSubmenuDirect>button').forEach(btn=>{
      const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(label==='cart'){
        btn.dataset.cartFixV91='1';
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('z-index','80','important');
      }
    });
  };

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#mainSubmenuDirect>button');
    if(!btn)return;
    const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(label!=='cart')return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openCart();
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const btn=e.target.closest?.('#mainSubmenuDirect>button');
    if(!btn)return;
    const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(label!=='cart')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openCart();
  },true);

  const start=()=>{
    markCart();
    new MutationObserver(markCart).observe(document.getElementById('mainSubmenuDirect')||document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();