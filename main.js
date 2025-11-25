/* main.js — کنترل صفحات، انیمیشن کارتونی سطح 3، و آزمون حرفه‌ای */
/* هدف: کار در موبایل و دسکتاپ، خطاگیری کم، بدون وابستگی به لایبرری خارجی */

/* helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
function on(sel, ev, fn){ const el = $(sel); if(el) el.addEventListener(ev, fn); }
function create(tag, attrs = {}){ const el = document.createElement(tag); Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v)); return el; }

/* navigation */
$$('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.show;
    if(!id) return;
    $$('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    if(page) page.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  });
});

/* ensure home visible on load */
document.addEventListener('DOMContentLoaded', ()=> {
  $$('.page').forEach(p=>p.classList.remove('active'));
  $('#home').classList.add('active');
});

/* ================= BIKE animation (concept) ================= */
(function(){
  const bike = $('#bike'); // svg element
  const btnStart = $('#bike-start-c'), btnStop = $('#bike-stop-c'), speedRange = $('#bike-speed-c'), mode = $('#bike-mode-c');
  if(!bike) return;
  let timer = null;
  function reset(){
    bike.style.transform = 'translateX(-260px)';
    bike.style.transition = 'none';
    bike.querySelectorAll('.wheel').forEach(w=> w.style.transform = 'rotate(0deg)');
    const ped = bike.querySelector('#pedal');
    if(ped) ped.setAttribute('transform','translate(230,110)');
  }
  reset();
  function start(){
    if(timer) clearInterval(timer);
    let left = -260;
    let sp = parseFloat(speedRange.value || 1.2);
    timer = setInterval(()=>{
      if(mode.value === 'accelerate') sp = Math.min(4, sp + 0.02);
      left += sp * 2.4;
      bike.style.transform = `translateX(${left}px)`;
      const rot = left * 3;
      bike.querySelectorAll('.wheel').forEach(w=> w.style.transform = `rotate(${rot}deg)`);
      const ped = bike.querySelector('#pedal');
      if(ped) ped.setAttribute('transform', `translate(230,110) rotate(${rot*1.6})`);
      if(left > 900){ clearInterval(timer); timer = null; reset(); }
    }, 30);
  }
  btnStart && btnStart.addEventListener('click', start);
  btnStop && btnStop.addEventListener('click', ()=>{ if(timer) clearInterval(timer); timer=null; reset(); });
})();

/* ================= RUNNER (distance) ================= */
(function(){
  const runner = $('#runner-char'), startBtn = $('#run-start-c'), stopBtn = $('#run-stop-c'), spRange = $('#run-speed-c');
  if(!runner) return;
  let t = null;
  function reset(){ runner.style.left = '-80px'; }
  reset();
  function start(){
    if(t) clearInterval(t);
    const stage = $('#stage-distance');
    let left = -80;
    let sp = parseFloat(spRange.value || 1.4);
    t = setInterval(()=>{
      left += sp * 2.2;
      runner.style.left = left + 'px';
      if(left > (stage.clientWidth + 120)){ clearInterval(t); t=null; reset(); }
    }, 28);
  }
  startBtn && startBtn.addEventListener('click', start);
  stopBtn && stopBtn.addEventListener('click', ()=>{ if(t) clearInterval(t); t=null; reset(); });
})();

