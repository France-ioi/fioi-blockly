// Always enable touch events, especially as the detection is bad
// (computers with a touch screen won't be detected)
goog.events.BrowserFeature.TOUCH_ENABLED = true;
Blockly.Touch.TOUCH_MAP = {
  'mousedown': ['touchstart'],
  'mousemove': ['touchmove'],
  'mouseup': ['touchend', 'touchcancel']
};

// Fix case where there's no workspace (we're probably unloading)
Blockly.onMouseUp_ = function(e) {
  var workspace = Blockly.getMainWorkspace();
  if (!workspace || workspace.dragMode_ == Blockly.DRAG_NONE) {
    return;
  }
  Blockly.Touch.clearTouchIdentifier();
  Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
  workspace.dragMode_ = Blockly.DRAG_NONE;
  // Unbind the touch event if it exists.
  if (Blockly.Touch.onTouchUpWrapper_) {
    Blockly.unbindEvent_(Blockly.Touch.onTouchUpWrapper_);
    Blockly.Touch.onTouchUpWrapper_ = null;
  }
  if (Blockly.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.onMouseMoveWrapper_);
    Blockly.onMouseMoveWrapper_ = null;
  }
};

