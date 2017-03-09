// Adapt to our custom Blockly.Variables.promptName behavior
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    var cb = function(text) {
      if (text) {
        workspace.renameVariable(oldVar, text);
      }
    };
    text = Blockly.Variables.promptName(
        Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar, cb);
    return null;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1',
      this.getText())) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};
