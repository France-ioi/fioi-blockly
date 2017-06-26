Blockly.Python['lists_append'] = function(block) {
  // Append
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  return varName + '.append(' + value + ')\n';
};

Blockly.Python['lists_sort_place'] = function(block) {
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + '.sort()\n';
};

