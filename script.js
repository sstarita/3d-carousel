import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const CONFIG = {
  backface: false,
  buff: 2,
  animate: true,
  scroll: true,
  dark: false,
  masklower: 0.9,
  maskupper: 1.8,
  perspective: 325,
  vertical: true,
  infinite: false,
  items: 12,
  gap: 0.1,
  rotatex: 0,
  rotatez: 0,
};

const MAIN = document.querySelector('main');

const generateItems = () => {
  const items = [];
  const controllers = [];
  const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFC75F', '#F9F871', '#845EC2', '#008F7A', '#C34A36'];

  for (let i = 0; i < CONFIG.items; i++) {
    const color = colors[i % colors.length];
    const url = `https://example.com/item${i + 1}`;
    items.push(`
      <li style="--index: ${i}; background-color: ${color};">
        <a href="${url}" target="_blank" style="color: white; text-decoration: none; font-size: 1.2rem;">
          Link ${i + 1}
        </a>
      </li>
    `);
    controllers.push('<li></li>');
  }

  return {
    items: items.join(''),
    controllers: controllers.join(''),
  };
};

let scroller;

const handleScroll = () => {
  if (!CONFIG.infinite) return;
  if (CONFIG.vertical) {
    if (scroller.scrollTop + window.innerHeight > scroller.scrollHeight - 2) {
      scroller.scrollTop = 2;
    }
    if (scroller.scrollTop < 2) {
      scroller.scrollTop = scroller.scrollHeight - 2;
    }
  } else {
    if (scroller.scrollLeft + window.innerWidth > scroller.scrollWidth - 2) {
      scroller.scrollLeft = 2;
    }
    if (scroller.scrollLeft < 2) {
      scroller.scrollLeft = scroller.scrollWidth - 2;
    }
  }
};

const setupController = () => {
  scroller = document.querySelector('.controller');
  if (scroller) scroller.addEventListener('scroll', handleScroll);
};

const render = () => {
  const { items, controllers } = generateItems();
  MAIN.innerHTML = `
    <div class="container" style="--total: ${CONFIG.items};">
      <div class="carousel-container">
        <ul class="carousel">${items}</ul>
      </div>
      <ul class="controller">${controllers}</ul>
    </div>
  `;
  setupController();
};

let tween;

const update = () => {
  const root = document.documentElement;
  root.dataset.backface = CONFIG.backface;
  root.dataset.scroll = CONFIG.scroll;
  root.dataset.dark = CONFIG.dark;
  root.dataset.vertical = CONFIG.vertical;
  root.dataset.infinite = CONFIG.infinite;
  root.style.setProperty('--gap-efficient', CONFIG.gap);
  root.style.setProperty('--rotate-x', CONFIG.rotatex);
  root.style.setProperty('--rotate-z', CONFIG.rotatez);
  root.style.setProperty('--mask-lower', CONFIG.masklower);
  root.style.setProperty('--mask-upper', CONFIG.maskupper);
  root.style.setProperty('--scroll-ratio', CONFIG.buff);
  root.style.setProperty('--perspective', CONFIG.perspective);

  if (!CSS.supports('animation-timeline: scroll()') && CONFIG.scroll && CONFIG.animate) {
    if (scroller) scroller[CONFIG.vertical ? 'scrollTop' : 'scrollLeft'] = 0;
    root.dataset.gsap = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(['.carousel'], { animation: 'none', '--rotate': 0 });
    tween = gsap.to('.carousel', {
      rotateY: -360,
      '--rotate': 360,
      ease: 'none',
      scrollTrigger: {
        horizontal: !CONFIG.vertical,
        scroller: '.controller',
        scrub: true,
      },
    });
  } else {
    root.dataset.gsap = false;
    gsap.set('.carousel', { clearProps: true });
    if (tween) tween.kill();
    ScrollTrigger.killAll();
    const c = document.querySelector('.carousel');
    if (c) c.removeAttribute('style');
  }
};

render();
update();
