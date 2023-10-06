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

Blockly.JavaScript['text_str'] = function (block) {
  Blockly.JavaScript.definitions_['text_str'] = '' +
    'function textStr(x, forceStr) {\n' +
    '  if(Array.isArray(x)) {\n' +
    '    var strs = [];\n' +
    '    for(var i = 0; i < x.length; i++) {\n' +
    '       strs[i] = textStr(x[i], true);\n' +
    '    }\n' +
    '    return "["+strs.join(\', \')+"]";\n' +
    '  } else if(x && typeof x == "object" && Object.prototype.toString(x) === "[object Object]") {\n' +
    '    var strs = [];\n' +
    '    for(var key in x) {\n' +
    '       if(key == "constructor") continue;\n' +
    '       strs.push("\'" + key + "\': " + textStr(x[key], true));\n' +
    '    }\n' +
    '    return "{"+strs.join(\', \')+"}";\n' +
    '  } else if(x && forceStr && typeof x == "string") {\n' +
    '    return "\\"" + x + "\\"";\n' +
    '  } else if(x) {\n' +
    '    return String(x);\n' +
    '  } else {\n' +
    '    return "" + x;\n' +
    '  }\n' +
    '}\n';

  var expr = Blockly.JavaScript.valueToCode(block, 'EXPR', Blockly.JavaScript.ORDER_NONE) || 'null';
  return ['textStr(' + expr + ')', Blockly.JavaScript.ORDER_ATOMIC];
}