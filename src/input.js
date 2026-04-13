export class InputManager {
  constructor(canvas, button) {
    this._held = new Set();
    this._justPressed = new Set();
    this._justReleased = new Set();
    this._usingTouch = false;

    this._onDown = (action) => {
      if (!this._held.has(action)) {
        this._justPressed.add(action);
      }
      this._held.add(action);
    };

    this._onUp = (action) => {
      this._held.delete(action);
      this._justReleased.add(action);
    };

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this._onDown('jump');
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        this._onUp('jump');
      }
    });

    // Mouse — ignored when touch is active (prevents synthetic events on mobile)
    button.addEventListener('mousedown', (e) => {
      if (this._usingTouch) return;
      e.preventDefault();
      this._onDown('jump');
    });
    document.addEventListener('mouseup', () => {
      if (this._usingTouch) return;
      if (this._held.has('jump')) {
        this._onUp('jump');
      }
    });

    // Touch on canvas and button
    const onTouchStart = (e) => {
      e.preventDefault();
      this._usingTouch = true;
      this._onDown('jump');
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      this._onUp('jump');
      // Reset touch flag after synthetic mouse events would have fired
      setTimeout(() => { this._usingTouch = false; }, 400);
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    button.addEventListener('touchstart', onTouchStart, { passive: false });
    button.addEventListener('touchend', onTouchEnd, { passive: false });
    button.addEventListener('touchcancel', onTouchEnd, { passive: false });
  }

  isHeld(action) {
    return this._held.has(action);
  }

  wasPressed(action) {
    return this._justPressed.has(action);
  }

  wasReleased(action) {
    return this._justReleased.has(action);
  }

  endFrame() {
    this._justPressed.clear();
    this._justReleased.clear();
  }
}
