/* main.js — منطق تمام صفحات (انیمیشن‌ها، شبیه‌ساز، رسم بردار، آزمون در quiz.html) */

/* Helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function show(el){ if(!el) return; el.style.display='block'; }
function hide(el){ if(!el) return; el.style.display='none'; }

/* Ensure DOM loaded */
document.addEventListener('DOMContentLoaded', ()=> {
  // Add runner/car/rocket where needed
  if(document.getElementById('distance-stage') && !document.getElementById('runner')) {
    const r = document.createElement('div'); r.id='runner'; r.className='runner'; document.getElementById('distance-stage').appendChild(r);
  }
  if(document.getElementById('inst-speed-stage') && !document.getElementById('inst-runner')) {
    const r2 = document.createElement('div'); r2.id='inst-runner'; r2.className='runner'; document.getElementById('inst-speed-stage').appendChild(r2);
  }
  if(document.getElementById('rocket-stage') && !document.getElementById('rocket-char')) {
    const rc = document.createElement('div'); rc.id='rocket-char'; rc.className='rocket'; document.getElementById('rocket-stage').appendChild(rc);
  }
  if(document.getElementById('sim-stage') && !document.getElementById('sim-car')) {
    const sc = document.createElement('div'); sc.id='sim-car'; sc.className='car'; document.getElementById('sim-stage').appendChild(sc);
  }

  // Distance page controls
  if($('#run-start')) {
    let runTimer = null;
    $('#run-start').addEventListener('click', ()=>{
      clearInterval(runTimer);
      const run = $('#runner');
      const stage = $('#distance-stage');
      let left = -120;
      const sp = Number($('#run-speed').value) || 1.2;
      run.style.left = left + 'px';
      runTimer = setInterval(()=>{
        left += sp * 2.8;
        run.style.left = left + 'px';
        if(left > stage.clientWidth + 80) { clearInterval(runTimer); run.style.left='-120px'; }
      }, 24);
      $('#run-stop').addEventListener('click', ()=>{ clearInterval(runTimer); run.style.left='-120px'; });
    });
  }

  // distance check
  if($('#dist-check')) {
    $('#dist-check').addEventListener('click', ()=>{
      const s = $('#dist-s').value.trim();
      const d = $('#dist-d').value.trim();
      const res = $('#dist-result');
      if(s === '' || d === '') { alert('لطفاً مقادیر را وارد کن'); return; }
      // naive check numeric
      const sNum = Number(s.replace(',','.')), dNum = Number(d.replace(',','.'));
      // For example on that page: expected 7 and 3 (per book example)
      if(Math.abs(sNum - 7) < 0.001 && Math.abs(dNum - 3) < 0.001) {
        res.innerHTML = 'پاسخ صحیح ✅ — مسافت = 7 m ، جابه‌جایی = 3 m';
      } else {
        res.innerHTML = `پاسخ نمونه: مسافت = 7 m ، جابه‌جایی = 3 m — پاسخ شما: مسافت=${sNum} ، جابه‌جایی=${dNum}`;
      }
      show(res);
    });
  }

  // Displacement draw
  if($('#vec-draw')) {
    $('#vec-draw').addEventListener('click', ()=>{
      const x = Number($('#vec-x').value || 0), y = Number($('#vec-y').value || 0);
      const stage = $('#vec-stage'); stage.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 320 160'); svg.setAttribute('width','100%');
      const cx = 60, cy = 120, scale = 14;
      const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',10); ax.setAttribute('y1',cy); ax.setAttribute('x2',310); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); svg.appendChild(ax);
      const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); svg.appendChild(ay);
      const x2 = cx + x*scale, y2 = cy - y*scale;
      const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#7c3aed'); vec.setAttribute('stroke-width',3); svg.appendChild(vec);
      const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#7c3aed'); svg.appendChild(head);
      const txt = document.createElementNS(ns,'text'); txt.setAttribute('x', x2+8); txt.setAttribute('y', y2-8); txt.setAttribute('font-size',12); txt.setAttribute('fill','#111'); txt.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)} m`; svg.appendChild(txt);
      stage.appendChild(svg);
      show($('#vec-answer'));
    });
  }

  // avg speed sample
  if($('#calc-avg-speed')) {
    $('#calc-avg-speed').addEventListener('click', ()=> {
      const res = $('#avg-speed-result');
      show(res);
      res.innerHTML = 'مثال: 120 m در 2 s → v_avg = 120 / 2 = 60 m/s';
    });
  }

  // Acceleration controls (rocket)
  if($('#acc-start')) {
    let accTimer = null;
    $('#acc-start').addEventListener('click', ()=>{
      clearInterval(accTimer);
      const rc = $('#rocket-char');
      let v=0;
      accTimer = setInterval(()=>{
        const a = Number($('#acc-slider').value || 0.6);
        v += a*0.05;
        const up = Math.min(200, v*40);
        rc.style.transform = `translateY(${-up}px)`;
        if(up >= 200) clearInterval(accTimer);
      }, 50);
      $('#acc-stop').addEventListener('click', ()=> { clearInterval(accTimer); rc.style.transform='translateY(0)'; });
    });
  }

  // Simulator in games page
  if($('#sim-run')) {
    let simAnim = null;
    $('#sim-run').addEventListener('click', ()=>{
      clearInterval(simAnim);
      const car = $('#sim-car'), stage = $('#sim-stage');
      const v0 = Number($('#sim-v0').value) || 0;
      const a = Number($('#sim-a').value) || 0;
      const tTarget = Number($('#sim-t').value) || 1;
      let t=0;
      car.style.left = '-140px';
      simAnim = setInterval(()=>{
        t += 0.02;
        const s = v0*t + 0.5*a*t*t;
        car.style.left = Math.min(stage.clientWidth - 40, s * 6) + 'px';
        if(t >= tTarget) { clearInterval(simAnim); }
      }, 20);
    });
    $('#sim-reset').addEventListener('click', ()=> { const car = $('#sim-car'); car.style.left='-140px'; $('#sim-result').style.display='none'; });
    $('#sim-check').addEventListener('click', ()=> {
      const v0 = Number($('#sim-v0').value)||0;
      const a = Number($('#sim-a').value)||0;
      const tTarget = Number($('#sim-t').value)||0;
      const trueV = (v0 + a * tTarget);
      const trueS = (v0 * tTarget + 0.5 * a * tTarget * tTarget);
      const userV = Number($('#sim-v-ans').value);
      const userS = Number($('#sim-s-ans').value);
      const res = $('#sim-result');
      const vOk = Math.abs(userV - trueV) < Math.max(0.05, Math.abs(trueV)*0.03);
      const sOk = Math.abs(userS - trueS) < Math.max(0.1, Math.abs(trueS)*0.03);
      let msg = `<b>مقدار درست:</b> v=${trueV.toFixed(3)} m/s — s=${trueS.toFixed(3)} m<br>`;
      msg += `<b>پاسخ شما:</b> v=${userV} m/s — s=${userS} m<br>`;
      if(vOk && sOk) msg = `<b style="color:green">عالی — هر دو مقدار درست یا نزدیک به درست هستند.</b><br>` + msg;
      else msg = `<b style="color:red">اشتباه — سعی کن دوباره محاسبه کنی.</b><br>` + msg;
      res.style.display='block'; res.innerHTML = msg;
    });
  }

  // Quiz page (quiz.html) handled in that file by its own script or by functions exported globally
});

/* Exported helpers (optional) */
window.App = {
  drawVector: function(xId,yId,stageId,answerId){
    const x = Number(document.getElementById(xId).value || 0), y = Number(document.getElementById(yId).value || 0);
    const stage = document.getElementById(stageId); stage.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 320 160'); svg.setAttribute('width','100%');
    const cx = 60, cy = 120, scale = 14;
    const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',10); ax.setAttribute('y1',cy); ax.setAttribute('x2',310); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); svg.appendChild(ax);
    const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); svg.appendChild(ay);
    const x2 = cx + x*scale, y2 = cy - y*scale;
    const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#7c3aed'); vec.setAttribute('stroke-width',3); svg.appendChild(vec);
    const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#7c3aed'); svg.appendChild(head);
    const txt = document.createElementNS(ns,'text'); txt.setAttribute('x', x2+8); txt.setAttribute('y', y2-8); txt.setAttribute('font-size',12); txt.setAttribute('fill','#111'); txt.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)} m`; svg.appendChild(txt);
    stage.appendChild(svg);
    const ans = document.getElementById(answerId); if(ans) ans.style.display='block';
  }
};
