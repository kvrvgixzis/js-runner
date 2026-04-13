export class InputManager {
  constructor(canvas, button) {
    this._held = new Set();
    this._justPressed = new Set();
    this._justReleased = new Set();

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

    // Mouse on button
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this._onDown('jump');
    });
    document.addEventListener('mouseup', () => {
      if (this._held.has('jump')) {
        this._onUp('jump');
      }
    });

    // Touch on canvas and button
    const touchStart = (e) => {
      e.preventDefault();
      this._onDown('jump');
    };
    const touchEnd = (e) => {
      e.preventDefault();
      this._onUp('jump');
    };

    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchend', touchEnd, { passive: false });
    button.addEventListener('touchstart', touchStart, { passive: false });
    button.addEventListener('touchend', touchEnd, { passive: false });
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
