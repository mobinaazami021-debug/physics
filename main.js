/* scripts.js — منطق کلی صفحات و آزمون 50 سوالی */

/* helper */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
function on(sel, ev, fn){ const el = $(sel); if(el) el.addEventListener(ev, fn); }

/* ---- Quiz modal (load quiz.json) ---- */
const quizLink = $('#quiz-link');
const quizModal = $('#quiz-modal');
const quizRoot = $('#quiz-root');
const quizClose = $('#quiz-close');
let QUIZ_DATA = [];

async function loadQuizData(){
  try{
    const res = await fetch('data/quiz.json');
    if(!res.ok) throw new Error('quiz.json not found');
    QUIZ_DATA = await res.json();
  }catch(e){
    console.error('بارگذاری سوالات موفق نبود:', e);
    QUIZ_DATA = []; // fallback: empty
  }
}

function renderQuiz(){
  quizRoot.innerHTML = '';
  if(!QUIZ_DATA.length){
    quizRoot.innerHTML = '<p>سوالات بارگذاری نشده‌اند.</p>';
    return;
  }
  // show first 10 preview, but allow navigation; here we show all with immediate feedback per question
  QUIZ_DATA.forEach((q,i)=>{
    const card = document.createElement('div'); card.className='qcard';
    const h = document.createElement('h3'); h.textContent = (i+1) + '. ' + q.q; card.appendChild(h);
    q.opts.forEach((opt, j)=>{
      const o = document.createElement('div'); o.className='option'; o.textContent = opt;
      o.addEventListener('click', ()=>{
        // lock selection, show explanation and correct answer
        card.querySelectorAll('.option').forEach(x=> x.classList.remove('selected'));
        o.classList.add('selected');
        // show feedback
        let fb = card.querySelector('.explanation');
        if(!fb){ fb = document.createElement('div'); fb.className='explanation'; card.appendChild(fb); }
        const correct = q.a;
        const ok = (j === correct);
        fb.innerHTML = `<b>${ok? 'پاسخ درست است ✅' : 'پاسخ نادرست ❌'}</b><br>${q.expl}`;
      });
      card.appendChild(o);
    });
    quizRoot.appendChild(card);
  });

  // scroll to top of modal
  quizModal.scrollTop = 0;
}

/* open/close modal */
quizLink && quizLink.addEventListener('click', async (e)=>{
  e.preventDefault();
  await loadQuizData();
  renderQuiz();
  quizModal.classList.remove('hidden');
});
quizClose && quizClose.addEventListener('click', ()=>{ quizModal.classList.add('hidden'); });

