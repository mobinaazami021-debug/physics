/* ========== مسافت ========== */
function calcDistance() {
    let points = document.getElementById("d-input").value.split(",");
    let sum = 0;

    for (let i = 0; i < points.length; i++) {
        sum += Math.abs(Number(points[i]));
    }

    document.getElementById("d-result").innerText = "مسافت = " + sum + " متر";
}

/* ========== جابه‌جایی ========== */
function calcDisplacement() {
    let start = Number(document.getElementById("ds-start").value);
    let end = Number(document.getElementById("ds-end").value);

    let disp = end - start;
    document.getElementById("ds-result").innerText = "جابه‌جایی = " + disp + " متر";
}

/* ========== تندی متوسط ========== */
function calcAvgSpeed() {
    let d = Number(document.getElementById("as-distance").value);
    let t = Number(document.getElementById("as-time").value);

    if (t <= 0) {
        alert("زمان نمی‌تواند صفر باشد!");
        return;
    }

    document.getElementById("as-result").innerText =
        "تندی متوسط = " + (d / t).toFixed(2) + " m/s";
}

/* ========== سرعت متوسط ========== */
function calcAvgVelocity() {
    let disp = Number(document.getElementById("av-disp").value);
    let t = Number(document.getElementById("av-time").value);

    if (t <= 0) {
        alert("زمان نمی‌تواند صفر باشد!");
        return;
    }

    document.getElementById("av-result").innerText =
        "سرعت متوسط = " + (disp / t).toFixed(2) + " m/s";
}

/* ========== تندی لحظه‌ای ========== */
function instSpeed() {
    let s = Number(document.getElementById("is-s").value);
    document.getElementById("is-result").innerText =
        "تندی لحظه‌ای = " + s + " m/s";
}

/* ========== سرعت لحظه‌ای ========== */
function instVelocity() {
    let v = Number(document.getElementById("iv-v").value);
    document.getElementById("iv-result").innerText =
        "سرعت لحظه‌ای = " + v + " m/s";
}

/* ========== شتاب ========== */
function calcAcceleration() {
    let dv = Number(document.getElementById("acc-dv").value);
    let dt = Number(document.getElementById("acc-dt").value);

    if (dt <= 0) {
        alert("زمان نمی‌تواند صفر باشد!");
        return;
    }

    document.getElementById("acc-result").innerText =
        "شتاب متوسط = " + (dv / dt).toFixed(2) + " m/s²";
}

/* ========== کوییز ۵۹ سؤالی ========== */
let questions = []; // اینجا بعداً جایگذاری می‌کنم اگر گفتی C

let qIndex = 0;

function loadQuestion() {
    document.getElementById("q-text").innerText = questions[qIndex].q;

    document.getElementById("opt1").innerText = questions[qIndex].o1;
    document.getElementById("opt2").innerText = questions[qIndex].o2;
    document.getElementById("opt3").innerText = questions[qIndex].o3;
    document.getElementById("opt4").innerText = questions[qIndex].o4;

    document.querySelectorAll(".option").forEach(o => {
        o.classList.remove("correct", "wrong");
        o.onclick = checkAnswer;
    });
}

function checkAnswer(event) {
    let chosen = event.target.dataset.opt;
    let correct = questions[qIndex].answer;

    if (chosen == correct) {
        event.target.classList.add("correct");
    } else {
        event.target.classList.add("wrong");
    }

    setTimeout(() => {
        qIndex++;
        if (qIndex < questions.length) loadQuestion();
        else alert("پایان آزمون 🎉");
    }, 700);
}
