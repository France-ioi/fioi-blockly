Blockly.Blocks.inputs = {};

Blockly.Blocks.inputs.HUE = 345;


Blockly.Blocks['input_num'] = {
  // Read a number.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_NUM);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.INPUT_NUM_TOOLTIP);
  }
};

Blockly.Blocks['input_char'] = {
  // Read a character.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_CHAR);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_CHAR_TOOLTIP);
  }
};

Blockly.Blocks['input_word'] = {
  // Read a word.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_WORD);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_WORD_TOOLTIP);
  }
};

Blockly.Blocks['input_line'] = {
  // Read a line.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_LINE);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_LINE_TOOLTIP);
  }
};