/* ---- Page helpers: add runner/car/rocket where needed ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  // hide all answer boxes initially
  $$('.answer').forEach(el=> el.style.display='none');

  // runner for distance page
  if(document.getElementById('distance-stage') && !document.getElementById('runner')){
    const r = document.createElement('div'); r.id='runner'; r.className='runner'; document.getElementById('distance-stage').appendChild(r);
  }
  // car for speed page
  if(document.getElementById('stage-speed') && !document.getElementById('car')){
    const c = document.createElement('div'); c.id='car'; c.className='car'; document.getElementById('stage-speed').appendChild(c);
  }
  // sim car for games page
  if(document.getElementById('sim-stage') && !document.getElementById('sim-car')){
    const c = document.createElement('div'); c.id='sim-car'; c.className='car'; document.getElementById('sim-stage').appendChild(c);
  }
});

/* ---- Export small functions used in pages (so page-specific scripts can call) ---- */
window.App = {
  /* runner animation: start/stop */
  runnerStart: function(speedInputId){
    const runner = document.getElementById('runner');
    if(!runner) return;
    const stage = document.getElementById('distance-stage');
    const sp = Number(document.getElementById(speedInputId).value || 1.4);
    let left = parseFloat(getComputedStyle(runner).left || '-80');
    if(isNaN(left)) left = -80;
    const timer = setInterval(()=>{
      left += sp * 2.4;
      runner.style.left = left + 'px';
      if(left > stage.clientWidth + 120){ clearInterval(timer); runner.style.left='-80px'; }
    }, 28);
    return timer;
  },

  runnerControl: function(startBtnId, stopBtnId, speedInputId){
    let t=null;
    const start = document.getElementById(startBtnId), stop = document.getElementById(stopBtnId);
    if(start) start.addEventListener('click', ()=>{ if(t) clearInterval(t); t = App.runnerStart(speedInputId); });
    if(stop) stop.addEventListener('click', ()=>{ if(t) clearInterval(t); const r=document.getElementById('runner'); if(r) r.style.left='-80px'; });
  },

  /* draw vector (displacement) */
  drawVector: function(xId,yId,stageId,answerId){
    const x = Number(document.getElementById(xId).value||0), y = Number(document.getElementById(yId).value||0);
    const stage = document.getElementById(stageId); stage.innerHTML='';
    const ns='http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 320 160'); svg.setAttribute('width','100%');
    const cx=80, cy=120, scale=14;
    const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',20); ax.setAttribute('y1',cy); ax.setAttribute('x2',300); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); svg.appendChild(ax);
    const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); svg.appendChild(ay);
    const x2 = cx + x*scale, y2 = cy - y*scale;
    const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#7c3aed'); vec.setAttribute('stroke-width',3); svg.appendChild(vec);
    const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#7c3aed'); svg.appendChild(head);
    const txt = document.createElementNS(ns,'text'); txt.setAttribute('x', x2+8); txt.setAttribute('y', y2-8); txt.setAttribute('font-size',12); txt.setAttribute('fill','#111'); txt.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)} m`; svg.appendChild(txt);
    stage.appendChild(svg);
    const ans = document.getElementById(answerId); if(ans) ans.style.display='block';
  },

  /* simulator (games) */
  simRun: function(){
    const car = document.getElementById('sim-car'), stage = document.getElementById('sim-stage'), res = document.getElementById('sim-result');
    if(!car || !stage) return;
    const v0 = Number(document.getElementById('sim-v0').value)||0;
    const a = Number(document.getElementById('sim-a').value)||0;
    const tTarget = Number(document.getElementById('sim-t').value)||1;
    let t=0;
    car.style.left='-140px';
    const anim = setInterval(()=>{
      t += 0.02;
      const s = v0*t + 0.5*a*t*t;
      car.style.left = Math.min(stage.clientWidth - 40, s * 6) + 'px';
      if(t >= tTarget){ clearInterval(anim); /* done */ }
    }, 20);
  },

  simCheck: function(){
    const v0 = Number(document.getElementById('sim-v0').value)||0;
    const a = Number(document.getElementById('sim-a').value)||0;
    const tTarget = Number(document.getElementById('sim-t').value)||0;
    const trueV = (v0 + a * tTarget);
    const trueS = (v0 * tTarget + 0.5 * a * tTarget * tTarget);
    const userV = Number(document.getElementById('sim-v-ans').value);
    const userS = Number(document.getElementById('sim-s-ans').value);
    const vOk = Math.abs(userV - trueV) < Math.max(0.05, Math.abs(trueV)*0.03);
    const sOk = Math.abs(userS - trueS) < Math.max(0.1, Math.abs(trueS)*0.03);
    let msg = '';
    msg += `مقدار درست: v(t) = ${trueV.toFixed(3)} m/s — s(t) = ${trueS.toFixed(3)} m\n`;
    msg += `پاسخ شما: v = ${userV} m/s — s = ${userS} m\n`;
    if(vOk && sOk) msg = `<b>عالی!</b><br>` + msg;
    else msg = `<b>اشتباه—موارد نزدیک به درست با خطای کمتر از 3٪ پذیرفته می‌شود.</b><br>` + msg;
    const res = document.getElementById('sim-result');
    if(res){ res.style.display='block'; res.innerHTML = msg.replace(/\n/g,'<br>'); }
  }
};
