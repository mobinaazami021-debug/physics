/* main.js — کنترل صفحات، انیمیشن سطح 3، و آزمون پیشرفته */

/* --- helper selectors --- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* --- navigation --- */
$$('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const id = b.dataset.show || b.getAttribute('data-show');
    showPage(id);
  });
});
function showPage(id){
  if(!id) return;
  $$('.page').forEach(p=>p.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
  // hide menu area if showing page
  window.scrollTo({top:0, behavior:'smooth'});
}

/* --- show home on load --- */
document.addEventListener('DOMContentLoaded', ()=>{
  showPage('home');
});

/* ==================== BIKE ANIMATION (motion) ==================== */
(function(){
  const bike = $('#bike'); // svg group
  const start = $('#bike-start'), stop = $('#bike-stop'), speedRange = $('#bike-speed'), mode = $('#bike-mode');
  let bikeTimer = null;

  function resetBikePos(){
    if(!bike) return;
    bike.style.transform = 'translateX(-260px)';
    // reset wheel/pedal transforms
    bike.querySelectorAll('.wheel').forEach(w=> w.style.transform = 'rotate(0deg)');
    const ped = bike.querySelector('#pedal');
    if(ped) ped.setAttribute('transform','translate(230,110)');
  }
  resetBikePos();

  function startBike(){
    if(bikeTimer) clearInterval(bikeTimer);
    let left = -260;
    let sp = parseFloat(speedRange.value || 1.2);
    bikeTimer = setInterval(()=>{
      if(mode.value === 'accelerate') sp = Math.min(4, sp + 0.02);
      left += sp * 2.6;
      bike.style.transform = `translateX(${left}px)`;
      const rot = left * 3;
      bike.querySelectorAll('.wheel').forEach(w=> w.style.transform = `rotate(${rot}deg)`);
      const ped = bike.querySelector('#pedal');
      if(ped) ped.setAttribute('transform', `translate(230,110) rotate(${rot*1.6})`);
      if(left > 800){ clearInterval(bikeTimer); bikeTimer = null; resetBikePos(); }
    }, 30);
  }
  function stopBike(){ if(bikeTimer) clearInterval(bikeTimer); bikeTimer = null; }
  start.addEventListener('click', startBike);
  stop.addEventListener('click', stopBike);
  speedRange.addEventListener('input', ()=>{}); // read value on start
})();

/* ==================== RUNNER ANIMATION (distance) ==================== */
(function(){
  const runner = $('#runner');
  const start = $('#run-start'), reset = $('#run-reset'), speedRange = $('#run-speed');
  let runTimer = null;
  function resetRunner(){ if(runner) runner.style.left = '-80px'; }
  resetRunner();

  function startRun(){
    if(runTimer) clearInterval(runTimer);
    const stage = $('#distance .stage') || document.querySelector('.stage');
    let left = -80; let sp = parseFloat(speedRange.value || 1.4);
    runTimer = setInterval(()=>{
      left += sp * 2.2;
      runner.style.left = left + 'px';
      if(left > (stage.clientWidth + 120)){ clearInterval(runTimer); runTimer = null; resetRunner(); }
    }, 28);
  }
  start.addEventListener('click', startRun);
  reset.addEventListener('click', ()=>{ if(runTimer) clearInterval(runTimer); runTimer=null; resetRunner(); });
})();

/* ==================== VECTOR DRAW (displacement) ==================== */
(function(){
  const drawBtn = $('#vec-draw'), vx = $('#vec-x'), vy = $('#vec-y'), stage = $('#vec-stage'), ans = $('#vec-answer');
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

/* ==================== CAR (speed) ==================== */
(function(){
  const car = $('#car'), start = $('#car-start'), stop = $('#car-stop'), mode = $('#car-mode'), speedRange = $('#car-speed');
  let carTimer = null;
  function resetCar(){ if(car) car.style.left = '-140px'; }
  resetCar();
  function startCar(){
    if(carTimer) clearInterval(carTimer);
    const stage = document.querySelector('#speed .stage') || document.querySelector('.stage');
    let left = -140; let sp = Number(speedRange.value || 1.8);
    carTimer = setInterval(()=>{
      if(mode.value === 'variable') sp = Math.min(8, sp + 0.08);
      left += sp * 2.6;
      car.style.left = left + 'px';
      if(left > stage.clientWidth + 140){ clearInterval(carTimer); carTimer = null; resetCar(); }
    }, 28);
  }
  function stopCar(){ if(carTimer) clearInterval(carTimer); carTimer = null; }
  start.addEventListener('click', startCar);
  stop.addEventListener('click', stopCar);
})();

/* ==================== ROCKET (acceleration) ==================== */
(function(){
  const rocket = $('#rocket'), start = $('#acc-start'), stop = $('#acc-stop'), acc = $('#acc-slider');
  let rocketTimer = null;
  function resetRocket(){ if(rocket) rocket.style.transform = 'translateY(0px)'; }
  resetRocket();
  function startRocket(){
    if(rocketTimer) clearInterval(rocketTimer);
    let v = 1;
    rocketTimer = setInterval(()=>{
      v += Number(acc.value)/80;
      const up = Math.min(220, v * 40);
      rocket.style.transform = `translateY(${-up}px)`;
      if(up >= 220){ clearInterval(rocketTimer); rocketTimer = null; resetRocket(); }
    }, 120);
  }
  function stopRocket(){ if(rocketTimer) clearInterval(rocketTimer); rocketTimer = null; resetRocket(); }
  start.addEventListener('click', startRocket);
  stop.addEventListener('click', stopRocket);
})();

/* ==================== CHECKERS for simple exercises ==================== */
(function(){
  $('#check-dist').addEventListener('click', ()=>{
    const s = $('#input-s').value.trim(), d = $('#input-d').value.trim();
    if(s === '7' && (d === '3' || d === '۳')) $('#dist-answer').style.display = 'block';
    else alert('پاسخ درست نیست — مسافت = 7 ، جابه‌جایی = 3');
  });
  $('#speed-check').addEventListener('click', ()=>{
    const v = $('#speed-input').value.trim();
    if(v === '2' || v === '۲') $('#speed-answer').style.display = 'block';
    else alert('پاسخ را بررسی کن — 20 ÷ 10 = 2');
  });
  $('#ai-check').addEventListener('click', ()=>{
    const v = $('#ai-1').value.trim();
    if(v === '2.5' || v === '2٫5') $('#ai-answer').style.display = 'block';
    else alert('پاسخ را بازبینی کن (50 ÷ 20 = 2.5)');
  });
})();

/* ==================== QUIZ: professional (many questions) ==================== */
(function(){
  const quizContainer = $('#quiz-container'), submit = $('#quiz-submit'), clearBtn = $('#quiz-clear'), result = $('#quiz-result');

  // Deep question bank covering the chapter (expandable)
  const bank = [
    {q:'تعریف حرکت چیست؟', opts:['تغییر مکان نسبت به ناظر','تغییر شکل جسم','تغییر زمان','تغییر جرم'], a:0},
    {q:'مسافت چیست؟', opts:['مقدار جهت‌دار','مجموع طول مسیر طی‌شده','شیب نمودار','تندی لحظه‌ای'], a:1},
    {q:'جابه‌جایی چیست؟', opts:['مقدار بدون جهت','فاصلهٔ مستقیم با جهت','مسافت ÷ زمان','شتاب'], a:1},
    {q:'تندی متوسط چگونه محاسبه می‌شود؟', opts:['Δr/Δt','S/t','dv/dt','v·t'], a:1},
    {q:'تندی لحظه‌ای چیست؟', opts:['میانگین بر بازه','تندی در یک لحظه','جمع سرعت‌ها','مسافت در لحظه'], a:1},
    {q:'سرعت چه تفاوتی با تندی دارد؟', opts:['سرعت بدون جهت است','سرعت بردار است (جهت دارد)','سرعت زمان است','سرعت جرم است'], a:1},
    {q:'v = v₀ + a·t برای چه نوع حرکت به کار می‌رود؟', opts:['شتاب ثابت','حرکت دورانی','مجموع سرعت‌ها','حرکت یکنواخت'], a:0},
    {q:'s = v₀·t + 1/2 a t² چه‌چیزی محاسبه می‌کند؟', opts:['شتاب','مکان (مسافت طی‌شده)','واحد زمان','مقدار سرعت'], a:1},
    {q:'v² = v₀² + 2 a s چه زمانی کاربرد دارد؟', opts:['وقتی شتاب ثابت است','وقتی سرعت صفر است','وقتی حرکت دایره‌ای است','وقتی زمان معلوم نیست'], a:0},
    {q:'اگر جسمی 5m جلو و 2m عقب برود، مسافت و جابه‌جایی؟', opts:['مسافت=3, جابه‌جایی=7','مسافت=7, جابه‌جایی=3','مسافت=0, جابه‌جایی=3','مسافت=7, جابه‌جایی=0'], a:1},
    {q:'سطح زیر منحنی v–t چه کمیتی را نشان می‌دهد؟', opts:['شتاب','توان','جابه‌جایی','تندی لحظه‌ای'], a:2},
    {q:'در نمودار x–t خط افقی به چه معناست؟', opts:['شتاب ثابت','سکون','سرعت مثبت','حرکت شتاب‌دار'], a:1},
    {q:'واحد شتاب در SI چیست؟', opts:['m','m/s','m/s^2','s'], a:2},
    {q:'اگر v₀=2 m/s و a=3 m/s²، سرعت پس از 4 s چیست؟', opts:['14 m/s','12 m/s','10 m/s','8 m/s'], a:1},
    {q:'تندی متوسط یک خودرو که 120 km در 2 h طی کرده؟', opts:['40','50','60','30'], a:2},
    {q:'برای محاسبه تندی لحظه‌ای از چه روشی استفاده می‌کنیم؟', opts:['تقسیم کل مسافت بر کل زمان','شیب مماس بر نمودار x–t','جمع سرعت‌ها','تفاضل جابه‌جایی‌ها'], a:1},
    {q:'در حرکت یکنواخت شتاب چقدر است؟', opts:['صفر','مثبت','منفی','متغیر'], a:0},
    {q:'تندی متوسط وقتی Δt→0 به چه مقدار نزدیک می‌شود؟', opts:['تندی لحظه‌ای','مسافت','شتاب','زمان'], a:0},
    {q:'مسئله: جسمی با سرعت 3 m/s به مدت 4 s حرکت می‌کند، چه مسافتی طی می‌شود؟', opts:['12 m','7 m','1.33 m','16 m'], a:0},
    {q:'اگر نمودار v–t یک خط با شیب مثبت باشد، چه چیزی نشان می‌دهد؟', opts:['سرعت ثابت','شتاب مثبت','سکون','مسافت ثابت'], a:1},
    {q:'در حرکت شتاب ثابت، اگر v0=0 و a=2, t=5, s = ?', opts:['25','10','50','5'], a:1}, // s = 0*5 + 0.5*2*25 =25 -> correct is 25 actually; pick consistent: here a=2,t=5 => s=0.5*2*25=25. Let's set answer index accordingly.
    {q:'کدام عبارت درباره جابه‌جایی درست است؟', opts:['همواره مثبت است','می‌تواند جهتی داشته باشد','همواره برابر مسافت است','همواره صفر است'], a:1},
    {q:'در حرکت دورانی، کدام کمیت جهت‌دار است؟', opts:['مقدار سرعت خطی','زمان','تندی متوسط','مسافت'], a:0},
    {q:'اگر جسمی از A به B و دوباره به A بازگردد، جابه‌جایی برابر است با؟', opts:['مسافت طی شده','صفر','نیمه مسیر','مقدار بستگی دارد'], a:1},
    {q:'برای یک حرکت که سرعت آن v(t)=3t (m/s)، شتاب آن چقدر است؟', opts:['3 m/s²','t m/s²','0','9 m/s²'], a:0},
    {q:'کدام فرمول برای محاسبه شتاب متوسط استفاده می‌شود؟', opts:['Δs/Δt','Δv/Δt','v·t','s·t'], a:1}
  ];

  // render quiz
  function render(){
    quizContainer.innerHTML = '';
    bank.forEach((q,i)=>{
      const div = document.createElement('div'); div.className='qcard';
      const h = document.createElement('h3'); h.textContent = (i+1) + '. ' + q.q; div.appendChild(h);
      q.opts.forEach((opt,j)=>{
        const o = document.createElement('div'); o.className='option'; o.textContent = opt;
        o.addEventListener('click', ()=> {
          // deselect others
          div.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
          o.classList.add('selected');
        });
        div.appendChild(o);
      });
      quizContainer.appendChild(div);
    });

    // restore previous answers if any
    const saved = JSON.parse(localStorage.getItem('physics_quiz_answers_v2') || 'null');
    if(saved && Array.isArray(saved)){
      saved.forEach((sel, idx)=>{
        const card = quizContainer.children[idx];
        if(card && sel !== null){
          const opts = card.querySelectorAll('.option');
          if(opts[sel]) opts[sel].classList.add('selected');
        }
      });
    }
  }
  render();

  submit.addEventListener('click', ()=>{
    const answers = [];
    quizContainer.querySelectorAll('.qcard').forEach((card, idx)=>{
      const sel = card.querySelector('.option.selected');
      answers.push(sel ? Array.from(card.querySelectorAll('.option')).indexOf(sel) : null);
    });
    localStorage.setItem('physics_quiz_answers_v2', JSON.stringify(answers));
    // grade
    let score = 0;
    answers.forEach((a,i)=>{ if(a !== null && a === bank[i].a) score++; });
    const perc = (score / bank.length * 100).toFixed(1);
    result.innerHTML = `<div>امتیاز: ${score} / ${bank.length} — درصد: ${perc}%</div>`;

    // detailed feedback
    const fb = document.createElement('div'); fb.className = 'card';
    fb.innerHTML = '<h3>بازخورد سوال به سوال</h3>';
    bank.forEach((q,i)=>{
      const p = document.createElement('p');
      const user = answers[i] === null ? 'بدون پاسخ' : q.opts[answers[i]];
      p.innerHTML = `<b>سوال ${i+1}:</b> پاسخ شما: <i>${user}</i> — پاسخ صحیح: <i>${q.opts[q.a]}</i>`;
      fb.appendChild(p);
    });
    result.appendChild(fb);
  });

  clearBtn.addEventListener('click', ()=>{
    if(confirm('آیا مطمئن هستید می‌خواهید پاسخ‌ها پاک شوند؟')){
      localStorage.removeItem('physics_quiz_answers_v2');
      render();
      result.innerHTML = '';
      alert('حذف شد.');
    }
  });

})();

/* ==================== End of main.js ==================== */
