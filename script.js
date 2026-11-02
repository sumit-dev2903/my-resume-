
 // 1) Animate statistics (count-up)
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  let n = 0;

  const step = () => {
    n += Math.max(1, Math.round(target / 30));
    el.textContent = Math.min(n, target);

    if (n < target) requestAnimationFrame(step);
  };

  step();
});


// 2) Filter category of works
const filters = document.getElementById('filters');
const cards = document.querySelectorAll('.card');

filters.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  filters.querySelectorAll('button')
    .forEach(b => b.classList.remove('on'));

  btn.classList.add('on');

  const f = btn.dataset.f;

  cards.forEach(c =>
    c.classList.toggle('hide', f !== 'all' && c.dataset.c !== f)
  );
});


// 3) Before / After Slider
const compare = document.getElementById('compare');

document.getElementById('slider').addEventListener('input', e => {
  compare.style.setProperty('--p', e.target.value + '%');
});


// 4) Play Showreel Button
// Replace URL with your own video
const SHOWREEL_URL =
  'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1';

function openReel() {
  const box = document.createElement('div');

  box.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:99;display:grid;place-items:center';

  box.innerHTML = `
    <iframe src="${SHOWREEL_URL}"
      allow="autoplay;fullscreen"
      style="width:min(900px,92vw);aspect-ratio:16/9;border:0">
    </iframe>
  `;

  box.addEventListener('click', () => box.remove());

  document.body.appendChild(box);
}

['playBtn', 'playBtn2'].forEach(id =>
  document.getElementById(id).addEventListener('click', openReel)
);


// 5) Active menu link on scroll
const links = document.querySelectorAll('.nav nav a');

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(l => {
        l.style.color =
          l.getAttribute('href') === '#' + en.target.id
            ? '#fff'
            : '';
      });
    }
  });
}, { threshold: .4 });

document.querySelectorAll('main section[id]')
  .forEach(s => io.observe(s));
/* ===== EXTRA ANIMATIONS ===== */
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

// Scroll progress bar + garis timeline yang tumbuh
const bar = Object.assign(document.createElement('div'), { className: 'progress' });
document.body.appendChild(bar);
const tl = document.querySelector('.tl');
function onScroll() {
  bar.style.transform = `scaleX(${scrollY / (document.body.scrollHeight - innerHeight)})`;
  const r = tl.getBoundingClientRect();
  tl.style.setProperty('--grow', Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height)));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Hero masuk bertahap
document.querySelectorAll('.hero-text>*').forEach((e, i) => e.style.animationDelay = i * .15 + 's');

// Reveal saat scroll
const rvIO = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in'); rvIO.unobserve(en.target);
  setTimeout(() => en.target.classList.remove('rv', 'in'), 1400);
}), { threshold: .12 });
document.querySelectorAll('.sec > *, .card, .list li, .tl li, .steps li, aside p, .info li').forEach((el, i) => {
  el.classList.add('rv');
  el.style.transitionDelay = (el.matches('li,.card,aside p') ? (i % 6) * 80 : 0) + 'ms';
  rvIO.observe(el);
});

// Logo berjalan (marquee)
const logos = document.querySelector('.logos');
logos.innerHTML = `<div class="track">${logos.innerHTML + logos.innerHTML}</div>`;

// Cursor merah + cursor warna-warni melayang
const names = ['Aldi', 'Rina', 'Dimas', 'Sari', 'Bima', 'Maya', 'Raka'];
const cols = ['#ff6b6b', '#4dd0e1', '#ffd54f', '#9ccc65', '#ba68c8', '#4fc3f7', '#ff8a65'];
const ghosts = calm ? [] : names.map((n, i) => {
  const el = document.createElement('div');
  el.className = 'ghost-cur'; el.style.color = cols[i];
  el.innerHTML = `<svg viewBox="0 0 16 16"><path d="M1 1l5.5 14 2-5.5L14 7.5z" fill="currentColor"/></svg><b style="background:${cols[i]}">${n}</b>`;
  document.body.appendChild(el);
  return { el, x: Math.random() * innerWidth, y: Math.random() * innerHeight, ph: Math.random() * 9, sp: .3 + Math.random() * .5, follow: i < 3 };
});

let dot, ring;
if (fine) {
  dot = Object.assign(document.createElement('div'), { className: 'cur-dot' });
  ring = Object.assign(document.createElement('div'), { className: 'cur-ring' });
  document.body.append(dot, ring);
  document.querySelectorAll('a,button,.card,.list li,.tl li').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
  });
  // tombol magnetic
  document.querySelectorAll('.btn,.lets').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

const photo = document.querySelector('.hero-photo'), bg = document.querySelector('.big-bg');
(function loop(ms) {
  const t = ms / 1000;
  if (fine) {
    rx += (mx - rx) * .15; ry += (my - ry) * .15;
    dot.style.transform = `translate(${mx}px,${my}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    const px = mx / innerWidth - .5, py = my / innerHeight - .5;
    photo.style.transform = `translate(${px * -16}px,${py * -10}px)`;
    bg.style.translate = `${px * 24}px ${py * 14}px`;
  }
  ghosts.forEach(g => {
    const tx = g.follow ? mx + Math.cos(t * g.sp + g.ph) * 130 : innerWidth / 2 + Math.cos(t * g.sp + g.ph) * innerWidth * .4;
    const ty = g.follow ? my + Math.sin(t * g.sp * 1.3 + g.ph) * 90 : innerHeight / 2 + Math.sin(t * g.sp * .8 + g.ph * 2) * innerHeight * .35;
    g.x += (tx - g.x) * .03; g.y += (ty - g.y) * .03;
    g.el.style.transform = `translate(${g.x}px,${g.y}px)`;
  });
  requestAnimationFrame(loop);
})(0);
