Blockly.JavaScript['lists_append'] = function(block) {
  // Append
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  return varName + '.push(' + value + ');\n';
};
