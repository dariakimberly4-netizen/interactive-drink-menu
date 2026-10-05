(()=>{
if(window.__customerOrbitPremiumV96)return;window.__customerOrbitPremiumV96=true;
const normalize=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
const findOldAction=(label)=>{
  const wanted=normalize(label);
  const nodes=[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('#premiumCustomerOrbitV96'));
  return nodes.find(el=>normalize(el.textContent)===wanted)||nodes.find(el=>normalize(el.textContent).includes(wanted));
};
const launch=(label)=>{
  const overlay=document.getElementById('premiumCustomerOrbitV96');
  const target=findOldAction(label);
  if(target){overlay?.classList.add('pco-hidden');setTimeout(()=>target.click(),40);return;}
  if(label==='Menu'){overlay?.classList.add('pco-hidden');location.hash='orbit';return;}
};
const style=document.createElement('style');
style.textContent=`
#premiumCustomerOrbitV96{position:fixed;inset:0;z-index:31;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:linear-gradient(rgba(2,10,8,.44),rgba(2,10,8,.60)),url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1800&q=84') center/cover no-repeat;overflow:hidden;opacity:1;transition:opacity .22s ease}
#premiumCustomerOrbitV96.pco-hidden{opacity:0;pointer-events:none}
#premiumCustomerOrbitV96 *{box-sizing:border-box}
#premiumCustomerOrbitV96 .pco-top{height:82px;display:flex;align-items:center;gap:16px;padding:12px clamp(14px,3vw,32px);background:rgba(2,16,12,.86);backdrop-filter:blur(18px);border-bottom:1px solid rgba(212,173,98,.5)}
#premiumCustomerOrbitV96 .pco-brand{display:flex;align-items:center;gap:14px;min-width:0;flex:1}
#premiumCustomerOrbitV96 .pco-logo{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 30%,#0ab069 0,#00754a 60%,#035636 100%);border:2px solid #fff;box-shadow:0 0 0 6px rgba(0,117,74,.2);font:900 34px Georgia,serif}
#premiumCustomerOrbitV96 .pco-brand strong{display:block;font-size:clamp(18px,1.7vw,23px);letter-spacing:.03em;white-space:nowrap}
#premiumCustomerOrbitV96 .pco-brand small{display:block;color:#d9c58f;font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-top:2px;white-space:nowrap}
#premiumCustomerOrbitV96 .pco-tools{display:flex;align-items:center;gap:12px}
#premiumCustomerOrbitV96 .pco-time{padding-right:12px;border-right:1px solid rgba(255,255,255,.16);text-align:right;white-space:nowrap}
#premiumCustomerOrbitV96 .pco-time b{display:block;color:#f0d49a;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
#premiumCustomerOrbitV96 .pco-time span{display:block;font-weight:850;font-size:16px}
#premiumCustomerOrbitV96 .pco-icon{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(212,173,98,.72);background:rgba(255,255,255,.05);font-size:21px}
#premiumCustomerOrbitV96 .pco-stage{height:calc(100vh - 82px);display:grid;place-items:center;padding:12px 18px 18px;position:relative;background:radial-gradient(circle at 50% 50%,rgba(0,168,98,.10),transparent 36%)}
#premiumCustomerOrbitV96 .pco-orbit{position:relative;width:min(75vw,860px);height:min(75vw,860px);min-width:610px;min-height:610px}
#premiumCustomerOrbitV96 .pco-orbit:before,#premiumCustomerOrbitV96 .pco-orbit:after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none}
#premiumCustomerOrbitV96 .pco-orbit:before{width:70%;height:70%;border:1px solid rgba(212,173,98,.4);box-shadow:0 0 70px rgba(212,173,98,.11)}
#premiumCustomerOrbitV96 .pco-orbit:after{width:91%;height:91%;border:1px solid rgba(212,173,98,.15)}
#premiumCustomerOrbitV96 .pco-hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:35%;aspect-ratio:1;border-radius:50%;z-index:5;display:grid;place-items:center;text-align:center;padding:20px;border:3px solid rgba(212,173,98,.82);background:radial-gradient(circle at 35% 30%,rgba(0,168,98,.24),transparent 24%),linear-gradient(145deg,#0a2d20,#051812 68%,#03110c);box-shadow:0 0 0 8px rgba(212,173,98,.08),0 0 90px rgba(0,168,98,.2),0 28px 70px rgba(0,0,0,.48)}
#premiumCustomerOrbitV96 .pco-hub-logo{width:42%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;margin:0 auto 10px;background:radial-gradient(circle at 30% 30%,#10b871 0,#00754a 62%,#034b30 100%);border:2px solid rgba(255,255,255,.78);font:900 clamp(42px,5vw,72px) Georgia,serif}
#premiumCustomerOrbitV96 .pco-hub-title{font-size:clamp(20px,2vw,33px);font-weight:950;letter-spacing:.04em}
#premiumCustomerOrbitV96 .pco-hub-sub{font-size:clamp(11px,1vw,16px);letter-spacing:.22em;text-transform:uppercase;color:#f1e8d5;margin-top:3px}
#premiumCustomerOrbitV96 .pco-line{width:58px;height:2px;margin:12px auto;background:linear-gradient(90deg,transparent,#d4ad62,transparent)}
#premiumCustomerOrbitV96 .pco-copy{max-width:230px;margin:auto;color:#d2ded7;font-size:clamp(10px,.85vw,13px);line-height:1.4}
#premiumCustomerOrbitV96 .pco-card{position:absolute;width:25%;aspect-ratio:1;border-radius:50%;overflow:hidden;border:3px solid rgba(212,173,98,.85);background:#08251b;color:#fff;box-shadow:0 22px 62px rgba(0,0,0,.5);cursor:pointer;padding:0;text-align:left;transition:filter .2s ease,box-shadow .2s ease}
#premiumCustomerOrbitV96 .pco-card:hover{filter:brightness(1.08);box-shadow:0 28px 72px rgba(0,0,0,.6)}
#premiumCustomerOrbitV96 .pco-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#premiumCustomerOrbitV96 .pco-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.13) 40%,rgba(2,10,8,.88) 79%)}
#premiumCustomerOrbitV96 .pco-card .pco-ico{position:absolute;z-index:2;left:14px;top:14px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.30);font-size:22px}
#premiumCustomerOrbitV96 .pco-card .pco-label{position:absolute;z-index:2;left:14px;right:58px;bottom:16px}
#premiumCustomerOrbitV96 .pco-card h3{margin:0;font-size:clamp(16px,1.42vw,24px);line-height:1.02;text-transform:uppercase;letter-spacing:.03em}
#premiumCustomerOrbitV96 .pco-card p{margin:7px 0 0;font-size:clamp(9px,.72vw,12px);line-height:1.3;text-transform:uppercase;letter-spacing:.08em;color:#edf1ee}
#premiumCustomerOrbitV96 .pco-card .pco-go{position:absolute;z-index:2;right:12px;bottom:14px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#f2c85f;color:#172017;font-size:22px;font-weight:950}
#premiumCustomerOrbitV96 .pco-menu{left:50%;top:3%;transform:translateX(-50%)}
#premiumCustomerOrbitV96 .pco-order{right:3%;top:18%}
#premiumCustomerOrbitV96 .pco-stores{right:8%;bottom:10%}
#premiumCustomerOrbitV96 .pco-rewards{left:50%;bottom:0;transform:translateX(-50%)}
#premiumCustomerOrbitV96 .pco-account{left:3%;bottom:18%}
#premiumCustomerOrbitV96 .pco-settings{left:8%;top:18%}
#premiumCustomerOrbitV96 .pco-mobile{display:none}
@media(max-width:900px){
#premiumCustomerOrbitV96{overflow:auto;background-attachment:scroll}
#premiumCustomerOrbitV96 .pco-top{height:auto;min-height:70px;flex-wrap:wrap;padding:10px 14px}
#premiumCustomerOrbitV96 .pco-logo{width:44px;height:44px;font-size:27px}
#premiumCustomerOrbitV96 .pco-brand strong{font-size:18px}
#premiumCustomerOrbitV96 .pco-tools{width:100%;justify-content:space-between}
#premiumCustomerOrbitV96 .pco-time{border-right:0;text-align:left;padding-right:0}
#premiumCustomerOrbitV96 .pco-stage{height:auto;min-height:calc(100vh - 116px);padding:16px 10px 26px;display:block}
#premiumCustomerOrbitV96 .pco-orbit{width:min(100%,560px);height:auto;aspect-ratio:1;min-width:0;min-height:0;margin:0 auto}
#premiumCustomerOrbitV96 .pco-hub{width:44%;padding:14px}
#premiumCustomerOrbitV96 .pco-hub-logo{font-size:42px}
#premiumCustomerOrbitV96 .pco-card{width:31%;border-width:2px}
#premiumCustomerOrbitV96 .pco-card .pco-ico{width:34px;height:34px;font-size:17px;left:9px;top:9px}
#premiumCustomerOrbitV96 .pco-card .pco-label{left:10px;right:43px;bottom:10px}
#premiumCustomerOrbitV96 .pco-card h3{font-size:14px}
#premiumCustomerOrbitV96 .pco-card p{font-size:8px;margin-top:4px}
#premiumCustomerOrbitV96 .pco-card .pco-go{width:32px;height:32px;font-size:18px;right:9px;bottom:9px}
#premiumCustomerOrbitV96 .pco-menu{top:5%}.pco-order{top:17%;right:1%}.pco-stores{bottom:13%;right:5%}.pco-rewards{bottom:2%}.pco-account{left:1%;bottom:17%}.pco-settings{left:5%;top:17%}
}
@media(max-width:560px){
#premiumCustomerOrbitV96 .pco-brand small{display:none}
#premiumCustomerOrbitV96 .pco-brand strong{font-size:16px}
#premiumCustomerOrbitV96 .pco-icon{width:40px;height:40px;font-size:18px}
#premiumCustomerOrbitV96 .pco-time b{font-size:9px}#premiumCustomerOrbitV96 .pco-time span{font-size:13px}
#premiumCustomerOrbitV96 .pco-stage{padding-top:12px}
#premiumCustomerOrbitV96 .pco-orbit{max-width:390px}
#premiumCustomerOrbitV96 .pco-orbit:before{width:63%;height:63%}#premiumCustomerOrbitV96 .pco-orbit:after{width:83%;height:83%}
#premiumCustomerOrbitV96 .pco-hub{width:52%;padding:12px}
#premiumCustomerOrbitV96 .pco-hub-logo{font-size:34px;margin-bottom:7px}
#premiumCustomerOrbitV96 .pco-hub-title{font-size:17px}#premiumCustomerOrbitV96 .pco-hub-sub{font-size:9px;letter-spacing:.12em}#premiumCustomerOrbitV96 .pco-copy{display:none}#premiumCustomerOrbitV96 .pco-line{margin:7px auto;width:42px}
#premiumCustomerOrbitV96 .pco-card{display:none}
#premiumCustomerOrbitV96 .pco-mobile{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:420px;margin:14px auto 0}
#premiumCustomerOrbitV96 .pco-mobile button{position:relative;min-height:112px;border-radius:20px;overflow:hidden;border:1px solid rgba(212,173,98,.48);background:#08251b;color:#fff;padding:13px;text-align:left;box-shadow:0 16px 40px rgba(0,0,0,.35)}
#premiumCustomerOrbitV96 .pco-mobile button img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.36}#premiumCustomerOrbitV96 .pco-mobile button:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(2,9,7,.88))}
#premiumCustomerOrbitV96 .pco-mobile .mi{position:relative;z-index:2}#premiumCustomerOrbitV96 .pco-mobile .mi span{font-size:21px}#premiumCustomerOrbitV96 .pco-mobile .mi b{display:block;font-size:15px;text-transform:uppercase;margin-top:8px}#premiumCustomerOrbitV96 .pco-mobile .mi small{display:block;font-size:10px;line-height:1.3;color:#e8eee9;margin-top:3px}
}
`;
document.head.appendChild(style);
const wrap=document.createElement('section');wrap.id='premiumCustomerOrbitV96';
wrap.innerHTML=`<div class="pco-top"><div class="pco-brand"><div class="pco-logo">S</div><div><strong>STARBUCKS PHILIPPINES</strong><small>Welcome to the Customer Orbit</small></div></div><div class="pco-tools"><div class="pco-time"><b id="pcoDate">MON, OCT 5, 2026</b><span id="pcoTime">3:09 PM</span></div><button class="pco-icon" data-action="My Account" aria-label="Profile">👤</button></div></div><div class="pco-stage"><div class="pco-orbit"><div class="pco-hub"><div><div class="pco-hub-logo">S</div><div class="pco-hub-title">STARBUCKS</div><div class="pco-hub-sub">Customer Orbit</div><div class="pco-line"></div><div class="pco-copy">Good coffee, brighter days. Choose where you want to go.</div></div></div><button class="pco-card pco-menu" data-action="Menu"><img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">☕</span><span class="pco-label"><h3>Menu</h3><p>Drinks, food & merchandise</p></span><span class="pco-go">→</span></button><button class="pco-card pco-order" data-action="My Order"><img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">🛒</span><span class="pco-label"><h3>My Order</h3><p>View, track & reorder</p></span><span class="pco-go">→</span></button><button class="pco-card pco-stores" data-action="Stores"><img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">📍</span><span class="pco-label"><h3>Stores</h3><p>Find a store near you</p></span><span class="pco-go">→</span></button><button class="pco-card pco-rewards" data-action="Rewards"><img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">★</span><span class="pco-label"><h3>Rewards</h3><p>Stars, offers & exclusives</p></span><span class="pco-go">→</span></button><button class="pco-card pco-account" data-action="My Account"><img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">👤</span><span class="pco-label"><h3>My Account</h3><p>Profile, payments & saved info</p></span><span class="pco-go">→</span></button><button class="pco-card pco-settings" data-action="Settings"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"><span class="pco-ico">⚙</span><span class="pco-label"><h3>Settings</h3><p>Preferences & notifications</p></span><span class="pco-go">→</span></button></div><div class="pco-mobile"><button data-action="Menu"><img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>☕</span><b>Menu</b><small>Drinks, food & merchandise</small></span></button><button data-action="My Order"><img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>🛒</span><b>My Order</b><small>View, track & reorder</small></span></button><button data-action="Stores"><img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>📍</span><b>Stores</b><small>Find a store near you</small></span></button><button data-action="Rewards"><img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>★</span><b>Rewards</b><small>Stars, offers & exclusives</small></span></button><button data-action="My Account"><img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>👤</span><b>My Account</b><small>Profile, payments & saved info</small></span></button><button data-action="Settings"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"><span class="mi"><span>⚙</span><b>Settings</b><small>Preferences & notifications</small></span></button></div></div>`;
document.body.appendChild(wrap);
wrap.addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(btn)launch(btn.dataset.action)});
const tick=()=>{const d=new Date();const date=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(d).toUpperCase();const time=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(d);document.getElementById('pcoDate').textContent=date;document.getElementById('pcoTime').textContent=time};tick();setInterval(tick,30000);
const showOverlay=()=>document.getElementById('premiumCustomerOrbitV96')?.classList.remove('pco-hidden');
window.addEventListener('hashchange',()=>{if(location.hash==='#orbit'||!location.hash)showOverlay()});
})();