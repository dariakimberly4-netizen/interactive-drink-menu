(()=>{
  if(window.__cartFixV94)return;window.__cartFixV94=true;

  const style=document.createElement('style');
  style.textContent=`
    #mainMenuDirect #mainSubmenuDirect>button[aria-label="Cart"],
    #mainMenuDirect #mainSubmenuDirect>button[data-cart-fix-v94="1"]{
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
    }
    #cartModal.open{
      display:flex!important;
      visibility:visible!important;
      opacity:1!important;
      pointer-events:auto!important;
    }
    #cartModal .modal-card{
      position:relative!important;
      z-index:2147483641!important;
      pointer-events:auto!important;
    }
    #cartModal #cartClose{
      pointer-events:auto!important;
      touch-action:manipulation!important;
      position:relative!important;
      z-index:2147483642!important;
    }
  `;
  document.head.appendChild(style);

  const getCartNode=()=>[...document.querySelectorAll('#mainSubmenuDirect>button')].find(btn=>{
    const label=(btn.getAttribute('aria-label')||btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    return label==='cart';
  })||null;

  const markCart=()=>{
    const btn=getCartNode();
    if(!btn)return;
    btn.dataset.cartFixV94='1';
    btn.style.setProperty('pointer-events','auto','important');
    btn.style.setProperty('touch-action','manipulation','important');
    btn.style.setProperty('z-index','2147483000','important');
  };

  const clearForcedOpenStyles=modal=>{
    if(!modal)return;
    ['display','visibility','opacity','z-index','pointer-events'].forEach(p=>modal.style.removeProperty(p));
  };

  const closeCart=()=>{
    const modal=document.getElementById('cartModal');
    if(!modal)return;
    modal.classList.remove('open');
    clearForcedOpenStyles(modal);
    modal.setAttribute('aria-hidden','true');
  };

  const openCart=()=>{
    const modal=document.getElementById('cartModal');
    if(modal?.classList.contains('open'))return;
    try{
      if(window.MenuOrbitApp&&typeof window.MenuOrbitApp.openCart==='function'){
        window.MenuOrbitApp.openCart();
      }else{
        const hidden=document.getElementById('cartBtn');
        if(hidden&&typeof hidden.onclick==='function')hidden.onclick.call(hidden,new MouseEvent('click',{bubbles:false,cancelable:true}));
        else hidden?.click();
      }
    }catch{
      try{document.getElementById('cartBtn')?.click()}catch{}
    }
    requestAnimationFrame(()=>{
      const m=document.getElementById('cartModal');
      if(!m)return;
      m.classList.add('open');
      m.removeAttribute('aria-hidden');
      m.style.setProperty('display','flex','important');
      m.style.setProperty('visibility','visible','important');
      m.style.setProperty('opacity','1','important');
      m.style.setProperty('z-index','2147483640','important');
      m.style.setProperty('pointer-events','auto','important');
    });
  };

  const pointInside=(e,el)=>{
    if(!el)return false;
    const r=el.getBoundingClientRect();
    const x=e.clientX,y=e.clientY;
    return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
  };

  const onPointerDown=e=>{
    const modal=document.getElementById('cartModal');
    if(modal?.classList.contains('open')){
      if(e.target.closest?.('#cartClose')||e.target===modal){
        e.preventDefault();
        e.stopImmediatePropagation();
        closeCart();
      }
      return;
    }

    const cart=getCartNode();
    if(!cart)return;
    const direct=e.target===cart||e.target.closest?.('#mainSubmenuDirect>button[aria-label="Cart"],#mainSubmenuDirect>button[data-cart-fix-v94="1"]');
    if(!direct&&!pointInside(e,cart))return;

    e.preventDefault();
    e.stopImmediatePropagation();
    openCart();
  };

  window.addEventListener('pointerdown',onPointerDown,true);

  document.addEventListener('keydown',e=>{
    const modal=document.getElementById('cartModal');
    if(e.key==='Escape'&&modal?.classList.contains('open')){
      e.preventDefault();
      closeCart();
      return;
    }
    if(e.key!=='Enter'&&e.key!==' ')return;
    const cart=getCartNode();
    if(!cart||e.target!==cart)return;
    e.preventDefault();
    openCart();
  },true);

  const start=()=>{
    markCart();
    new MutationObserver(markCart).observe(document.getElementById('mainSubmenuDirect')||document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();