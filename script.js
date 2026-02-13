const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const messageBox = document.getElementById("messageBox");
const teaseText = document.getElementById("teaseText");

yesBtn.addEventListener("click", () => {
  messageBox.hidden = false;
  teaseText.textContent = "aku tahu kamu bakal pilih ‘Iya’ 😌💗";
  spawnConfetti(160);
  spawnHearts(22);
  pulse();
});

function pulse(){
  const card = document.querySelector(".card");
  card.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
    { duration: 420, easing: "cubic-bezier(.2,.9,.2,1)" }
  );
}

/* Tombol NO kabur */
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", dodge);

function dodge(){
  const wrap = document.querySelector(".wrap");
  const rectWrap = wrap.getBoundingClientRect();
  const rectBtn = noBtn.getBoundingClientRect();

  // batas aman supaya ga keluar layar
  const pad = 14;

  const maxX = rectWrap.width - rectBtn.width - pad;
  const maxY = rectWrap.height - rectBtn.height - pad;

  const x = Math.random() * maxX + pad;
  const y = Math.random() * maxY + pad;

  // posisi relatif terhadap wrap
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  teaseText.textContent = pick([
    "eh kok lari 😼",
    "ga boleh nolak 😤",
    "coba lagi hehe 😄",
    "iya aja yaa 💗",
    "nope 😌"
  ]);

  spawnHearts(3);
}

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* ===== Canvas FX ===== */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let w, h, dpr;

function resize(){
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(innerWidth * dpr);
  h = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
}
addEventListener("resize", resize);
resize();

const stars = Array.from({length: 120}, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random()*1.2 + 0.2,
  a: Math.random()*0.7 + 0.15,
  tw: Math.random()*0.02 + 0.005
}));

const hearts = [];
const confetti = [];

function spawnHearts(n=10){
  for(let i=0;i<n;i++){
    hearts.push({
      x: Math.random()*w,
      y: h + Math.random()*h*0.2,
      s: (Math.random()*18 + 10) * dpr,
      vy: -(Math.random()*0.9 + 0.6) * dpr,
      vx: (Math.random()*0.6 - 0.3) * dpr,
      rot: Math.random()*Math.PI,
      vr: (Math.random()*0.03 - 0.015),
      life: 1
    });
  }
}
function spawnConfetti(n=100){
  for(let i=0;i<n;i++){
    confetti.push({
      x: Math.random()*w,
      y: -20*dpr,
      vx: (Math.random()*2 - 1) * dpr,
      vy: (Math.random()*3 + 2) * dpr,
      s: (Math.random()*6 + 3) * dpr,
      r: Math.random()*Math.PI,
      vr: (Math.random()*0.3 - 0.15),
      a: 1,
      c: `hsl(${Math.floor(330 + Math.random()*40)}, ${70 + Math.random()*20}%, ${55 + Math.random()*20}%)`
    });
  }
}

function drawHeart(x,y,size,rot,alpha){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s*0.25);
  ctx.bezierCurveTo(0, -s*0.35, -s*0.75, -s*0.35, -s*0.75, s*0.15);
  ctx.bezierCurveTo(-s*0.75, s*0.55, 0, s*0.75, 0, s);
  ctx.bezierCurveTo(0, s*0.75, s*0.75, s*0.55, s*0.75, s*0.15);
  ctx.bezierCurveTo(s*0.75, -s*0.35, 0, -s*0.35, 0, s*0.25);
  ctx.closePath();

  const grd = ctx.createLinearGradient(-s, -s, s, s);
  grd.addColorStop(0, "rgba(255,77,136,0.95)");
  grd.addColorStop(1, "rgba(255,209,220,0.85)");
  ctx.fillStyle = grd;
  ctx.shadowColor = "rgba(255,77,136,.35)";
  ctx.shadowBlur = 18*dpr;
  ctx.fill();
  ctx.restore();
}

function loop(){
  ctx.clearRect(0,0,w,h);

  for(const st of stars){
    st.a += (Math.random() - 0.5) * st.tw;
    st.a = Math.max(0.08, Math.min(0.85, st.a));
    ctx.globalAlpha = st.a;
    ctx.beginPath();
    ctx.arc(st.x*w, st.y*h, st.r*dpr, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for(let i=hearts.length-1;i>=0;i--){
    const p = hearts[i];
    p.x += p.vx; p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.0022;
    drawHeart(p.x, p.y, p.s, p.rot, Math.max(0, p.life));
    if(p.y < -120*dpr || p.life <= 0) hearts.splice(i,1);
  }

  for(let i=confetti.length-1;i>=0;i--){
    const c = confetti[i];
    c.x += c.vx; c.y += c.vy;
    c.r += c.vr;
    c.vy += 0.05*dpr;
    c.a -= 0.004;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.r);
    ctx.globalAlpha = Math.max(0, c.a);
    ctx.fillStyle = c.c;
    ctx.fillRect(-c.s/2, -c.s/2, c.s, c.s*0.8);
    ctx.restore();

    if(c.y > h + 80*dpr || c.a <= 0) confetti.splice(i,1);
  }

  requestAnimationFrame(loop);
}

spawnHearts(10);
setInterval(() => spawnHearts(2), 700);
loop();
