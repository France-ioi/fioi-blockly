Blockly.Python['text_print_noend'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ', end="")\n';
};

Blockly.Python['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  if(Blockly.validateExpression(expr) === null) {
    return [expr, Blockly.Python.ORDER_NONE];
  } else {
    return ['False', Blockly.Python.ORDER_ATOMIC];
  }
};
