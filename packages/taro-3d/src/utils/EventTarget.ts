// source from https://github.com/wechat-miniprogram/threejs-miniprogram/blob/master/src/EventTarget.js
// under MIT License

const _events = new Map();

class Touch {
  constructor(touch: any) {
    // CanvasTouch{identifier, x, y}
    // Touch{identifier, pageX, pageY, clientX, clientY, force}
    this.identifier = touch.identifier;

    this.force = touch.force === undefined ? 1 : touch.force;
    this.pageX = touch.pageX || touch.x;
    this.pageY = touch.pageY || touch.y;
    this.clientX = touch.clientX || touch.x;
    this.clientY = touch.clientY || touch.y;

    this.screenX = this.pageX;
    this.screenY = this.pageY;
  }
}

export default class EventTarget {
  constructor() {
    _events.set(this, {});
  }

  addEventListener(type, listener, options = {}) {
    let events = _events.get(this);
    // console.log('EventTarget.ts', 'addEventListener', events);

    if (!events) {
      events = {};
      _events.set(this, events);
    }
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);

    if (options.capture) {
      // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
    }
    if (options.once) {
      // console.warn('EventTarget.addEventListener: options.once is not implemented.')
    }
    if (options.passive) {
      // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
    }
  }

  removeEventListener(type, listener) {
    const events = _events.get(this);

    if (events) {
      const listeners = events[type];

      if (listeners && listeners.length > 0) {
        for (let i = listeners.length; i--; i > 0) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  dispatchEvent(event = {}) {
    const type = event.type;
    if (typeof event.preventDefault !== 'function') {
      event.preventDefault = () => {};
    }
    if (typeof event.stopPropagation !== 'function') {
      event.stopPropagation = () => {};
    }
    const listeners = _events.get(this)[event.type];
    // console.log('EventTarget.ts dispatchEvent', event.type, event.target.constructor.prototype);
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
    if (event.target && typeof event.target['on' + type] === 'function') {
      event.target['on' + type](event);
    }
  }

  dispatchTouchEvent(e = {}) {
    const touch = e.touches[0] || {};
    const event = {
      isTrusted: true,
      altKey: false,
      // altitudeAngle: 1.5707963267948966,
      // azimuthAngle: 0,
      bubbles: true,
      button: 0,
      buttons: 1,
      cancelable: true,
      clientX: touch.pageX,
      clientY: touch.pageY,
      composed: true,
      ctrlKey: false,
      currentTarget: null,
      defaultPrevented: false,
      detail: 0,
      eventPhase: 0,
      fromElement: null,
      // height: 28.75,
      isPrimary: true,
      layerX: Math.round(touch.pageX),
      layerY: Math.round(touch.pageY),
      metaKey: false,
      movementX: 0,
      movementY: 0,
      offsetX: touch.pageX,
      offsetY: touch.pageY,
      pageX: touch.pageX,
      pageY: touch.pageY,
      path: [],
      pointerId: e.pointerId,
      pointerType: 'touch',
      pressure: 1,
      relatedTarget: null,
      returnValue: true,
      // screenX: 338.453125,
      // screenY: 373.828125,
      shiftKey: false,
      sourceCapabilities: null,
      tangentialPressure: 0,
      target: e.target,
      tiltX: 0,
      tiltY: 0,
      timeStamp: e.timeStamp,
      toElement: null,
      twist: 0,
      type: e.type,
      view: null,
      which: 1,
      // width: 28.75,
      x: touch.x,
      y: touch.y
    };
    console.log('dispatchTouchEvent', event);

    this.dispatchEvent(event);
  }
  setPointerCapture() {}
  releasePointerCapture() {}
}
