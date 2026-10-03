(()=>{
  if(window.__cartFixV93)return;window.__cartFixV93=true;

  const style=document.createElement('style');
  style.textContent=`
    #mainMenuDirect #mainSubmenuDirect>button[aria-label="Cart"],
    #mainMenuDirect #mainSubmenuDirect>button[data-cart-fix-v93="1"]{
      pointer-events:auto!important;
      touch-action:manipulation!important;
      position:absolute!important;
      z-index:2147483000!important;
      cursor:pointer!important;
    }
    #cartModal{
      position:fixed!important;
      inset:0!important;
      z-index:2147483640!important;
      pointer-events:auto!important;
    }
    #cartModal.open{display:flex!important;visibility:visible!important;opacity:1!important}
    #cartModal .modal-card{position:relative!important;z-index:1!important;pointer-events:auto!important}
    #cartModal #cartClose{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2147483641!important}
  `;
  document.head.appendChild(style);

  let lastOpen=0;

  const clearForcedOpenStyles=modal=>{
    if(!modal)return;
    ['display','visibility','opacity','z-index'].forEach(p=>modal.style.removeProperty(p));
  };

  const closeCart=()=>{
    const modal=document.getElementById('cartModal');
    if(!modal)return;
    modal.classList.remove('open');
    clearForcedOpenStyles(modal);
    modal.setAttribute('aria-hidden','true');
  };

  const openCart=()=>{
    const now=Date.now();
    if(now-lastOpen<350)return;
    lastOpen=now;

    try{
      if(window.MenuOrbitApp&&typeof window.MenuOrbitApp.openCart==='function'){
        window.MenuOrbitApp.openCart();
      }else{
        const cartBtn=document.getElementById('cartBtn');
        if(cartBtn&&typeof cartBtn.onclick==='function')cartBtn.onclick.call(cartBtn,new MouseEvent('click',{bubbles:false,cancelable:true}));
        else cartBtn?.click();
      }
    }catch(e){
      try{document.getElementById('cartBtn')?.click()}catch(_){}
    }

    requestAnimationFrame(()=>setTimeout(()=>{
      const modal=document.getElementById('cartModal');
      if(modal){
        modal.classList.add('open');
        modal.removeAttribute('aria-hidden');
        modal.style.setProperty('display','flex','important');
        modal.style.setProperty('visibility','visible','important');
        modal.style.setProperty('opacity','1','important');
        modal.style.setProperty('z-index','2147483640','important');
      }
    },30));
  };

  const isCartNode=el=>{
    const btn=el?.closest?.('#mainSubmenuDirect>button');
    if(!btn)return null;
    const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    return label==='cart'?btn:null;
  };

  const markCart=()=>{
    document.querySelectorAll('#mainSubmenuDirect>button').forEach(btn=>{
      const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(label==='cart'){
        btn.dataset.cartFixV93='1';
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('z-index','2147483000','important');
      }
    });
  };

  const interceptCart=e=>{
    const btn=isCartNode(e.target);
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openCart();
  };

  document.addEventListener('pointerup',interceptCart,true);
  document.addEventListener('click',interceptCart,true);
  document.addEventListener('touchend',interceptCart,{capture:true,passive:false});

  const interceptClose=e=>{
    const close=e.target.closest?.('#cartClose');
    const backdrop=e.target?.id==='cartModal';
    if(!close&&!backdrop)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    closeCart();
  };
  document.addEventListener('pointerup',interceptClose,true);
  document.addEventListener('click',interceptClose,true);
  document.addEventListener('touchend',interceptClose,{capture:true,passive:false});

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.getElementById('cartModal')?.classList.contains('open')){
      e.preventDefault();e.stopImmediatePropagation();closeCart();return;
    }
    if(e.key!=='Enter'&&e.key!==' ')return;
    if(!isCartNode(e.target))return;
    e.preventDefault();e.stopImmediatePropagation();openCart();
  },true);

  const start=()=>{
    markCart();
    new MutationObserver(markCart).observe(document.getElementById('mainSubmenuDirect')||document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();