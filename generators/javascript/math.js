Blockly.JavaScript['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
    // Handled separately :
    'DIVIDEFLOOR': [null, Blockly.JavaScript.ORDER_NONE],
    'POWER': [null, Blockly.JavaScript.ORDER_NONE]
  };

  var op = block.getFieldValue('OP');
  var tuple = OPERATORS[op];
  var operator = tuple[0];
  var order = tuple[1];

  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  var code;
  if(op == 'DIVIDEFLOOR') {
    code = 'Math.floor((' + argument0 + ') / (' + argument1 + '))';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  // Power in JavaScript requires a special case since it has no operator.
  if(op == 'POWER') {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
      Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var incrCode = varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', "+varName+", '"+varName+"');\n";

  return incrCode + reportCode;
};
