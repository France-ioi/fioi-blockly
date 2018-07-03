Blockly.Python['text_print_noend'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ', end="")\n';
};

Blockly.Python['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  var reindexExpr = Blockly.reindexExpression(expr);
  if(reindexExpr === null) {
    return ['false', Blockly.Python.ORDER_ATOMIC];
  } else {
    return [reindexExpr, Blockly.Python.ORDER_NONE];
  }
};
