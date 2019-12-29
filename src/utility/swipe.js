/* eslint-disable no-use-before-define */
function bindEvents(element, parts = ['element', 'window'], onTouchStart, onTouchMove, onTouchEnd) {
  if (parts.includes('element')) {
    element.addEventListener('mousedown', onTouchStart);
    element.addEventListener('touchstart', onTouchStart);
  }
  if (parts.includes('window')) {
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
    window.addEventListener('touchend', onTouchEnd);
  }
}
function unbindEvents(element, parts = ['element', 'window'], onTouchStart, onTouchMove, onTouchEnd) {
  if (parts.includes('element')) {
    element.removeEventListener('mousedown', onTouchStart);
    element.removeEventListener('touchstart', onTouchStart);
  }
  if (parts.includes('window')) {
    window.removeEventListener('mousemove', onTouchMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('mouseup', onTouchEnd);
    window.removeEventListener('touchend', onTouchEnd);
  }
}

export default function Swipe(bindingElement = null) {
  const beforeSwipeCallbacks = [];
  const whileSwipeCallbacks = [];
  const afterSwipeCallbacks = [];
  let element = bindingElement;


  function getTouchPos(event) {
    if (event.changedTouches && event.changedTouches.length) {
      return {
        y: event.changedTouches[0].clientY,
        x: event.changedTouches[0].clientX,
      };
    }
    return {
      y: event.pageY,
      x: event.pageX,
    };
  }

  function posDiff(posOne, posTwo) {
    return {
      y: posOne.y - posTwo.y,
      x: posOne.x - posTwo.x,
    };
  }

  let startTime = 0;
  let startPos = null;

  function onTouchStart(event) {
    startPos = getTouchPos(event);
    for (let index = beforeSwipeCallbacks.length - 1; index > -1; index -= 1) {
      beforeSwipeCallbacks[index](startPos);
    }
    startTime = Date.now();
    event.stopPropagation();
    event.preventDefault();
    bindEvents(element, ['window'], null, onTouchMove, onTouchEnd);
  }
  function onTouchMove(event) {
    const pos = getTouchPos(event);
    const diff = posDiff(pos, startPos);
    for (let index = whileSwipeCallbacks.length - 1; index > -1; index -= 1) {
      whileSwipeCallbacks[index](pos, diff);
    }
    event.stopPropagation();
    event.preventDefault();
  }
  function onTouchEnd(event) {
    const pos = getTouchPos(event);
    const diff = posDiff(pos, startPos);
    const timeDiff = Date.now() - startTime;
    for (let index = afterSwipeCallbacks.length - 1; index > -1; index -= 1) {
      afterSwipeCallbacks[index](pos, diff, timeDiff);
    }
    unbindEvents(element, ['window'], null, onTouchMove, onTouchEnd);
  }
  return {
    setElement(el) {
      element = el;
    },
    on() {
      bindEvents(element, ['element'], onTouchStart, null, null);
    },
    before(callback) {
      beforeSwipeCallbacks.push(callback);
    },
    while(callback) {
      whileSwipeCallbacks.push(callback);
    },
    after(callback) {
      afterSwipeCallbacks.push(callback);
    },
    off() {
      unbindEvents(element, ['element', 'window'], onTouchStart, onTouchMove, onTouchEnd);
    },
  };
}
