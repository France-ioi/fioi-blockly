Blockly.JavaScript['tables_2d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.JavaScript.definitions_['tables_2d_init'] = '' +
    'function table2dInit(x, y, a) {\n' +
    '    if(x > 1000000 || y > 1000000) { throw "' + Blockly.Msg.TABLES_TOO_BIG +'"; }\n' +
    '    var table = [];\n' +
    '    var row = [];\n' +
    '    for(var i = 0; i < y; i++) {\n' +
    '        row[i] = a;\n' +
    '    }\n' +
    '    for(var i = 0; i < x; i++) {\n' +
    '        table[i] = row.slice(0);\n' +
    '    }\n' +
    '    return table;\n' +
    '}\n';

  var at1 = Blockly.JavaScript.valueToCode(block, 'LINES', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at2 = Blockly.JavaScript.valueToCode(block, 'COLS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  return 'var ' + varName + ' = table2dInit(' + at1 + ', ' + at2 + ', ' + value + ');\n';
}

Blockly.JavaScript['tables_2d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  var code = "if(typeof " + varName + "[" + at1 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "] == 'undefined') { throw \"" + Blockly.Msg.TABLES_OUT_OF_BOUNDS + "\"; }\n";
  code += varName + '[' + at1 + '][' + at2 + '] = ' + value + ";\n";
  return code;
}

Blockly.JavaScript['tables_2d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

Blockly.JavaScript['tables_3d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.JavaScript.definitions_['tables_3d_init'] = '' +
    'function table3dInit(x, y, z, a) {\n' +
    '    if(x > 1000000 || y > 1000000 || z > 1000000) { throw "' + Blockly.Msg.TABLES_TOO_BIG +'"; }\n' +
    '    var table = [];\n' +
    '    var row = [];\n' +
    '    for(var i = 0; i < z; i++) {\n' +
    '        row[i] = a;\n' +
    '    }\n' +
    '    for(var i = 0; i < x; i++) {\n' +
    '        var layer = [];\n' +
    '        for(var j = 0; j < y; j++) {\n' +
    '            layer[j] = row.slice(0);\n' +
    '        }\n' +
    '        table[i] = layer;\n' +
    '    }\n' +
    '    return table;\n' +
    '}\n';

  var at1 = Blockly.JavaScript.valueToCode(block, 'LAYERS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at2 = Blockly.JavaScript.valueToCode(block, 'LINES', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at3 = Blockly.JavaScript.valueToCode(block, 'COLS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  return 'var ' + varName + ' = table3dInit(' + at1 + ', ' + at2 + ', ' + at3 + ', ' + value + ');\n';
}

Blockly.JavaScript['tables_3d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LAYER');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at3 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  var code = "if(typeof " + varName + "[" + at1 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "][" + at3 + "] == 'undefined') { throw \"" + Blockly.Msg.TABLES_OUT_OF_BOUNDS + "\"; }\n";
  code += varName + '[' + at1 + '][' + at2 + '][' + at3 + '] = ' + value + ";\n";
  return code;
}

Blockly.JavaScript['tables_3d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LAYER');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at3 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + '][' + at3 + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

