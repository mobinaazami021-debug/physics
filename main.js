/* main.js — کنترل صفحات، انیمیشن سطح 3 و آزمون حرفه‌ای
   ساختار: هر صفحه داده شده در body[data-page] اجرا میشود.  */
document.addEventListener('DOMContentLoaded', ()=>{

  const page = document.body.dataset.page || 'index';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  /* -------------------- common helpers -------------------- */
  function show(el){ if(!el) return; el.style.display='block'; }
  function hide(el){ if(!el) return; el.style.display='none'; }
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

  /* -------------------- PAGE: motion (مفهوم حرکت) -------------------- */
  if(page==='motion'){
    // Bike: moving class toggles CSS-based transition animation.
    const bike = $('#bike-svg');
    const startBtn = $('#bike-start'), stopBtn = $('#bike-stop'), speedRange = $('#bike-speed'), modeSelect = $('#bike-mode'), checkBtn = $('#check-m1'), ansBox = $('#ans-m1');

    function setBikeSpeed(v){
      bike.style.setProperty('--bike-speed', v);
      // adjust wheel & pedal animation duration via CSS variable (used inline)
    }
    startBtn?.addEventListener('click', ()=>{
      const mode = modeSelect.value;
      if(mode==='pause'){ bike.classList.remove('moving'); show($('.warn-motion')||{}); return; }
      hide($('.warn-motion')||{});
      bike.classList.add('moving');
      if(mode==='accelerate'){ // ramp up speed progressively
        let s = parseFloat(speedRange.value || 1.2);
        let t = 0;
        const id = setInterval(()=>{
          t++; s = clamp(s + 0.08, 0.6, 4);
          setBikeSpeed(s);
          if(t>30){ clearInterval(id); }
        }, 200);
      }
    });
    stopBtn?.addEventListener('click', ()=> bike.classList.remove('moving'));
    speedRange?.addEventListener('input', (e)=> setBikeSpeed(e.target.value));
    setBikeSpeed(speedRange?.value || 1.2);

    checkBtn?.addEventListener('click', ()=>{
      const user = $('#q-m1').value.trim();
      if(user==='2.4' || user==='2.4 m/s' || user==='2.4m/s') show(ansBox); else alert('پاسخ را بررسی کن — فرمول: v = v0 + a·t');
    });
  }

  /* -------------------- PAGE: distance -------------------- */
  if(page==='distance'){
    const runner = $('#runner');
    const startB = $('#run-start'), resetB = $('#run-reset'), speedRange = $('#run-speed');
    const answer = $('#ans-dist'), checkBtn = $('#check-distance');
    function setRunnerSpeed(v){ runner.style.setProperty('--run-speed', v); }
    startB?.addEventListener('click', ()=> runner.classList.add('run'));
    resetB?.addEventListener('click', ()=> runner.classList.remove('run'));
    speedRange?.addEventListener('input', ()=> setRunnerSpeed(speedRange.value));
    setRunnerSpeed(1.4);

    checkBtn?.addEventListener('click', ()=>{
      const a = $('#input-dist-a').value.trim(), b = $('#input-dist-b').value.trim();
      if(a==='7' && (b==='3' || b==='۳')) show(answer); else alert('پاسخ را بازبینی کنید.');
    });
  }

  /* -------------------- PAGE: displacement -------------------- */
  if(page==='displacement'){
    const vx = $('#vx'), vy = $('#vy'), drawBtn = $('#draw-vec'), svgWrap = $('#vec-svg');
    function drawVector(){
      const x = Number(vx.value||0), y = Number(vy.value||0);
      const cx = 80, cy = 120, scale = 14;
      const x2 = cx + x*scale, y2 = cy - y*scale;
      svgWrap.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const s = document.createElementNS(ns,'svg'); s.setAttribute('viewBox','0 0 320 160'); s.setAttribute('width','100%');
      const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',20); ax.setAttribute('y1',cy); ax.setAttribute('x2',300); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#eee'); s.appendChild(ax);
      const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',cx); ay.setAttribute('y1',10); ay.setAttribute('x2',cx); ay.setAttribute('y2',150); ay.setAttribute('stroke','#eee'); s.appendChild(ay);
      const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#0b74b2'); vec.setAttribute('stroke-width',3); s.appendChild(vec);
      const head = document.createElementNS(ns,'polygon'); head.setAttribute('points',`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`); head.setAttribute('fill','#0b74b2'); s.appendChild(head);
      const text = document.createElementNS(ns,'text'); text.setAttribute('x',x2+10); text.setAttribute('y',y2-8); text.setAttribute('font-size',12); text.setAttribute('fill','#111'); text.textContent = `|r|=${Math.sqrt(x*x + y*y).toFixed(2)}`; s.appendChild(text);
      svgWrap.appendChild(s);
    }
    drawBtn?.addEventListener('click', drawVector);
    drawVector();
  }

  /* -------------------- PAGE: speed (سرعت) -------------------- */
  if(page==='speed'){
    const car = $('#car'), start = $('#car-start'), stop = $('#car-stop'), speedInput = $('#car-speed'), mode = $('#car-mode'), checkBtn = $('#check-speed'), ans = $('#ans-speed');
    let ticker = null;
    function setCarSpeed(v){ car.style.setProperty('--car-speed', v); }
    start?.addEventListener('click', ()=>{
      car.classList.add('drive');
      if(mode.value==='variable'){
        let s = Number(speedInput.value);
        ticker = setInterval(()=>{ s = clamp(s + 0.2, 0.6, 7); setCarSpeed(s); speedInput.value = s.toFixed(1); }, 280);
      }
    });
    stop?.addEventListener('click', ()=>{ car.classList.remove('drive'); clearInterval(ticker); ticker=null; });
    speedInput?.addEventListener('input', ()=> setCarSpeed(speedInput.value));
    setCarSpeed(1.8);

    checkBtn?.addEventListener('click', ()=>{
      const v = $('#input-speed').value.trim();
      if(v==='2' || v==='۲') show(ans); else alert('پاسخ اشتباه است — 20 ÷ 10 = 2');
    });
  }

  /* -------------------- PAGE: acceleration -------------------- */
  if(page==='acceleration'){
    const rocket = $('#rocket'), start = $('#acc-start'), stop = $('#acc-stop'), accInput = $('#acc-value');
    let accInterval = null;
    start?.addEventListener('click', ()=>{
      rocket.classList.add('fly');
      let base = 1;
      accInterval = setInterval(()=>{ base += Number(accInput.value)/60; rocket.style.setProperty('--rocket-speed', base.toFixed(2)); }, 140);
    });
    stop?.addEventListener('click', ()=>{ rocket.classList.remove('fly'); clearInterval(accInterval); accInterval=null; rocket.style.setProperty('--rocket-speed',1); });
  }

  /* -------------------- PAGE: graphs -------------------- */
  if(page==='graphs'){
    const canvas = $('#graph-canvas'); if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function draw(type){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // grid
      ctx.strokeStyle='#f1f4f8'; ctx.lineWidth=1;
      for(let x=0;x<canvas.width;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
      for(let y=0;y<canvas.height;y+=30){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
      // axes
      ctx.strokeStyle='#333'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,canvas.height-20); ctx.lineTo(canvas.width-10,canvas.height-20); ctx.stroke();
      ctx.lineWidth=2.4; ctx.strokeStyle='#0b74b2'; ctx.beginPath();
      if(type==='uniform'){ ctx.moveTo(40,canvas.height-40); ctx.lineTo(canvas.width-10,canvas.height-120); ctx.stroke(); ctx.fillText('x–t: یکنواخت', 80, 20); }
      if(type==='rest'){ ctx.moveTo(40,canvas.height-80); ctx.lineTo(canvas.width-10,canvas.height-80); ctx.stroke(); ctx.fillText('x–t: سکون', 80, 20); }
      if(type==='acc'){ ctx.moveTo(40,canvas.height-40); for(let t=0;t<canvas.width-60;t++){ ctx.lineTo(40+t, canvas.height-40 - 0.02*t*t); } ctx.stroke(); ctx.fillText('x–t: شتاب', 80, 20); }
    }
    $('#graph-uniform')?.addEventListener('click', ()=> draw('uniform'));
    $('#graph-rest')?.addEventListener('click', ()=> draw('rest'));
    $('#graph-acc')?.addEventListener('click', ()=> draw('acc'));
    draw('uniform');
  }

  /* -------------------- PAGE: quiz (آزمون حرفه‌ای) -------------------- */
  if(page==='quiz'){
    // deep set of questions covering full chapter (expandable)
    const questions = [
      {q:'تعریف حرکت چیست؟', opts:['تغییر مکان نسبت به ناظر','تغییر زمان','تغییر جرم','تغییر سرعت'], a:0},
      {q:'مسافت چیست؟', opts:['فقط راستا','مجموع طول مسیر طی‌شده','فاصله مستقیم','شیب نمودار'], a:1},
      {q:'جابه‌جایی چیست؟', opts:['مقدار بدون جهت','فاصلهٔ مستقیم با جهت','سرعت متوسط','شتاب'], a:1},
      {q:'تندی متوسط چگونه محاسبه می‌شود؟', opts:['Δx/Δt','کل مسافت ÷ کل زمان','dv/dt','dx/dt'], a:1},
      {q:'تندی لحظه‌ای چیست؟', opts:['میانگین در بازه','هنگام خاص','نیمه‌کاره','واحد مسافت'], a:1},
      {q:'معادل v = v0 + a·t در چه مفهومی کاربرد دارد؟', opts:['شتاب ثابت','حرکت دورانی','محاسبه مسافت','تنها حرکت یکنواخت'], a:0},
      {q:'اگر جسمی 5m جلو و 2m عقب برود، جابه‌جایی چیست؟', opts:['7m','3m','-3m','0m'], a:1},
      {q:'سطح زیر منحنی v–t نشان‌دهندهٔ چه چیزی است؟', opts:['شتاب','جابه‌جایی','سرعت لحظه‌ای','مسافت'], a:1},
      {q:'حرکت یکنواخت شتاب دارد؟', opts:['خیر','بله','گاهی','نیاز به اطلاعات بیشتر'], a:0},
      {q:'اگر نمودار x–t خطی با شیب ثابت داشته باشیم، چه اتفاقی افتاده؟', opts:['شتاب ثابت','سرعت ثابت','سکون','حرکت چرخشی'], a:1},
      // --- more advanced/deeper questions to fully cover the chapter ---
      {q:'در حرکت با شتاب ثابت، مسئلهٔ s = v0·t + 1/2 a t^2 کدام بخش را محاسبه می‌کند؟', opts:['فقط سرعت','مکان (مسافت طی‌شده)','شتاب','زمان'], a:1},
      {q:'واحد شتاب در SI چیست؟', opts:['m/s','m','m/s^2','s'], a:2},
      {q:'اگر v0=2m/s و a=3 m/s^2، سرعت بعد از 4s چیست؟', opts:['14 m/s','12 m/s','10 m/s','8 m/s'], a:1},
      {q:'جابه‌جایی در حرکت شتاب‌دار چگونه محاسبه می‌شود؟', opts:['v·t','v0·t + 1/2 a t^2','a·t','v^2- v0^2/2a'], a:1},
      {q:'در حرکت دایره‌ای، چه کمیتی همواره جهت‌دار است؟', opts:['سرعت خطی','سرعت زاویه‌ای','جابه‌جایی','نیرو'], a:0}
    ];

    const container = $('#quiz-container'), submit = $('#quiz-submit'), result = $('#quiz-result');
    function render(){
      container.innerHTML = '';
      questions.forEach((q,i)=>{
        const div = document.createElement('div'); div.className='card';
        const h = document.createElement('h3'); h.textContent = `${i+1}. ${q.q}`; div.appendChild(h);
        q.opts.forEach((opt,j)=>{
          const op = document.createElement('div'); op.className='option'; op.textContent = opt; op.dataset.q=i; op.dataset.opt=j;
          op.addEventListener('click', ()=> {
            div.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
            op.classList.add('selected');
          });
          div.appendChild(op);
        });
        container.appendChild(div);
      });
      // load saved
      const saved = JSON.parse(localStorage.getItem('physics_quiz_answers_v1') || 'null');
      if(saved && Array.isArray(saved)){
        saved.forEach((sel, qi)=>{
          const card = container.children[qi];
          if(card && typeof sel==='number'){
            const opts = card.querySelectorAll('.option');
            if(opts[sel]) opts[sel].classList.add('selected');
          }
        });
      }
    }
    render();

    submit?.addEventListener('click', ()=>{
      const answers = [];
      container.querySelectorAll('.card').forEach((card, i)=>{
        const sel = card.querySelector('.option.selected');
        answers.push(sel ? Number(sel.dataset.opt) : null);
      });
      localStorage.setItem('physics_quiz_answers_v1', JSON.stringify(answers));
      // grading
      let score = 0; questions.forEach((q,i)=>{ if(answers[i]!==null && answers[i]===q.a) score++; });
      result.innerHTML = `<div class="score">امتیاز شما: ${score} / ${questions.length} — درصد: ${(score/questions.length*100).toFixed(1)}%</div>`;
      // feedback
      const feedback = document.createElement('div'); feedback.className='card';
      feedback.innerHTML = '<h3>بازخورد سوال به سوال</h3>';
      questions.forEach((q,i)=>{
        const p = document.createElement('p');
        const correct = q.opts[q.a]; const user = answers[i]===null ? 'بدون پاسخ' : q.opts[answers[i]];
        p.innerHTML = `<b>سوال ${i+1}:</b> پاسخ شما: <i>${user}</i> — پاسخ صحیح: <i>${correct}</i>`;
        feedback.appendChild(p);
      });
      result.appendChild(feedback);
      // optionally allow review + reset
      const wrap = document.createElement('div'); wrap.style.marginTop='10px';
      const resetBtn = document.createElement('button'); resetBtn.className='btn ghost'; resetBtn.textContent='پاک کردن پاسخ‌ها';
      resetBtn.addEventListener('click', ()=>{ localStorage.removeItem('physics_quiz_answers_v1'); render(); result.innerHTML=''; });
      wrap.appendChild(resetBtn);
      result.appendChild(wrap);
    });
  }

});
