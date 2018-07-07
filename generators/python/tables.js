Blockly.Python['tables_2d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.Python.definitions_['tables_2d_init'] = '' +
    'def table2dInit(x, y, a):\n' +
    '    if x > 1000000 or y > 1000000: raise IndexError("' + Blockly.Msg.TABLES_TOO_BIG +'")\n' +
    '    return [[a] * y for i in range(x)]';

  var at1 = Blockly.Python.valueToCode(block, 'LINES', Blockly.Python.ORDER_COMMA) || '0';
  var at2 = Blockly.Python.valueToCode(block, 'COLS', Blockly.Python.ORDER_COMMA) || '0';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_ASSIGNMENT) || 'null';

  return varName + ' = table2dInit(' + at1 + ', ' + at2 + ', ' + value + ');\n';
}

Blockly.Python['tables_2d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at2 = Blockly.Python.getAdjustedInt(block, 'COL');
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || 'None';

  var code = '';
  // TODO :: set this as an option
//  code += 'if ' + at1 + ' >= len(' + varName + ') or ' + at2 + ' >= len(' + varName + '[' + at1 + ']): raise IndexError("' + Blockly.Msg.TABLES_OUT_OF_BOUNDS + '")\n';
  code += varName + '[' + at1 + '][' + at2 + '] = ' + value + "\n";
  return code;
}

Blockly.Python['tables_2d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at2 = Blockly.Python.getAdjustedInt(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
}

Blockly.Python['tables_3d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.Python.definitions_['tables_3d_init'] = '' +
    'def table3dInit(x, y, z, a):\n' +
    '    if x > 1000000 or y > 1000000 or z > 1000000: raise IndexError("' + Blockly.Msg.TABLES_TOO_BIG +'")\n' +
    '    return [[[a] * z for i in range(y)] for j in range(x)]';

  var at1 = Blockly.Python.valueToCode(block, 'LAYERS', Blockly.Python.ORDER_COMMA) || '0';
  var at2 = Blockly.Python.valueToCode(block, 'LINES', Blockly.Python.ORDER_COMMA) || '0';
  var at3 = Blockly.Python.valueToCode(block, 'COLS', Blockly.Python.ORDER_COMMA) || '0';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_ASSIGNMENT) || 'null';

  return varName + ' = table3dInit(' + at1 + ', ' + at2 + ', ' + at3 + ', ' + value + ');\n';
}

Blockly.Python['tables_3d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LAYER');
  var at2 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at3 = Blockly.Python.getAdjustedInt(block, 'COL');
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || 'None';

  var code = '';
  // TODO :: set this as an option
//  code += 'if ' + at1 + ' >= len(' + varName + ') or ' + at2 + ' >= len(' + varName + '[' + at1 + ']) or ' + at3 + ' >= len(' + varName + '[' + at1 + '][' + at2 + ']): raise IndexError("' + Blockly.Msg.TABLES_OUT_OF_BOUNDS + '")\n';
  code += varName + '[' + at1 + '][' + at2 + '][' + at3 + '] = ' + value + "\n";
  return code;
}

Blockly.Python['tables_3d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LAYER');
  var at2 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at3 = Blockly.Python.getAdjustedInt(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + '][' + at3 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
}

