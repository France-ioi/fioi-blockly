Blockly.JavaScript['dict_get'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dict_get_literal'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = block.getFieldValue('ITEM');
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dict_set_literal'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var key = block.getFieldValue('ITEM');
  var value = Blockly.Python.valueToCode(block, 'VAL',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '.' + key + ' = ' + value + ';\n';
  return code;
};


Blockly.JavaScript['dicts_create_with'] = function(block) {
    var value_keys = Blockly.JavaScript.valueToCode(block, 'keys', Blockly.   JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = block.getFieldValue('KEY' + n);
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE' + n,
                Blockly.JavaScript.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = 'Object({' + code.join(', ') + '})';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_keys'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var code = 'Object.keys(' + dict + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

