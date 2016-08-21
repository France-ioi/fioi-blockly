Blockly.FieldVariable.prototype.classValidator = function(text) {
  function promptName(promptText, defaultText) {
    Blockly.hideChaff();
    var newVar = window.prompt(promptText, defaultText);
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      // Allow only
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE ||
          !(/^[a-zA-Z_]\w*$/.test(newVar))) {
        newVar = null;
      }
    }
    return newVar;
  }
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    text = promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),
                      oldVar);
    if (text) {
      Blockly.Variables.renameVariable(oldVar, text, workspace);
    }
    return null;
  } else if (text == Blockly.Msg.NEW_VARIABLE) {
    text = promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '');
    // Since variables are case-insensitive, ensure that if the new variable
    // matches with an existing variable, the new case prevails throughout.
    if (text) {
      Blockly.Variables.renameVariable(text, text, workspace);
      return text;
    }
    return null;
  }
  return undefined;
};
