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
    var msgTimeout = null;
    textInput.validate_ = function(text) {
      var validationMsg = null;
      goog.asserts.assertObject(Blockly.FieldTextInput.htmlInput_);
      var htmlInput = Blockly.FieldTextInput.htmlInput_;
      if (this.sourceBlock_) {
        // Use the expression validator
        validationMsg = Blockly.validateExpression(htmlInput.value, this.sourceBlock_.workspace);
      }
      if(validationMsg !== null) {
        Blockly.addClass_(htmlInput, 'blocklyInvalidInput');
        if(msgTimeout) { clearTimeout(msgTimeout); }
        msgTimeout = setTimeout(function() {
          thisBlock.setWarningText(Blockly.Msg.TEXT_EVAL_INVALID.replace('%1', validationMsg));
          textInput.resizeEditor_();
          }, 2000);
      } else {
        Blockly.removeClass_(htmlInput, 'blocklyInvalidInput');
        thisBlock.setWarningText(null);
        if(msgTimeout) {
          clearTimeout(msgTimeout);
          msgTimeout = null;
        }
      }
    };

    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_EVAL_TITLE)
        .appendField(textInput, 'EXPR')
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.TEXT_EVAL_TOOLTIP);
  }
};

Blockly.Blocks['text_str'] = {
  /**
   * Block to convert to string.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": Blockly.Msg.TEXT_STR_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "EXPR"
        }
      ],
      "output": "String",
      "colour": Blockly.Colours ? Blockly.Colours.texts.primary : Blockly.Blocks.texts.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.texts.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.texts.tertiary : null,
      "tooltip": Blockly.Msg.TEXT_STR_TOOLTIP
    });
  }
};