import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const CONFIG = {
  debug: false,
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
  items: 16,
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
    const bgColor = colors[i % colors.length];
    const linkHref = `https://example.com/item${i + 1}`;

    items.push(`
      <li style="--index: ${i}; background-color: ${bgColor}; border-radius: 12px; display: grid; place-items: center;">
        <a href="${linkHref}" target="_blank" style="color: white; font-size: 1.2rem; text-decoration: none;">
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
  scroller.addEventListener('scroll', handleScroll);
};

const render = () => {
  const { controllers, items } = generateItems();
  MAIN.innerHTML = `
    <div class="container" style="--total: ${CONFIG.items};">
      <div class="carousel-container">
        <ul class="carousel">
          ${items}
        </ul>
      </div>
      <ul class="controller">
        ${controllers}
      </ul>
    </div>
  `;
  setupController();
};

let tween;

const update = () => {
  document.documentElement.dataset.debug = CONFIG.debug;
  document.documentElement.dataset.animate = CONFIG.animate;
  document.documentElement.dataset.backface = CONFIG.backface;
  document.documentElement.dataset.scroll = CONFIG.scroll;
  document.documentElement.dataset.dark = CONFIG.dark;
  document.documentElement.dataset.vertical = CONFIG.vertical;
  document.documentElement.dataset.infinite = CONFIG.infinite;
  document.documentElement.style.setProperty('--gap-efficient', CONFIG.gap);
  document.documentElement.style.setProperty('--rotate-x', CONFIG.rotatex);
  document.documentElement.style.setProperty('--rotate-z', CONFIG.rotatez);
  document.documentElement.style.setProperty('--mask-lower', CONFIG.masklower);
  document.documentElement.style.setProperty('--mask-upper', CONFIG.maskupper);
  document.documentElement.style.setProperty('--scroll-ratio', CONFIG.buff);
  document.documentElement.style.setProperty('--perspective', CONFIG.perspective);

  if (
    !CSS.supports('animation-timeline: scroll()') &&
    CONFIG.scroll &&
    CONFIG.animate
  ) {
    if (scroller) scroller[CONFIG.vertical ? 'scrollTop' : 'scrollLeft'] = 0;
    document.documentElement.dataset.gsap = true;
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
    document.documentElement.dataset.gsap = false;
    gsap.set('.carousel', { clearProps: true });
    if (tween) tween.kill();
    ScrollTrigger.killAll();
    document.querySelector('.carousel').removeAttribute('style');
  }
};

render();
update();
