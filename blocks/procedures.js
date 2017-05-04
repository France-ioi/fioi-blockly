Blockly.Blocks['procedures_callnoreturn'].renameProcedure = function(oldName, newName, force) {
  if (!force && Blockly.disableRenameEvents) { return; }
  if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
    this.setFieldValue(newName, 'NAME');
    this.setTooltip(
        (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
         Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
        .replace('%1', newName));
  }
};

Blockly.Blocks['procedures_callnoreturn'].domToMutation = function(xmlElement) {
  var name = xmlElement.getAttribute('name');
  this.renameProcedure(this.getProcedureCall(), name, true);
  var args = [];
  var paramIds = [];
  for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
    if (childNode.nodeName.toLowerCase() == 'arg') {
      args.push(childNode.getAttribute('name'));
      paramIds.push(childNode.getAttribute('paramId'));
    }
  }
  this.setProcedureParameters_(args, paramIds);
};


Blockly.Blocks['procedures_callreturn'].renameProcedure = Blockly.Blocks['procedures_callnoreturn'].renameProcedure;
Blockly.Blocks['procedures_callreturn'].domToMutation = Blockly.Blocks['procedures_callnoreturn'].domToMutation;
