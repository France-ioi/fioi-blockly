Blockly.JavaScript['text_print_noend'] = Blockly.JavaScript['text_print'];

Blockly.JavaScript['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  if(Blockly.validateExpression(expr)) {
    return [expr, Blockly.JavaScript.ORDER_NONE];
  } else {
    return ['false', Blockly.JavaScript.ORDER_ATOMIC];
  }
};
