Blockly.Python['dict_get'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dict_get_literal'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.quote_(block.getFieldValue('ITEM'));
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dict_set_literal'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var key = Blockly.Python.quote_(block.getFieldValue('ITEM'));
  var value = Blockly.Python.valueToCode(block, 'VAL',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + key + '] = ' + value + '\n';
  return code;
};


Blockly.Python['dicts_create_with'] = function(block) {
    var value_keys = Blockly.Python.valueToCode(block, 'keys', Blockly.   Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = Blockly.Python.quote_(block.getFieldValue('KEY' + n));
        var value = Blockly.Python.valueToCode(block, 'VALUE' + n,
                Blockly.Python.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = '{' + code.join(', ') + '}';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['dict_keys'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var code = dict + '.keys()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

