// Remove some characters which make JavaScript.STATEMENT_PREFIX instructions
// generation go wrong
Blockly.genUid.soup_ = '!#()*+,-./:;=?@[]_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Modify to save somewhere all bound events
if(!Blockly.eventsBound) {
  Blockly.eventsBound = [];
}

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
  Blockly.eventsBound.push({node: node, name: name, func: wrapFunc});
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
  for(var i=0; i<Blockly.eventsBound.length; i++) {
    var eData = Blockly.eventsBound[i];
    try {
      eData.node.removeEventListener(eData.name, eData.func);
    } catch(e) {}
  }
  if(Blockly.documentEventsBound_) {
    document.removeEventListener('mouseup', Blockly.onMouseUp_);
    Blockly.documentEventsBound_ = false;
  }
  Blockly.eventsBound = [];
}

// Validate contents of the expression block
// Returns null if the expression is valid
Blockly.validateExpression = function(text, workspace) {
  try {
    var acorn = window.acorn ? window.acorn : require('acorn');
    var walk = acorn.walk ? acorn.walk : require('acorn-walk');
  } catch(e) {
    console.error("Couldn't validate expression as acorn or acorn-walk is missing.");
    return null;
  }

  // acorn parses programs, it won't tell if there's a ';'
  if(text.indexOf(';') != -1) {
    // Semi-colon is not allowed
    return Blockly.Msg.EVAL_ERROR_SEMICOLON;
  }

  // Parse the expression
  try {
    var ast = acorn.parse(text);
  } catch(e) {
    // Couldn't parse
    return Blockly.Msg.EVAL_ERROR_SYNTAX;
  }

  var msg = null;
  var variableList = null;
  var allowedTypes = ["Literal", "Identifier", "BinaryExpression", "UnaryExpression", "ArrayExpression", "MemberExpression", "ExpressionStatement", "Program"];
  function checkAst(node, state, type) {
    if(allowedTypes.indexOf(type) == -1) {
      // Type is not allowed
      msg = Blockly.Msg.EVAL_ERROR_TYPE.replace('%1', type);
      return;
    }

    if(type == "MemberExpression" && (text[node.object.end] != '[' || node.property.end == node.end || text[node.end-1] != ']')) {
      // This type of MemberExpression is not allowed
      msg = Blockly.Msg.EVAL_ERROR_TYPE.replace('%1', type);
      return;
    }

    if(type == "Identifier" && workspace) {
      // Check if variable is defined
      if(variableList === null) {
        variableList = workspace.variableList;
      }
      if(variableList && variableList.indexOf(node.name) == -1) {
        // Variable is not defined
        msg = Blockly.Msg.EVAL_ERROR_VAR.replace('%1', node.name);
        return;
      }
    }
  }

  // Walk the AST
  walk.full(ast, checkAst);

  return msg;
};

// Reindex 1-based array indexes to 0-based
Blockly.reindexExpression = function(text, workspace) {
  if(Blockly.validateExpression(text, workspace) !== null) {
    // We shouldn't be generating code for an invalid block
    return null;
  }

  try {
    var acorn = window.acorn ? window.acorn : require('acorn');
    var walk = acorn.walk ? acorn.walk : require('acorn-walk');
  } catch(e) {
    console.error("Couldn't reindex expression as acorn or acorn-walk is missing.");
    return null;
  }

  // Parsing worked for validate, it will work this time too
  var ast = acorn.parse(text);

  // This array will contain the pairs of positions for '[' and ']'
  var reindexes = [];
  var newText = text;
  function getReindexes(node, state, type) {
    if(type == "MemberExpression") {
      reindexes.push([node.object.end, node.end-1]);
    }
  }

  // Walk the AST
  walk.full(ast, getReindexes);

  // Apply reindexing
  for(var i=0; i < reindexes.length; i++) {
    var start = reindexes[i][0];
    var end = reindexes[i][1];

    newText = newText.slice(0, start+1) + '(' + newText.slice(start+1, end) + ')-1' + newText.slice(end);

    // Adjust start and end for next reindexes
    for(var j=i+1; j < reindexes.length; j++) {
      if(start < reindexes[j][0]) {
        reindexes[j][0] += 1;
      }
      if(start < reindexes[j][1]) {
        reindexes[j][1] += 1;
      }
      if(end < reindexes[j][0]) {
        reindexes[j][0] += 3;
      }
      if(end < reindexes[j][1]) {
        reindexes[j][1] += 3;
      }
    }
  }

  return newText;
};
