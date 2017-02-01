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
      xmlList.push(button);
    }
  } else {
    var fullVariableList = [];
  }

  var variableList = options.fixed.concat(fullVariableList);

  if (variableList.length > 0) {
    if (Blockly.Blocks['variables_get']) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_get" gap="8">
        //   <field name="VAR">item</field>
        // </block>
        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_get');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');

        block.appendChild(field);
        xmlList.push(block);
      }
    }

    if (options.includedBlocks.set && Blockly.Blocks['variables_set']) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_set" gap="20">
        //   <field name="VAR">item</field>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_set');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');

        block.appendChild(field);
        xmlList.push(block);
      }
    }
    if (options.includedBlocks.incr && Blockly.Blocks['math_change']) {
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
        block.setAttribute('type', 'math_change');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }
        var value = goog.dom.createDom('value');
        value.setAttribute('name', 'DELTA');
        block.appendChild(value);

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');
        block.appendChild(field);

        var shadowBlock = goog.dom.createDom('shadow');
        shadowBlock.setAttribute('type', 'math_number');
        value.appendChild(shadowBlock);

        var numberField = goog.dom.createDom('field', null, '1');
        numberField.setAttribute('name', 'NUM');
        shadowBlock.appendChild(numberField);

        xmlList.push(block);
      }
    }

  }
  return xmlList;
};

