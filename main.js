/* main.js — orchestrates pages, animations & quiz (no external libs) */
document.addEventListener('DOMContentLoaded', ()=>{

  const page = document.body.dataset.page || 'index';
  // common helpers
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  /* ------------------ PAGE: motion (مفهوم حرکت) ------------------ */
  if(page==='motion'){
    // Bike SVG animation controlled by speed & pause
    const bike = $('#bike-svg');
    const startBtn = $('#bike-start');
    const speedRange = $('#bike-speed');
    const stopBtn = $('#bike-stop');

    let bikeAnim = null;
    function setBikeSpeed(v){
      // v: 0.5 .. 3
      bike.style.setProperty('--bike-speed', v);
    }
    startBtn?.addEventListener('click', ()=>{
      bike.classList.add('moving');
    });
    stopBtn?.addEventListener('click', ()=> bike.classList.remove('moving'));
    speedRange?.addEventListener('input', (e)=> setBikeSpeed(e.target.value));
    setBikeSpeed(speedRange?.value || 1.2);

    // question check
    $('#q-m1')?.addEventListener('click', ()=>{
      const ans = $('#ans-m1'); ans.style.display='block';
    });
  }

  /* ------------------ PAGE: distance (مسافت) ------------------ */
  if(page==='distance'){
    const runner = $('#runner');
    const runBtn = $('#run-start');
    const speed = $('#run-speed');
    const reset = $('#run-reset');
    function setRunnerSpeed(v){ runner.style.setProperty('--run-speed', v); }
    runBtn?.addEventListener('click', ()=> runner.classList.add('run'));
    reset?.addEventListener('click', ()=> runner.classList.remove('run'));
    speed?.addEventListener('input', ()=> setRunnerSpeed(speed.value));
    setRunnerSpeed(1);

    $('#check-distance')?.addEventListener('click', ()=>{
      const a = $('#input-dist-a').value.trim(), b = $('#input-dist-b').value.trim();
      if(a==='7' && (b==='3' || b==='۳')) $('#ans-dist').style.display='block';
      else alert('پاسخ را بررسی کنید.');
    });
  }

  /* ------------------ PAGE: displacement (جابه‌جایی) ------------------ */
  if(page==='displacement'){
    // draw vector with SVG using inputs
    const vx = $('#vx'), vy = $('#vy'), drawBtn = $('#draw-vec'), svg = $('#vec-svg');
    function drawVector(){
      const x = Number(vx.value||0), y = Number(vy.value||0);
      const cx = 60, cy = 120, scale = 12;
      const x2 = cx + x*scale, y2 = cy - y*scale;
      svg.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const s = document.createElementNS(ns,'svg');
      s.setAttribute('viewBox','0 0 300 160'); s.setAttribute('width','100%');
      // axes
      const ax = document.createElementNS(ns,'line'); ax.setAttribute('x1',20); ax.setAttribute('y1',cy); ax.setAttribute('x2',280); ax.setAttribute('y2',cy); ax.setAttribute('stroke','#ddd');
      s.appendChild(ax);
      const ay = document.createElementNS(ns,'line'); ay.setAttribute('x1',60); ay.setAttribute('y1',10); ay.setAttribute('x2',60); ay.setAttribute('y2',150); ay.setAttribute('stroke','#ddd');
      s.appendChild(ay);
      // vector
      const vec = document.createElementNS(ns,'line'); vec.setAttribute('x1',cx); vec.setAttribute('y1',cy); vec.setAttribute('x2',x2); vec.setAttribute('y2',y2); vec.setAttribute('stroke','#0b74b2'); vec.setAttribute('stroke-width',3); s.appendChild(vec);
      // arrow head
      const marker = document.createElementNS(ns,'polygon'); marker.setAttribute('points',`${x2},${y2} ${x2-7},${y2-4} ${x2-7},${y2+4}`); marker.setAttribute('fill','#0b74b2'); s.appendChild(marker);
      // magnitude text
      const mag = Math.sqrt(x*x + y*y).toFixed(2);
      const txt = document.createElementNS(ns,'text'); txt.setAttribute('x', x2+8); txt.setAttribute('y', y2-8); txt.setAttribute('font-size',12); txt.setAttribute('fill','#111'); txt.textContent=`|r|=${mag}`;
      s.appendChild(txt);
      svg.appendChild(s);
    }
    drawBtn?.addEventListener('click', drawVector);
    drawVector();
  }

  /* ------------------ PAGE: speed_velocity (سرعت و سرعت متوسط) ------------------ */
  if(page==='speed'){
    // Car animation with adjustable speed and mode (uniform / variable)
    const car = $('#car'); const start = $('#car-start'); const stop = $('#car-stop'); const speed = $('#car-speed'); const mode = $('#car-mode');
    let carTicker = null;
    function setCarSpeed(v){ car.style.setProperty('--car-speed', v); }
    start?.addEventListener('click', ()=>{
      car.classList.add('drive');
      if(mode.value==='variable'){ // accelerate gradually
        let sp = Number(speed.value);
        carTicker = setInterval(()=>{
          sp = Math.min(6, sp + 0.15);
          setCarSpeed(sp);
          speed.value = sp.toFixed(2);
        }, 300);
      }
    });
    stop?.addEventListener('click', ()=>{ car.classList.remove('drive'); clearInterval(carTicker); carTicker=null; });
    speed?.addEventListener('input', ()=> setCarSpeed(speed.value));
    setCarSpeed(1.8);

    $('#check-speed')?.addEventListener('click', ()=>{
      const ans = $('#input-speed').value.trim();
      if(ans==='2' || ans==='۲') $('#ans-speed').style.display='block';
      else alert('پاسخ را بازبینی کنید (20 / 10)');
    });
  }

  /* ------------------ PAGE: acceleration (شتاب) ------------------ */
  if(page==='acceleration'){
    const rocket = $('#rocket'); const start = $('#acc-start'); const stop = $('#acc-stop'); const accel = $('#acc-value');
    let accTimer = null;
    start?.addEventListener('click', ()=>{
      rocket.classList.add('fly');
      let v = 1; // base speed
      accTimer = setInterval(()=>{
        v += Number(accel.value)/50;
        rocket.style.setProperty('--rocket-speed', v);
      }, 120);
    });
    stop?.addEventListener('click', ()=>{ rocket.classList.remove('fly'); clearInterval(accTimer); accTimer=null; rocket.style.setProperty('--rocket-speed',1); });
  }

  /* ------------------ PAGE: graphs (نمودارها) ------------------ */
  if(page==='graphs'){
    // simple plotting on canvas for x-t and v-t (synthetic sample)
    const canvas = $('#graph-canvas'); const ctx = canvas?.getContext('2d');
    function draw(type){
      if(!ctx) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle='#ddd';
      for(let x=0;x<canvas.width;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
      for(let y=0;y<canvas.height;y+=30){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
      ctx.strokeStyle='#0b74b2'; ctx.lineWidth=2;
      ctx.beginPath();
      if(type==='uniform'){ ctx.moveTo(10,canvas.height-30); ctx.lineTo(canvas.width-10,canvas.height-120); ctx.stroke(); ctx.fillText('x–t: یکنواخت',20,20);}
      if(type==='rest'){ ctx.moveTo(10,canvas.height-80); ctx.lineTo(canvas.width-10,canvas.height-80); ctx.stroke(); ctx.fillText('x–t: سکون',20,20);}
      if(type==='acc'){ ctx.moveTo(10,canvas.height-30); for(let t=0;t<canvas.width-20;t++){ ctx.lineTo(10+t, canvas.height-30 - 0.02*t*t); } ctx.stroke(); ctx.fillText('x–t: شتاب',20,20);}
    }
    $('#graph-uniform')?.addEventListener('click', ()=> draw('uniform'));
    $('#graph-rest')?.addEventListener('click', ()=> draw('rest'));
    $('#graph-acc')?.addEventListener('click', ()=> draw('acc'));
    draw('uniform');
  }

  /* ------------------ PAGE: final_quiz (آزمون حرفه‌ای) ------------------ */
  if(page==='quiz'){
    // questions array (covers whole chapter deeply)
    const questions = [
      {q:'تعریف جابه‌جایی را انتخاب کنید:', opts:['طول کل مسیر طی‌شده','فاصلهٔ مستقیم بین ابتدا و انتها (با جهت)','شیب نمودار x–t','واحد سرعت'], a:1},
      {q:'اگر جسمی در 10s ، 50m طی کند، سرعت متوسط آن؟', opts:['5 m/s','0.2 m/s','50 m/s','500 m/s'], a:0},
      {q:'در نمودار x–t خط افقی نشان‌دهنده چیست؟', opts:['سکون','شتاب مثبت','سرعت ثابت','حرکت معکوس'], a:0},
      {q:'کدامیک بردار است؟', opts:['مسافت','جابه‌جایی','زمان','واحد مسافت'], a:1},
      {q:'شتاب چیست؟', opts:['تغییر مکان در واحد زمان','تغییر سرعت در واحد زمان','مقدار فاصله','واحد نمودار'], a:1},
      // add more to deeply cover topics
      {q:'اگر دو جسم مسیر متفاوتی رفتند ولی جابه‌جایی‌شان برابر بود، دربارهٔ مسافت آنها چه می‌توان گفت؟', opts:['مسافت‌ها برابرند','مسافت‌ها ممکن است متفاوت باشند','هماهنگ‌اند','هیچ‌کدام'], a:1},
      {q:'سطح زیر منحنی v–t نمایانگر چیست؟', opts:['شتاب','نقطهٔ تعادل','جابه‌جایی','انرژی'], a:2},
      {q:'حرکت یکنواخت شتاب دارد یا خیر؟', opts:['بله','خیر','فقط در برخی روزها','نامشخص'], a:1}
    ];

    const container = $('#quiz-container'); const submit = $('#quiz-submit'); const result = $('#quiz-result');
    function render(){
      container.innerHTML = '';
      questions.forEach((q,i)=>{
        const div = document.createElement('div'); div.className='card';
        const h = document.createElement('h3'); h.textContent = `${i+1}. ${q.q}`; div.appendChild(h);
        q.opts.forEach((opt,j)=>{
          const op = document.createElement('div'); op.className='option'; op.textContent = opt; op.dataset.q=i; op.dataset.opt=j;
          op.addEventListener('click', ()=> {
            // deselect others
            div.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
            op.classList.add('selected');
          });
          div.appendChild(op);
        });
        container.appendChild(div);
      });
      // restore previous if any
      const saved = JSON.parse(localStorage.getItem('physics_quiz_answers')||'null');
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
      // save to localStorage
      localStorage.setItem('physics_quiz_answers', JSON.stringify(answers));
      // grading
      let score = 0; let total = questions.length;
      answers.forEach((a,i)=>{ if(a!==null && a===questions[i].a) score+=1; });
      result.innerHTML = `<div class="score">امتیاز شما: ${score} / ${total} — درصد: ${(score/total*100).toFixed(1)}%</div>`;
      // provide detailed feedback
      const feedback = document.createElement('div');
      feedback.className='card';
      feedback.innerHTML = '<h3>بازخورد سوالی</h3>';
      questions.forEach((q,i)=>{
        const p = document.createElement('p');
        const correct = q.opts[q.a];
        const user = answers[i]===null ? 'پاسخ داده نشده' : q.opts[answers[i]];
        p.innerHTML = `<b>سوال ${i+1}:</b> پاسخ شما: <i>${user}</i> — پاسخ صحیح: <i>${correct}</i>`;
        feedback.appendChild(p);
      });
      result.appendChild(feedback);
    });
  }

});
