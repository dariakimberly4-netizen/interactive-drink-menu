(()=>{
if(window.__customerOrbitReadabilityV97)return;window.__customerOrbitReadabilityV97=true;
const style=document.createElement('style');
style.textContent=`
#premiumCustomerOrbitV96{z-index:2147483000!important}
#premiumCustomerOrbitV96 .pco-stage{display:grid!important;place-items:center!important;overflow:hidden!important;padding:8px 16px 12px!important}
#premiumCustomerOrbitV96 .pco-orbit{width:min(66vw,calc(100vh - 116px),760px)!important;height:min(66vw,calc(100vh - 116px),760px)!important;min-width:0!important;min-height:0!important}
#premiumCustomerOrbitV96 .pco-hub{width:35%!important;padding:18px!important;background:linear-gradient(145deg,rgba(4,38,27,.98),rgba(3,20,15,.99))!important}
#premiumCustomerOrbitV96 .pco-hub-logo{width:40%!important;margin-bottom:8px!important}
#premiumCustomerOrbitV96 .pco-hub-title{font-size:clamp(24px,2vw,33px)!important}
#premiumCustomerOrbitV96 .pco-hub-sub{font-size:clamp(11px,.9vw,15px)!important;font-weight:800!important}
#premiumCustomerOrbitV96 .pco-copy{font-size:clamp(11px,.78vw,13px)!important;line-height:1.4!important;max-width:220px!important;color:#fff!important}
#premiumCustomerOrbitV96 .pco-card{width:25%!important;border-width:3px!important;box-shadow:0 22px 64px rgba(0,0,0,.58)!important}
#premiumCustomerOrbitV96 .pco-card:after{background:linear-gradient(180deg,rgba(0,0,0,.03) 0%,rgba(0,0,0,.10) 42%,rgba(2,10,8,.68) 66%,rgba(2,10,8,.96) 100%)!important}
#premiumCustomerOrbitV96 .pco-card .pco-label{left:15px!important;right:15px!important;bottom:22px!important;padding:0!important;text-align:center!important;text-shadow:0 2px 6px rgba(0,0,0,.98)!important}
#premiumCustomerOrbitV96 .pco-card h3{margin:0!important;font-size:clamp(18px,1.55vw,25px)!important;line-height:1.02!important;font-weight:950!important;letter-spacing:.015em!important;color:#fff!important;white-space:normal!important;overflow:visible!important}
#premiumCustomerOrbitV96 .pco-card p{display:none!important}
#premiumCustomerOrbitV96 .pco-card .pco-ico{width:42px!important;height:42px!important;left:13px!important;top:13px!important;font-size:20px!important;background:rgba(2,16,12,.76)!important;border:1.5px solid rgba(255,255,255,.56)!important}
#premiumCustomerOrbitV96 .pco-card .pco-go{width:38px!important;height:38px!important;right:11px!important;bottom:11px!important;font-size:21px!important;background:#f2c85f!important;box-shadow:0 7px 20px rgba(0,0,0,.42)!important}
#premiumCustomerOrbitV96 .pco-menu{left:50%!important;top:0!important;transform:translateX(-50%)!important}
#premiumCustomerOrbitV96 .pco-order{right:1%!important;top:18%!important}
#premiumCustomerOrbitV96 .pco-stores{right:7%!important;bottom:9%!important}
#premiumCustomerOrbitV96 .pco-rewards{left:50%!important;bottom:0!important;transform:translateX(-50%)!important}
#premiumCustomerOrbitV96 .pco-account{left:1%!important;bottom:18%!important}
#premiumCustomerOrbitV96 .pco-settings{left:7%!important;top:18%!important}
@media(max-width:1100px) and (min-width:561px){
#premiumCustomerOrbitV96 .pco-orbit{width:min(78vw,calc(100vh - 130px),680px)!important;height:min(78vw,calc(100vh - 130px),680px)!important}
#premiumCustomerOrbitV96 .pco-card{width:26%!important}
#premiumCustomerOrbitV96 .pco-card h3{font-size:clamp(15px,1.8vw,20px)!important}
#premiumCustomerOrbitV96 .pco-card .pco-label{left:10px!important;right:10px!important;bottom:17px!important}
#premiumCustomerOrbitV96 .pco-card .pco-ico{width:34px!important;height:34px!important;left:9px!important;top:9px!important;font-size:17px!important}
#premiumCustomerOrbitV96 .pco-card .pco-go{width:32px!important;height:32px!important;right:8px!important;bottom:8px!important;font-size:18px!important}
#premiumCustomerOrbitV96 .pco-hub{width:38%!important}
#premiumCustomerOrbitV96 .pco-hub-title{font-size:22px!important}
#premiumCustomerOrbitV96 .pco-copy{font-size:10px!important;max-width:165px!important}
}
@media(max-width:560px){
#premiumCustomerOrbitV96{overflow:auto!important}
#premiumCustomerOrbitV96 .pco-stage{display:block!important;overflow:visible!important;padding:12px 10px 24px!important}
#premiumCustomerOrbitV96 .pco-orbit{width:100%!important;height:auto!important;max-width:390px!important;aspect-ratio:1!important;margin:0 auto!important}
#premiumCustomerOrbitV96 .pco-hub{width:56%!important;padding:12px!important}
#premiumCustomerOrbitV96 .pco-hub-title{font-size:19px!important}
#premiumCustomerOrbitV96 .pco-hub-sub{font-size:10px!important}
#premiumCustomerOrbitV96 .pco-copy{display:none!important}
#premiumCustomerOrbitV96 .pco-card{display:none!important}
#premiumCustomerOrbitV96 .pco-mobile{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;max-width:420px!important;margin:14px auto 0!important;padding:0 4px!important}
#premiumCustomerOrbitV96 .pco-mobile button{min-height:124px!important;border-radius:22px!important;border-width:2px!important;padding:18px!important}
#premiumCustomerOrbitV96 .pco-mobile button img{opacity:.28!important}
#premiumCustomerOrbitV96 .pco-mobile button:after{background:linear-gradient(90deg,rgba(2,10,8,.91),rgba(2,10,8,.50))!important}
#premiumCustomerOrbitV96 .pco-mobile .mi span{font-size:26px!important}
#premiumCustomerOrbitV96 .pco-mobile .mi b{font-size:19px!important;line-height:1.05!important;margin-top:10px!important}
#premiumCustomerOrbitV96 .pco-mobile .mi small{font-size:13px!important;line-height:1.35!important;color:#fff!important;font-weight:700!important;max-width:230px!important}
}
`;
document.head.appendChild(style);
})();