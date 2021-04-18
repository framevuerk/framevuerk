import { each } from './utils';

let timeout;
export default (element, callback) => {
  // hide scroll
  clearTimeout(timeout);
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  document.body.style.overflow = 'hidden';
  const overlay = document.createElement('DIV');
  each({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00000020',
    zIndex: 2,
  }, (key, value) => {
    overlay.style[key] = value;
  });
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
      event.preventDefault();
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
