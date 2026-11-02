
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
