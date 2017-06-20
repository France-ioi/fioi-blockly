Blockly.Python['input_num'] = function(block) {
  var code = 'int(input())';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_num_next'] = function(block) {
  // TODO :: make a more optimized version of this
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  Blockly.Python.definitions_['from_string_import_whitespace'] = 'from string import whitespace';
  Blockly.Python.definitions_['input_word'] = "def input_word():\n"
                                            + "    buffer = ''\n"
                                            + "    newchar = 'c'\n"
                                            + "    while newchar:\n"
                                            + "        newchar = sys.stdin.read(1)\n"
                                            + "        if newchar in whitespace:\n"
                                            + "            if buffer: break\n"
                                            + "        else:\n"
                                            + "            buffer += newchar\n"
                                            + "    return buffer\n";
  var code = 'int(input_word())';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_char'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  var code = 'sys.stdin.read(1)';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_word'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  Blockly.Python.definitions_['from_string_import_whitespace'] = 'from string import whitespace';
  Blockly.Python.definitions_['input_word'] = "def input_word():\n"
                                            + "    buffer = ''\n"
                                            + "    newchar = 'c'\n"
                                            + "    while newchar:\n"
                                            + "        newchar = sys.stdin.read(1)\n"
                                            + "        if newchar in whitespace:\n"
                                            + "            if buffer: break\n"
                                            + "        else:\n"
                                            + "            buffer += newchar\n"
                                            + "    return buffer\n";
  var code = 'input_word()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_line'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  var code = 'sys.stdin.readline()[:-1]';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_num_list'] = function(block) {
  var code = 'list(map(int, input().split()))';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

