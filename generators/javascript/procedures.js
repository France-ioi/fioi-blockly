Blockly.JavaScript['procedures_return'] = function (block) {
    if (block.hasReturnValue_) {
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
            Blockly.JavaScript.ORDER_NONE) || 'null';
        return 'return ' + value + ';\n';
    } else {
        return 'return;\n';
    }
};