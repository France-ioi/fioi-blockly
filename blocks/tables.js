if(typeof Blockly.Blocks.tables === 'undefined') {
  Blockly.Blocks.tables = {};
}

Blockly.Blocks.tables.HUE = 100;

Blockly.Blocks['tables_2d_init'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_INIT,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINES"
        },
        {
          "type": "input_value",
          "name": "COLS"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_INIT_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_2d_set'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_SET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_2d_get'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_GET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        }
      ],
      "inputsInline": true,
      "output": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_GET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_init'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_INIT,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYERS",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "LINES"
        },
        {
          "type": "input_value",
          "name": "COLS"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_INIT_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_set'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYER"
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_SET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_get'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_GET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYER"
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        }
      ],
      "inputsInline": true,
      "output": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_GET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};
