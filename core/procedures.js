// Options for the variables flyout
Blockly.Procedures.resetFlyoutOptions = function (initial) {
  if (initial) {
    Blockly.Procedures.flyoutOptions = {
      disableArgs: false, // Disable the arguments mutator
      inlineArgs: false, // Put fields inline
      includedBlocks: { noret: false, ret: false, ifret: false, noifret: false }, // Blocks to add to the list
    };
  } else {
    // Keep inlineArgs option
    Blockly.Procedures.flyoutOptions.disableArgs = false;
    Blockly.Procedures.includedBlocks = { noret: false, ret: false, ifret: false, noifret: false };
  }
};
Blockly.Procedures.resetFlyoutOptions(true);

// Allow configuration of the category
Blockly.Procedures.flyoutCategory = function(workspace) {
  var incl = Blockly.Procedures.flyoutOptions.includedBlocks;
  var xmlList = [];
  if (incl.noret && Blockly.Blocks['procedures_defnoreturn']) {
    // <block type="procedures_defnoreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defnoreturn');
    block.setAttribute('gap', 16);
    var nameField = goog.dom.createDom('field', null,
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE);
    nameField.setAttribute('name', 'NAME');
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (incl.ret && Blockly.Blocks['procedures_defreturn']) {
    // <block type="procedures_defreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defreturn');
    block.setAttribute('gap', 16);
    var nameField = goog.dom.createDom('field', null,
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE);
    nameField.setAttribute('name', 'NAME');
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (incl.ifret && Blockly.Blocks['procedures_ifreturn']) {
    // <block type="procedures_ifreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_ifreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (incl.noifret && Blockly.Blocks['procedures_return']) {
    // <block type="procedures_ifreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_return');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  function populateProcedures(procedureList, templateName) {
    for (var i = 0; i < procedureList.length; i++) {
      var name = procedureList[i][0];
      var args = procedureList[i][1];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      var block = goog.dom.createDom('block');
      block.setAttribute('type', templateName);
      block.setAttribute('gap', 16);
      if (Blockly.Procedures.flyoutOptions.inlineArgs) {
        block.setAttribute('inline', true);
      }
      var mutation = goog.dom.createDom('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      for (var j = 0; j < args.length; j++) {
        var arg = goog.dom.createDom('arg');
        arg.setAttribute('name', args[j]);
        mutation.appendChild(arg);
      }
      xmlList.push(block);
    }
  }

  var tuple = Blockly.Procedures.allProcedures(workspace);
  populateProcedures(tuple[0], 'procedures_callnoreturn');
  populateProcedures(tuple[1], 'procedures_callreturn');
  return xmlList;
};
