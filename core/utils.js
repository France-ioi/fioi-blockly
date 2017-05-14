// Remove some characters which make JavaScript.STATEMENT_PREFIX instructions
// generation go wrong
Blockly.genUid.soup_ = '!#()*+,-./:;=?@[]_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Modify to save somewhere all bound events
Blockly.eventsBound = [];

Blockly.bindEventWithChecks_ = function(node, name, thisObject, func,
    opt_noCaptureIdentifier) {
  var handled = false;
  var wrapFunc = function(e) {
    var captureIdentifier = !opt_noCaptureIdentifier;
    // Handle each touch point separately.  If the event was a mouse event, this
    // will hand back an array with one element, which we're fine handling.
    var events = Blockly.Touch.splitEventByTouches(e);
    for (var i = 0, event; event = events[i]; i++) {
      if (captureIdentifier && !Blockly.Touch.shouldHandleEvent(event)) {
        continue;
      }
      Blockly.Touch.setClientFromTouch(event);
      if (thisObject) {
        func.call(thisObject, event);
      } else {
        func(event);
      }
      handled = true;
    }
  };

  node.addEventListener(name, wrapFunc, false);
  Blockly.eventsBound.push({node: node, name: name, func: func});
  var bindData = [[node, name, wrapFunc]];

  // Add equivalent touch event.
  if (name in Blockly.Touch.TOUCH_MAP) {
    var touchWrapFunc = function(e) {
      wrapFunc(e);
      // Stop the browser from scrolling/zooming the page.
      if (handled) {
        e.preventDefault();
      }
    };
    for (var i = 0, eventName;
         eventName = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
      node.addEventListener(eventName, touchWrapFunc, false);
      Blockly.eventsBound.push({node: node, name: eventName, func: func});
      bindData.push([node, eventName, touchWrapFunc]);
    }
  }
  return bindData;
};


// Function to remove all bound events
Blockly.removeEvents = function() {
  if(Blockly.documentEventsBound_) {
    document.removeEventListener('mouseup', Blockly.onMouseUp_);
  }
  for(var i=0; i<Blockly.eventsBound.length; i++) {
    var eData = Blockly.eventsBound[i];
    try {
      eData.node.removeEventListener(eData.name, eData.func);
    } catch(e) {}
  }
  Blockly.eventsBound = [];
  Blockly.DropDownDiv.removeListener();
}
