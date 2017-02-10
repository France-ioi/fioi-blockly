if(typeof Blockly.Blocks.lists === 'undefined') {
  Blockly.Blocks.lists = {};
}

Blockly.Blocks.lists.HUE = 100;

Blockly.Blocks['lists_append'] = {
  /**
   * Block for appending to a list in place.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.LISTS_APPEND_MSG,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "liste"
        },
        {
          "type": "input_value",
          "name": "ITEM",
          "check": "Number"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE,
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.LISTS_APPEND_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};