/* ================= VECTOR DRAW (displacement) ================= */
(function(){
  const drawBtn = $('#vec-draw-c'), vx = $('#vec-x-c'), vy = $('#vec-y-c'), stage = $('#vec-stage-c'), ans = $('#vec-answer-c');
  if(!drawBtn) return;
  function draw(){
    const x = Number(vx.value||0), y = Number(vy.value||0);
    stage.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 320 160'); svg.setAttribute('width','100%');
    const cx = 80, cy = 120, scale = 14;
    const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',20); ax.setAttribute('y1',cy); ax.setAttribute('x2',300); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); svg.appendChild(ax);
    const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); svg.appendChild(ay);
    const x2 = cx + x*scale, y2 = cy - y*scale;
    const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#0b74b2'); vec.setAttribute('stroke-width',3); svg.appendChild(vec);
    const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#0b74b2'); svg.appendChild(head);
    const text = document.createElementNS(ns,'text'); text.setAttribute('x', x2+8); text.setAttribute('y', y2-8); text.setAttribute('font-size',12); text.setAttribute('fill','#111'); text.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)}`; svg.appendChild(text);
    stage.appendChild(svg);
    if(ans) ans.style.display = 'block';
  }
  drawBtn.addEventListener('click', draw);
  draw();
})();

/* ================= CAR (speed) ================= */
(function(){
  const car = $('#car-char'), startBtn = $('#car-start-c'), stopBtn = $('#car-stop-c'), mode = $('#car-mode-c'), spRange = $('#car-speed-c');
  if(!car) return;
  let t = null;
  function reset(){ car.style.left = '-160px'; }
  reset();
  function start(){
    if(t) clearInterval(t);
    const stage = $('#stage-speed');
    let left = -160;
    let sp = Number(spRange.value || 1.8);
    t = setInterval(()=>{
      if(mode.value === 'variable') sp = Math.min(8, sp + 0.08);
      left += sp * 2.6;
      car.style.left = left + 'px';
      if(left > stage.clientWidth + 160){ clearInterval(t); t=null; reset(); }
    }, 28);
  }
  startBtn && startBtn.addEventListener('click', start);
  stopBtn && stopBtn.addEventListener('click', ()=>{ if(t) clearInterval(t); t=null; reset(); });
})();

/* ================= ROCKET (acceleration) ================= */
(function(){
  const rocket = $('#rocket-char'), startBtn = $('#acc-start-c'), stopBtn = $('#acc-stop-c'), slider = $('#acc-slider-c');
  if(!rocket) return;
  let t = null;
  function reset(){ rocket.style.transform = 'translateY(0px)'; }
  reset();
  function start(){
    if(t) clearInterval(t);
    let v = 1;
    t = setInterval(()=>{
      v += Number(slider.value)/80;
      const up = Math.min(220, v*40);
      rocket.style.transform = `translateY(${-up}px)`;
      if(up >= 220){ clearInterval(t); t=null; reset(); }
    }, 120);
  }
  startBtn && startBtn.addEventListener('click', start);
  stopBtn && stopBtn.addEventListener('click', ()=>{ if(t) clearInterval(t); t=null; reset(); });
})();

/* ================= SIMPLE CHECKERS (exercises) ================= */
(function(){
  // concept q1
  on('#q1-check','click', ()=>{
    const v = $('#q1').value.trim();
    if(v === 'ساکن' || v === 'ساکن.') show('#q1-answer');
    else alert('جواب درست: ساکن');
  });

  // distance
  on('#dist-check','click', ()=>{
    const s = $('#dist-s').value.trim(), d = $('#dist-d').value.trim();
    if(s === '7' && (d === '3' || d === '۳')) show('#dist-answer'); else alert('پاسخ: مسافت=7 , جابه‌جایی=3');
  });

  // speed
  on('#speed-check-c','click', ()=>{
    const v = $('#speed-input-c').value.trim();
    if(v === '2' || v === '۲') show('#speed-answer-c'); else alert('پاسخ صحیح: 2 m/s');
  });

  // avginst
  on('#ai-check-c','click', ()=>{
    const v = $('#ai-input-c').value.trim();
    if(v === '3' || v === '۳') show('#ai-answer-c'); else alert('مقدار درست: 3 m/s (مثال مقایسه‌ای)');
  });
})();

/* ================= QUIZ (professional) ================= */
(function(){
  const container = $('#quiz-container'), submit = $('#quiz-submit'), clearBtn = $('#quiz-clear'), result = $('#quiz-result');

  const bank = [
    {q:'تعریف حرکت چیست؟', opts:['تغییر شکل','تغییر مکان نسبت به ناظر','تغییر رنگ','تغییر دما'], a:1},
    {q:'مسافت چیست؟', opts:['فاصلهٔ مستقیم','مجموع طول مسیر','شیب نمودار','کمیت برداری'], a:1},
    {q:'جابه‌جایی چیست؟', opts:['مقدار بدون جهت','فاصلهٔ مستقیم با جهت','زمان','جرم'], a:1},
    {q:'تندی متوسط چگونه محاسبه می‌شود؟', opts:['S/t','Δr/Δt','dv/dt','v·t'], a:0},
    {q:'تندی لحظه‌ای یعنی؟', opts:['میانگین بر بازه','مقدار در یک لحظه','جمع سرعت‌ها','تفاضل زمان‌ها'], a:1},
    {q:'v = v₀ + a·t برای چه وضعیتی؟', opts:['شتاب ثابت','حرکت یکنواخت','حرکت دایره‌ای','حرکت نوسانی'], a:0},
    {q:'s = v₀·t + 1/2 a t² کاربردش چیست؟', opts:['محاسبه شتاب','محاسبه مکان (جابه‌جایی)','محاسبه زمان','محاسبه جرم'], a:1},
    {q:'اگر جسم 5m جلو و 2m عقب برود، جابه‌جایی؟', opts:['7m','3m','-3m','0m'], a:1},
    {q:'سطح زیر منحنی v–t چه چیزی را نشان می‌دهد؟', opts:['شتاب','جابه‌جایی','تندی','زمان'], a:1},
    {q:'در حرکت یکنواخت شتاب؟', opts:['۰','مثبت','منفی','متغیر'], a:0},
    // ... (می‌توانی این لیست را بزرگتر کنی؛ الان 10+ سوال پایه‌ای است)
  ];

  function render(){
    container.innerHTML = '';
    bank.forEach((item, idx)=>{
      const card = create('div'); card.className = 'qcard';
      const h = create('h3'); h.textContent = (idx+1) + '. ' + item.q; card.appendChild(h);
      item.opts.forEach((op, j)=>{
        const o = create('div'); o.className='option'; o.textContent = op;
        o.addEventListener('click', ()=> {
          card.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
          o.classList.add('selected');
        });
        card.appendChild(o);
      });
      container.appendChild(card);
    });

    // restore saved
    const saved = JSON.parse(localStorage.getItem('physics_quiz_v3') || 'null');
    if(saved && Array.isArray(saved)){
      saved.forEach((s, i)=>{
        const card = container.children[i];
        if(card && s !== null){
          const opts = card.querySelectorAll('.option');
          if(opts[s]) opts[s].classList.add('selected');
        }
      });
    }
  }
  render();

  submit.addEventListener('click', ()=>{
    const answers = [];
    container.querySelectorAll('.qcard').forEach((card, i)=>{
      const sel = card.querySelector('.option.selected');
      answers.push(sel ? Array.from(card.querySelectorAll('.option')).indexOf(sel) : null);
    });
    localStorage.setItem('physics_quiz_v3', JSON.stringify(answers));
    // grade
    let score = 0;
    answers.forEach((a, i)=>{ if(a !== null && a === bank[i].a) score++; });
    const pct = (score / bank.length * 100).toFixed(1);
    result.innerHTML = `<div>امتیاز: ${score} / ${bank.length} — ${pct}%</div>`;

    const fb = create('div'); fb.className='card';
    fb.innerHTML = '<h3>بازخورد</h3>';
    bank.forEach((q,i)=>{
      const p = create('p');
      const user = answers[i] === null ? 'بدون پاسخ' : q.opts[answers[i]];
      p.innerHTML = `<b>سوال ${i+1}:</b> پاسخ شما: <i>${user}</i> — پاسخ صحیح: <i>${q.opts[q.a]}</i>`;
      fb.appendChild(p);
    });
    result.appendChild(fb);
    window.scrollTo({top:result.offsetTop - 80, behavior:'smooth'});
  });

  clearBtn.addEventListener('click', ()=>{
    if(confirm('پاک کردن پاسخ‌ها؟')){
      localStorage.removeItem('physics_quiz_v3');
      render();
      result.innerHTML = '';
    }
  });

})();

/* simple show helper */
function show(sel){ const e = document.querySelector(sel); if(e) e.style.display = 'block'; }
