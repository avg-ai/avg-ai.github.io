const config = {
    theme: 'dark',
    animate: true,
    snap: true,
    start: 0, // Задаём фиксированное значение вместо random
    end: 360, // Задаём фиксированное значение вместо random
    scroll: true,
    debug: false
  };
  
  let items;
  let scrollerScrub;
  let dimmerScrub;
  let chromaEntry;
  let chromaExit;
  
  const mainContainer = document.querySelector('.scroll-effect-container');
  
  const update = () => {
    mainContainer.dataset.theme = config.theme;
    mainContainer.dataset.syncScrollbar = config.scroll;
    mainContainer.dataset.animate = config.animate;
    mainContainer.dataset.snap = config.snap;
    mainContainer.dataset.debug = config.debug;
    mainContainer.style.setProperty('--start', config.start);
    mainContainer.style.setProperty('--hue', config.start);
    mainContainer.style.setProperty('--end', config.end);
  
    if (!config.animate) {
      if (chromaEntry) chromaEntry.scrollTrigger.disable(true, false);
      if (chromaExit) chromaExit.scrollTrigger.disable(true, false);
      if (dimmerScrub) dimmerScrub.disable(true, false);
      if (scrollerScrub) scrollerScrub.disable(true, false);
      gsap.set(items, { opacity: 1 });
      gsap.set(mainContainer, { '--chroma': 0 });
    } else {
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
      if (dimmerScrub) dimmerScrub.enable(true, true);
      if (scrollerScrub) scrollerScrub.enable(true, true);
      if (chromaEntry) chromaEntry.scrollTrigger.enable(true, true);
      if (chromaExit) chromaExit.scrollTrigger.enable(true, true);
    }
  };
  
  // Убираем sync, так как он нужен был только для Tweakpane
  // const sync = (event) => { ... }; // Удалено
  
  // Убираем ctrl.on('change', sync); так как ctrl больше нет
  
  // Backfill the scroll functionality with GSAP
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    gsap.registerPlugin(ScrollTrigger);
  
    items = gsap.utils.toArray('.scroll-effect-list .scroll-effect-list-item');
  
    const dimmer = gsap
      .timeline()
      .to(items.slice(1), {
        opacity: 1,
        stagger: 0.5
      })
      .to(
        items.slice(0, items.length - 1),
        {
          opacity: 0.2,
          stagger: 0.5
        },
        0
      );
  
    dimmerScrub = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      animation: dimmer,
      scrub: 0.2
    });
  
    const scroller = gsap.timeline().fromTo(
      mainContainer,
      { '--hue': config.start },
      { '--hue': config.end, ease: 'none' }
    );
  
    scrollerScrub = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      animation: scroller,
      scrub: 0.2
    });
  
    chromaEntry = gsap.fromTo(
      mainContainer,
      { '--chroma': 0 },
      {
        '--chroma': 0.3,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: items[0],
          start: 'center center+=40',
          end: 'center center'
        }
      }
    );
  
    chromaExit = gsap.fromTo(
      mainContainer,
      { '--chroma': 0.3 },
      {
        '--chroma': 0,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: items[items.length - 2],
          start: 'center center',
          end: 'center center-=40'
        }
      }
    );
  }
  
  update();