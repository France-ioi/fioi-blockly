Blockly.Blocks['procedures_defnoreturn'].init = function() {
  var nameField = new Blockly.FieldTextInput('',
      Blockly.Procedures.rename);
  nameField.setSpellcheck(false);
  this.appendDummyInput()
      .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
      .appendField(nameField, 'NAME')
      .appendField('', 'PARAMS');
  this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
  if ((this.workspace.options.comments ||
       (this.workspace.options.parentWorkspace &&
        this.workspace.options.parentWorkspace.options.comments)) &&
      Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT) {
    this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
  }
  this.setColour(Blockly.Blocks.procedures.HUE);
  this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
  this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
  this.arguments_ = [];
  this.setStatements_(true);
  this.statementConnection_ = null;
};


Blockly.Blocks['procedures_defreturn'].init = function() {
  var nameField = new Blockly.FieldTextInput('',
      Blockly.Procedures.rename);
  nameField.setSpellcheck(false);
  this.appendDummyInput()
      .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
      .appendField(nameField, 'NAME')
      .appendField('', 'PARAMS');
  this.appendValueInput('RETURN')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
  this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
  if ((this.workspace.options.comments ||
       (this.workspace.options.parentWorkspace &&
        this.workspace.options.parentWorkspace.options.comments)) &&
      Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT) {
    this.setCommentText(Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT);
  }
  this.setColour(Blockly.Blocks.procedures.HUE);
  this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
  this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
  this.arguments_ = [];
  this.setStatements_(true);
  this.statementConnection_ = null;
};
