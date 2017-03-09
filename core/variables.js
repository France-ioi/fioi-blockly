// Options for the variables flyout
Blockly.Variables.flyoutOptions = {
  any: true, // Allow to create any variable
  anyButton: true, // Add the button to add variables (needs any=true)
  fixed: [], // List of fixed variables (will create blocks for each of them)
  includedBlocks: {get: true, set: true, incr: true}, // Blocks to add to the list
  shortList: true, // Generate set/incr blocks only for the first (non-fixed) variable
  };

// Construct the blocks required by the flyout for the variable category.
Blockly.Variables.flyoutCategory = function(workspace) {
  var xmlList = [];
  var options = Blockly.Variables.flyoutOptions;

  // Detect if we're in Blockly or Scratch
  var scratchMode = !!(Blockly.registerButtonCallback);
  if(options.any) {
    if(workspace) {
      var fullVariableList = workspace.variableList;
    } else {
      if(options.fixed.indexOf('newvar') > -1) {
        var newVarIdx = 0;
        while(options.fixed.indexOf('newvar'+newVarIdx) > -1) {
          newVarIdx++;
        }
        var fullVariableList = ['newvar'+newVarIdx];
      } else {
        var fullVariableList = ['newvar'];
      }
    }
    for(var i=0; i<options.fixed.length; i++) {
      var idx = fullVariableList.indexOf(options.fixed[i]);
      if(idx > -1) {
        fullVariableList.splice(idx, 1);
      }
    }
    fullVariableList.sort(goog.string.caseInsensitiveCompare);

    if(options.anyButton) {
      var button = goog.dom.createDom('button');
      button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
      if(scratchMode) {
        // Scratch
        button.setAttribute('callbackKey', 'CREATE_VARIABLE');
        Blockly.registerButtonCallback('CREATE_VARIABLE', function(button) {
          Blockly.Variables.createVariable(button.getTargetWorkspace());
        });
      }
      xmlList.push(button);
    }
  } else {
    var fullVariableList = [];
  }

  var variableList = options.fixed.concat(fullVariableList);

  if (variableList.length > 0) {
    if(scratchMode) {
      var blockNames = {
        get: 'data_variable',
        set: 'data_setvariableto',
        incr: 'data_changevariableby'
        };
    } else {
      var blockNames = {
        get: 'variables_get',
        set: 'variables_set',
        incr: 'math_change'
        };
    }

    if (options.includedBlocks.get && Blockly.Blocks[blockNames.get]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_get" gap="8">
        //   <field name="VAR">item</field>
        // </block>
        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.get);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
        }

        block.appendChild(field);
        xmlList.push(block);
      }
    }

    if (options.includedBlocks.set && Blockly.Blocks[blockNames.set]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_set" gap="20">
        //   <field name="VAR">item</field>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.set);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createTextDom_());
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }
    if (options.includedBlocks.incr && Blockly.Blocks[blockNames.incr]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="math_change">
        //   <value name="DELTA">
        //     <shadow type="math_number">
        //       <field name="NUM">1</field>
        //     </shadow>
        //   </value>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.incr);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }
        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createMathNumberDom_())
        } else {
          var value = goog.dom.createDom('value');
          value.setAttribute('name', 'DELTA');
          block.appendChild(value);

          var shadowBlock = goog.dom.createDom('shadow');
          shadowBlock.setAttribute('type', 'math_number');
          value.appendChild(shadowBlock);

          var numberField = goog.dom.createDom('field', null, '1');
          numberField.setAttribute('name', 'NUM');
          shadowBlock.appendChild(numberField);

          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }

  }
  return xmlList;
};

// Adapt to our custom Blockly.Variables.promptName behavior
// We also return null instead of the variable name as anyway no call seems to
// read the return value
Blockly.Variables.createVariable = function(workspace) {
  var cb = function(text) {
    if (text) {
      if (workspace.variableIndexOf(text) != -1) {
        displayHelper.showPopupMessage(Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace('%1',
            text.toLowerCase()), 'blanket');
      } else {
        workspace.createVariable(text);
      }
    }
  }
  Blockly.Variables.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '', cb);
  return null;
};

/**
 * Prompt the user for a new variable name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @return {?string} The new variable name, or null if the user picked
 *     something illegal.
 */
Blockly.Variables.promptName = function(promptText, defaultText, callback) {
  var cb = function (newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    };
    callback(newVar);
  };
  displayHelper.showPopupMessage(promptText, 'input', null, cb);
};
