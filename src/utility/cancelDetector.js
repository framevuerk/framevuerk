export default (element, callback) => {
  // hide scroll
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  document.body.style.overflow = 'hidden';
  const overlay = document.createElement('DIV');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  overlay.dataset.overlay = 'true';
  const parent = element.parentElement;
  parent.insertBefore(overlay, element);

  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      callback();
    }
  };
  const onClick = (event) => {
    if (!element.contains(event.target)) {
      event.stopPropagation();
      callback();
    }
  };
  setTimeout(() => {
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('click', onClick, true);
    window.addEventListener('touchstart', onClick, true);
    // focus on current
    const startFocusFor = element.querySelector('[autofocus]') || element;
    if (startFocusFor && startFocusFor.focus) {
      startFocusFor.focus();
    }
  });
  return {
    release: () => {
      overlay.remove();
      const overlays = document.querySelectorAll('[data-overlay=true]');
      if (overlays.length === 0) {
        document.body.style.overflow = null;
        document.body.style.paddingRight = null;
      }
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('touchstart', onClick, true);
    },
  };
};
