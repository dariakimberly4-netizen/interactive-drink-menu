(()=>{
  if(window.NewFeatureHighlight)return;
  const KEY='mo_seen_features_v1';
  const seen=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const save=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const css=document.createElement('style');
  css.textContent=`
    .mo-new-feature{position:relative!important;isolation:isolate}
    .mo-new-feature::after{content:attr(data-mo-new-label);position:absolute;z-index:50;top:-9px;right:-8px;padding:4px 7px;border-radius:999px;background:#f4c86f;color:#07331f;font:950 9px/1 system-ui;letter-spacing:.08em;box-shadow:0 8px 22px rgba(0,0,0,.32);pointer-events:none}
    .mo-new-feature{animation:moNewPulse 1.65s ease-in-out infinite;box-shadow:0 0 0 3px rgba(244,200,111,.82),0 0 0 8px rgba(244,200,111,.14)!important}
    @keyframes moNewPulse{50%{box-shadow:0 0 0 3px rgba(244,200,111,.95),0 0 0 15px rgba(244,200,111,0)!important}}
    @media(prefers-reduced-motion:reduce){.mo-new-feature{animation:none}}
  `;
  document.head.appendChild(css);
  const clear=(el,key)=>{
    const s=seen();s[key]=Date.now();save(s);
    el.classList.remove('mo-new-feature');el.removeAttribute('data-mo-new-label');el.removeAttribute('data-mo-feature-key');
  };
  const register=(target,key,label='NEW')=>{
    const el=typeof target==='string'?document.querySelector(target):target;
    if(!el||!key)return false;
    if(seen()[key])return false;
    el.classList.add('mo-new-feature');el.dataset.moNewLabel=label;el.dataset.moFeatureKey=key;
    const dismiss=()=>clear(el,key);
    el.addEventListener('click',dismiss,{once:true,capture:true});
    return true;
  };
  const reset=(prefix='')=>{
    const s=seen();
    Object.keys(s).forEach(k=>{if(!prefix||k.startsWith(prefix))delete s[k]});
    save(s);
  };
  window.NewFeatureHighlight={register,clear,reset,isSeen:key=>!!seen()[key],storageKey:KEY};
})();

/* V79 — keep the orbit center as S; hide only the separate upper-left MENU shortcut. */
(()=>{
  const css=document.createElement('style');
  css.textContent=`
    #menuMainBtnV61{display:none!important}
    html body #mainMenuDirect #navOrbitCenter{
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      visibility:visible!important;
      opacity:1!important;
      font-size:0!important;
      pointer-events:auto!important;
    }
    html body #mainMenuDirect #navOrbitCenter>*{display:none!important}
    html body #mainMenuDirect #navOrbitCenter::before{
      content:'S'!important;
      display:block!important;
      position:relative!important;
      z-index:5!important;
      color:#fff!important;
      font:900 clamp(42px,12vw,72px)/1 Georgia,serif!important;
      letter-spacing:0!important;
      text-shadow:0 2px 16px rgba(0,0,0,.28)!important;
      pointer-events:none!important;
    }
  `;
  document.head.appendChild(css);
})();