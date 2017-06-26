Blockly.JavaScript['lists_append'] = function(block) {
  // Append
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  return varName + '.push(' + value + ');\n';
};

Blockly.JavaScript['lists_sort_place'] = function(block) {
  // Javascript default sort is lexicographic, which doesn't work for numbers.
  // By using the normal compare operator, we circumvent this issue; moreover,
  // it returns false for uncomparable values, which will in this case not
  // modify the place of these values in the list.
  Blockly.JavaScript.definitions_['list_sort_auto'] = ""
    + "function list_sort_auto(a, b) {\n"
    + "    if(a === b) {\n"
    + "        return 0;\n"
    + "    } else if(a > b) {\n"
    + "        return 1;\n"
    + "    } else {\n"
    + "        return -1;\n"
    + "    }\n"
    + "};\n"
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + '.sort(list_sort_auto);\n';
};
