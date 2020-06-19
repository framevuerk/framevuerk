let timeout;
export default (element, callback) => {
  // hide scroll
  clearTimeout(timeout);
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  document.body.style.overflow = 'hidden';
  const overlay = document.createElement('DIV');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
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
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('touchstart', onClick, true);
      if (overlays.length === 0) {
        timeout = setTimeout(() => {
          document.body.style.overflow = null;
          document.body.style.paddingRight = null;
        }, 220);
      }
    },
  };
};
