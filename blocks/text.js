Blockly.Blocks['text_print_noend'] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TEXT_PRINT_NOEND_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.texts.primary : Blockly.Blocks.texts.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.texts.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.texts.tertiary : null,
      "tooltip": Blockly.Msg.TEXT_PRINT_NOEND_TOOLTIP,
      "helpUrl": Blockly.Msg.TEXT_PRINT_HELPURL
    });
  }
};
