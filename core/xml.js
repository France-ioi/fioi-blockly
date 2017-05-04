Blockly.Xml.domToWorkspaceOriginal = Blockly.Xml.domToWorkspace;

Blockly.Xml.domToWorkspace = function(xml, workspace) {
  Blockly.disableRenameEvents = true;
  Blockly.Xml.domToWorkspaceOriginal(xml, workspace);
  Blockly.disableRenameEvents = false;
}
