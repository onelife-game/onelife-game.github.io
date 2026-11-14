// =====================================================================
// 応援（投げ銭）ボタン ― THE END 画面に表示
// SUPPORT_URL に Ko-fi / OFUSE などのページURLを入れると表示される（空なら非表示）
// =====================================================================
const SUPPORT_URL='https://ofuse.me/189c6635';
const SUPPORT_LABEL='作者を応援する';
const SUPPORT_NOTE='ONE LIFEは個人で作っています。新しい時代や人生の追加に使わせてもらいます';

(function(){
  if(!SUPPORT_URL)return;
  const _endLife3=endLife;
  endLife=function(cause){
    _endLife3(cause);
    const ov=[...document.querySelectorAll('.ov')].pop();if(!ov)return;
    const mb=ov.querySelector('.mb');if(!mb)return;
    const a=document.createElement('a');
    a.className='op';a.href=SUPPORT_URL;a.target='_blank';a.rel='noopener';
    a.style.textDecoration='none';
    a.innerHTML=`${SUPPORT_LABEL}<span class="rt">♥</span><small>${SUPPORT_NOTE}</small>`;
    // 「シェア」ボタンのすぐ下に入れる
    const first=mb.firstElementChild;
    if(first&&first.nextSibling)mb.insertBefore(a,first.nextSibling);else mb.appendChild(a);
  };
})();
