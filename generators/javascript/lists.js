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

Blockly.JavaScript['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.JavaScript.valueToCode(block, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var value = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'tmpList', Blockly.Variables.NAME_TYPE);
    var code = 'var ' + listVar + ' = ' + list + ';\n';
    list = listVar;
    return code;
  }
  switch (where) {
    case ('FIRST'):
      if (mode == 'SET') {
        return list + '[0] = ' + value + ';\n';
      } else if (mode == 'INSERT') {
        return list + '.unshift(' + value + ');\n';
      }
      break;
    case ('LAST'):
      if (mode == 'SET') {
        var code = cacheList();
        code += list + '[' + list + '.length - 1] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        return list + '.push(' + value + ');\n';
      }
      break;
    case ('FROM_START'):
      var at = Blockly.JavaScript.getAdjusted(block, 'AT');
      if (mode == 'SET') {
        var code = 'if(' + at + ' > 1000000) { throw "List index > 1000000"; }\n';
        code += list + '[' + at + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        return list + '.splice(' + at + ', 0, ' + value + ');\n';
      }
      break;
    case ('FROM_END'):
      var at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, false,
          Blockly.JavaScript.ORDER_SUBTRACTION);
      var code = cacheList();
      if (mode == 'SET') {
        code += 'if(' + list + '.length - ' + at + ' > 1000000) { throw "List index > 1000000"; }\n';
        code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
            ');\n';
        return code;
      }
      break;
    case ('RANDOM'):
      var code = cacheList();
      var xVar = Blockly.JavaScript.variableDB_.getDistinctName(
          'tmpX', Blockly.Variables.NAME_TYPE);
      code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
          '.length);\n';
      if (mode == 'SET') {
        code += list + '[' + xVar + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
        return code;
      }
      break;
  }
  throw 'Unhandled combination (lists_setIndex).';
};

