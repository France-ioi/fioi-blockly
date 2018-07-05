Blockly.JavaScript['input_num'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  var code = 'parseInt(readStdin())';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_num_next'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                + "    while (stdinBuffer.trim() == '')\n"
                                                + "        stdinBuffer = readline();\n"
                                                + "    if (typeof stdinBuffer === 'undefined')\n"
                                                + "        stdinBuffer = '';\n"
                                                + "    var re = /\\S+\\s*/;\n"
                                                + "    var w = re.exec(stdinBuffer);\n"
                                                + "    var stdinBuffer = stdinBuffer.substr(re.lastIndex);\n"
                                                + "    return w;\n"
                                                + "};";
  var code = 'parseInt(input_word())';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_char'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_char'] = "function input_char() {\n"
                                                + "    var buf = readStdin();\n";
                                                + "    stdinBuffer = stdinBuffer.substr(1);\n";
                                                + "    return buf.substr(0, 1);\n";
                                                + "};\n";
  var code = 'input_char()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_word'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                + "    while (stdinBuffer.trim() == '')\n"
                                                + "        stdinBuffer = readline();\n"
                                                + "    if (typeof stdinBuffer === 'undefined')\n"
                                                + "        stdinBuffer = '';\n"
                                                + "    var re = /\\S+\\s*/;\n"
                                                + "    var w = re.exec(stdinBuffer);\n"
                                                + "    var stdinBuffer = stdinBuffer.substr(re.lastIndex);\n"
                                                + "    return w;\n"
                                                + "};";
  var code = 'input_word()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_line'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  var code = 'readStdin()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_num_list'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_num_list'] = "function input_num_list() {\n"
                                                    + "    var parts = readStdin().split(/\\s+/);\n"
                                                    + "    for(var i=0; i<parts.length; i++) {\n"
                                                    + "        parts[i] = parseInt(parts[i]);\n"
                                                    + "    }\n"
                                                    + "    return parts;\n"
                                                    + "};";
  var code = 'input_num_list()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
