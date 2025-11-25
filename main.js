/* scripts.js — منطق صفحات، انیمیشن‌ها، شبیه‌ساز و تعامل‌ها */
/* Helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function show(el){ if(!el) return; el.style.display='block'; }
function hide(el){ if(!el) return; el.style.display='none'; }

/* ---------- distance page: runner ---------- */
(function(){
  if(!$('#runner')) return;
  const runner = $('#runner');
  const startBtn = $('#run-start'), stopBtn = $('#run-stop'), speedRange = $('#run-speed');
  let t = null;
  function reset(){ runner.style.left = '-80px'; }
  reset();
  startBtn.addEventListener('click', ()=> {
    clearInterval(t);
    let left = -80;
    let sp = Number(speedRange.value || 1.4);
    t = setInterval(()=>{
      left += sp * 2.4;
      runner.style.left = left + 'px';
      if(left > (document.getElementById('distance-stage').clientWidth + 120)){ clearInterval(t); reset(); }
    }, 28);
  });
  stopBtn.addEventListener('click', ()=> { clearInterval(t); reset(); });
  document.getElementById('dist-check')?.addEventListener('click', ()=>{
    const s = $('#dist-s').value.trim(), d = $('#dist-d').value.trim();
    if(s === '7' && (d === '3' || d === '۳')) show($('#dist-result')); else alert('پاسخ صحیح: مسافت=7 , جابه‌جایی=3');
  });
})();

/* ---------- displacement: draw vector ---------- */
(function(){
  if(!$('#vec-draw')) return;
  $('#vec-draw').addEventListener('click', ()=>{
    const x = Number($('#vec-x').value||0), y = Number($('#vec-y').value||0);
    const stage = $('#vec-stage'); stage.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 320 160'); svg.setAttribute('width','100%');
    const cx = 80, cy = 120, scale = 14;
    const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',20); ax.setAttribute('y1',cy); ax.setAttribute('x2',300); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); svg.appendChild(ax);
    const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); svg.appendChild(ay);
    const x2 = cx + x*scale, y2 = cy - y*scale;
    const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#7c3aed'); vec.setAttribute('stroke-width',3); svg.appendChild(vec);
    const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#7c3aed'); svg.appendChild(head);
    const txt = document.createElementNS(ns,'text'); txt.setAttribute('x', x2+8); txt.setAttribute('y', y2-8); txt.setAttribute('font-size',12); txt.setAttribute('fill','#111'); txt.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)} m`; svg.appendChild(txt);
    stage.appendChild(svg);
    show($('#vec-answer'));
  });
})();

/* ---------- avg speed calc ---------- */
(function(){
  $('#calc-avg-speed')?.addEventListener('click', ()=>{
    // sample 120m in 2s
    $('#avg-speed-result').style.display = 'block';
    $('#avg-speed-result').innerHTML = 'پاسخ نمونه: v_avg = 120 / 2 = 60 m/s';
  });
})();

/* ---------- instant speed page note (no auto) ---------- */
/* ---------- avg velocity page note (no auto) ---------- */

/* ---------- acceleration: rocket ---------- */
(function(){
  if(!$('#acc-start')) return;
  const rocket = $('#rocket-stage')?.querySelector('.rocket') ? $('#rocket-stage').querySelector('.rocket') : null;
  // We'll animate by creating a div rocket in stage
  const stage = $('#rocket-stage');
  if(stage && !stage.querySelector('.rocket')){
    const r = document.createElement('div'); r.id = 'rocket-char'; r.className='rocket'; stage.appendChild(r);
  }
  const rocketChar = $('#rocket-char');
  let timer = null;
  $('#acc-start').addEventListener('click', ()=>{
    clearInterval(timer);
    let v = 1;
    timer = setInterval(()=>{
      v += Number($('#acc-slider').value)/80;
      const up = Math.min(200, v*40);
      rocketChar.style.transform = `translateY(${-up}px)`;
      if(up >= 200){ clearInterval(timer); }
    }, 120);
  });
  $('#acc-stop').addEventListener('click', ()=>{ clearInterval(timer); rocketChar.style.transform='translateY(0)'; });
})();

/* ---------- games: simulator (professional) ---------- */
(function(){
  if(!$('#sim-run')) return;
  const car = $('#sim-car'), stage = $('#sim-stage'), result = $('#sim-result');
  let anim = null;
  function resetSim(){ car.style.left = '-140px'; result.style.display='none'; result.innerHTML=''; clearInterval(anim); }
  resetSim();
  $('#sim-run').addEventListener('click', ()=>{
    resetSim();
    const v0 = Number($('#sim-v0').value)||0;
    const a = Number($('#sim-a').value)||0;
    const tTarget = Number($('#sim-t').value)||1;
    // animate: use small dt loop and update position s = v0 t + 0.5 a t^2
    let t=0;
    anim = setInterval(()=>{
      t += 0.02;
      const s = v0 * t + 0.5 * a * t * t;
      car.style.left = Math.min(stage.clientWidth - 40, (s*6)) + 'px'; // scale for visual
      if(t >= tTarget){ clearInterval(anim); anim=null; /* show true values for checking */ }
    }, 20);
  });
  $('#sim-reset').addEventListener('click', resetSim);

  $('#sim-check').addEventListener('click', ()=>{
    const v0 = Number($('#sim-v0').value)||0;
    const a = Number($('#sim-a').value)||0;
    const tTarget = Number($('#sim-t').value)||0;
    const trueV = (v0 + a * tTarget);
    const trueS = (v0 * tTarget + 0.5 * a * tTarget * tTarget);
    const userV = Number($('#sim-v-ans').value);
    const userS = Number($('#sim-s-ans').value);
    let msg = '';
    const vOk = Math.abs(userV - trueV) < Math.max(0.05, Math.abs(trueV)*0.03);
    const sOk = Math.abs(userS - trueS) < Math.max(0.1, Math.abs(trueS)*0.03);
    msg += `مقدار درست: v(t) = ${trueV.toFixed(3)} m/s — s(t) = ${trueS.toFixed(3)} m\n`;
    msg += `پاسخ شما: v = ${userV} m/s — s = ${userS} m\n`;
    if(vOk && sOk) msg = `<b>عالی!</b><br>` + msg;
    else msg = `<b>اشتباه—موارد نزدیک به درست با خطای کمتر از 3٪ پذیرفته می‌شود.</b><br>` + msg;
    result.style.display='block';
    result.innerHTML = msg.replace(/\n/g,'<br>');
  });
})();

/* ---------- utils for other pages: ensure any 'answer' boxes hidden initially ---------- */
document.addEventListener('DOMContentLoaded', ()=> {
  $$('.answer').forEach(el=> el.style.display='none');
  // small compatibility: ensure runner and car elements present on pages
  if($('#distance-stage') && !$('#runner')){ const r=document.createElement('div'); r.id='runner'; r.className='runner'; $('#distance-stage').appendChild(r); }
  if($('#stage-speed') && !$('#car')){ const c=document.createElement('div'); c.id='car'; c.className='car'; $('#stage-speed').appendChild(c); }
  if($('#sim-stage') && !$('#sim-car')){ const c=document.createElement('div'); c.id='sim-car'; c.className='car'; $('#sim-stage').appendChild(c); }
});
