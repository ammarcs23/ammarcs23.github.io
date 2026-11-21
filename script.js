(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Typing effect in hero
  var roles = ['Machine Learning & Full-Stack Developer', 'Deep Learning Enthusiast', 'Computer Vision Learner', 'BSCS Student'];
  var el = document.getElementById('typed');
  if (!reduce && el) {
    var r = 0, c = 0, del = false;
    (function tick() {
      var word = roles[r];
      el.textContent = word.slice(0, c);
      var wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 400; }
      c += del ? -1 : 1;
      setTimeout(tick, wait);
    })();
  } else {
    document.querySelector('.cursor').style.display = 'none';
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (n, i) {
      n.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(n);
    });
  } else {
    items.forEach(function (n) { n.classList.add('in'); });
  }

  // Counters
  function animate(b) {
    var end = +b.dataset.count, suffix = b.dataset.suffix || '';
    if (reduce) { b.textContent = end + suffix; return; }
    var start = null, dur = 1200;
    (function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      b.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (b) { co.observe(b); });
  } else {
    counters.forEach(animate);
  }

  // Active nav link on scroll
  var links = document.querySelectorAll('#menu a');
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) so.observe(s); });
  }

  // Nav shadow + back-to-top
  var nav = document.getElementById('nav'), top = document.getElementById('toTop');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    top.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  // Photo lightbox
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
  document.querySelectorAll('.photo').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lbImg.src = btn.dataset.full;
      lbImg.alt = btn.dataset.alt || '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
})();