Blockly.Python['procedures_return'] = function (block) {
    // Conditionally return value from a procedure.
    if (block.hasReturnValue_) {
        var value = Blockly.Python.valueToCode(block, 'VALUE',
            Blockly.Python.ORDER_NONE) || 'None';
        return 'return ' + value + '\n';
    } else {
        return 'return\n';
    }
};
