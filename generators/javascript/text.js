Blockly.JavaScript['text_print_noend'] = Blockly.JavaScript['text_print'];

Blockly.JavaScript['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  var reindexExpr = Blockly.reindexExpression(expr);
  if(reindexExpr === null) {
    return ['false', Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    return [reindexExpr, Blockly.JavaScript.ORDER_NONE];
  }
};
