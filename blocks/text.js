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

Blockly.Blocks['text_eval'] = {
  // Block to evaluate an expression
  init: function() {
    if(Blockly.Colours) {
      this.setColour(Blockly.Colours.texts.primary, Blockly.Colours.texts.secondary, Blockly.Colours.texts.tertiary);
    } else {
      this.setColour(Blockly.Blocks.texts.HUE);
    }
    var textInput = new Blockly.FieldTextInput('');

    // Override validate_ behavior to highlight in red but not erase the field
    var thisBlock = this;
    textInput.validate_ = function(text) {
      var valid = true;
      goog.asserts.assertObject(Blockly.FieldTextInput.htmlInput_);
      var htmlInput = Blockly.FieldTextInput.htmlInput_;
      if (this.sourceBlock_) {
        // Use the expression validator
        valid = Blockly.validateExpression(htmlInput.value, this.sourceBlock_.workspace);
      }
      if(!valid) {
        Blockly.addClass_(htmlInput, 'blocklyInvalidInput');
        thisBlock.setWarningText(Blockly.Msg.TEXT_EVAL_INVALID);
      } else {
        Blockly.removeClass_(htmlInput, 'blocklyInvalidInput');
        thisBlock.setWarningText(null);
      }
    };

    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_EVAL_TITLE)
        .appendField(textInput, 'EXPR')
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.TEXT_EVAL_TOOLTIP);
  }
};
