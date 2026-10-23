// App preview player: one video at a time, chosen by device and variant.
// Without this script every preview shows with the browser's own controls.
(function () {
  var section = document.querySelector('.previews');
  if (!section) return;

  var picker = section.querySelector('.preview-picker');
  var controls = section.querySelector('.preview-controls');
  var figures = Array.prototype.slice.call(section.querySelectorAll('.preview'));
  var playButton = controls.querySelector('[data-action="play"]');
  var soundButton = controls.querySelector('[data-action="sound"]');
  var fullscreenButton = controls.querySelector('[data-action="fullscreen"]');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var variants = { iphone: 'iphone', duo: 'duo-closed', ipad: 'ipad-portrait' };
  var device = 'iphone';
  var userPaused = reduceMotion.matches;
  var soundOn = false;
  var inView = false;
  var current = null;

  figures.forEach(function (figure) {
    var video = figure.querySelector('video');
    video.removeAttribute('controls');
    video.muted = true;
    video.addEventListener('play', syncButtons);
    video.addEventListener('pause', syncButtons);
  });
  picker.hidden = false;
  controls.hidden = false;

  function videoOf(figure) { return figure.querySelector('video'); }

  function show(id) {
    if (current) videoOf(current).pause();
    figures.forEach(function (figure) { figure.hidden = figure.id !== 'preview-' + id; });
    current = document.getElementById('preview-' + id);
    var video = videoOf(current);
    video.muted = !soundOn;
    if (!userPaused && inView) play(video);
    syncButtons();
  }

  function play(video) {
    var attempt = video.play();
    // Autoplay can still be refused (Low Power Mode, data saver); fall back to the poster and Play button.
    if (attempt && attempt.catch) attempt.catch(function () { userPaused = true; syncButtons(); });
  }

  function syncButtons() {
    if (!current) return;
    var video = videoOf(current);
    var playing = !video.paused;
    playButton.textContent = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-pressed', String(!playing));
    soundButton.textContent = soundOn ? 'Sound off' : 'Sound on';
    soundButton.setAttribute('aria-pressed', String(soundOn));
  }

  function select(tablist, button) {
    Array.prototype.forEach.call(tablist.querySelectorAll('[role="tab"]'), function (tab) {
      var selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function chooseDevice(button) {
    device = button.dataset.device;
    select(button.parentNode, button);
    Array.prototype.forEach.call(picker.querySelectorAll('[data-for]'), function (list) {
      list.hidden = list.dataset.for !== device;
    });
    show(variants[device]);
  }

  function chooseVariant(button) {
    variants[device] = button.dataset.variant;
    select(button.parentNode, button);
    show(variants[device]);
  }

  picker.addEventListener('click', function (event) {
    var button = event.target.closest('[role="tab"]');
    if (!button) return;
    if (button.dataset.device) chooseDevice(button); else chooseVariant(button);
  });

  // Arrow keys move between tabs in a tablist, as the ARIA tabs pattern expects.
  picker.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    var tabs = Array.prototype.slice.call(event.target.parentNode.querySelectorAll('[role="tab"]'));
    var index = tabs.indexOf(event.target);
    if (index < 0) return;
    var next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    next.click();
    event.preventDefault();
  });

  playButton.addEventListener('click', function () {
    var video = videoOf(current);
    if (video.paused) { userPaused = false; play(video); } else { userPaused = true; video.pause(); }
  });

  soundButton.addEventListener('click', function () {
    soundOn = !soundOn;
    var video = videoOf(current);
    video.muted = !soundOn;
    if (soundOn && video.paused) { userPaused = false; play(video); }
    syncButtons();
  });

  fullscreenButton.addEventListener('click', function () {
    var video = videoOf(current);
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });

  // Play only while the stage is on screen, so nothing downloads or runs out of sight.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      var video = videoOf(current);
      if (inView && !userPaused) play(video); else if (!inView) video.pause();
    }, { threshold: 0.4 }).observe(section.querySelector('.preview-stage'));
  } else {
    inView = true;
  }

  show('iphone');
})();
