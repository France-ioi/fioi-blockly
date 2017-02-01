Blockly.FieldVariable.prototype.classValidator = function(text) {
  function promptName(promptText, defaultText) {
    Blockly.hideChaff();
    var newVar = window.prompt(promptText, defaultText);
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      // Allow only
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE ||
          !(/^[a-zA-Z_]\w*$/.test(newVar))) {
        newVar = null;
      }
    }
    return newVar;
  }
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    text = promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),
                      oldVar);
    if (text) {
      Blockly.Variables.renameVariable(oldVar, text, workspace);
    }
    return null;
  } else if (text == Blockly.Msg.NEW_VARIABLE) {
    text = promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '');
    // Since variables are case-insensitive, ensure that if the new variable
    // matches with an existing variable, the new case prevails throughout.
    if (text) {
      Blockly.Variables.renameVariable(text, text, workspace);
      return text;
    }
    return null;
  }
  return undefined;
};

// Options for the variables flyout
Blockly.Variables.flyoutOptions = {
  any: true, // Allow to create any variable
  anyButton: true, // Add the button to add variables (needs any=true)
  fixed: [], // List of fixed variables (will create blocks for each of them)
  includedBlocks: {get: true, set: true, incr: true}, // Blocks to add to the list
  shortList: true, // Generate set/incr blocks only for the first (non-fixed) variable
  };

// Construct the blocks required by the flyout for the variable category.
Blockly.Variables.flyoutCategory = function(workspace) {
  var xmlList = [];

  var options = Blockly.Variables.flyoutOptions;

  if(options.any) {
    if(workspace) {
      var fullVariableList = workspace.variableList;
    } else {
      if(options.fixed.indexOf('newvar') > -1) {
        var newVarIdx = 0;
        while(options.fixed.indexOf('newvar'+newVarIdx) > -1) {
          newVarIdx++;
        }
        var fullVariableList = ['newvar'+newVarIdx];
      } else {
        var fullVariableList = ['newvar'];
      }
    }
    for(var i=0; i<options.fixed.length; i++) {
      var idx = fullVariableList.indexOf(options.fixed[i]);
      if(idx > -1) {
        fullVariableList.splice(idx, 1);
      }
    }
    fullVariableList.sort(goog.string.caseInsensitiveCompare);

    if(options.anyButton) {
      var button = goog.dom.createDom('button');
      button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
      xmlList.push(button);
    }
  } else {
    var fullVariableList = [];
  }

  var variableList = options.fixed.concat(fullVariableList);

  if (variableList.length > 0) {
    if (Blockly.Blocks['variables_get']) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_get" gap="8">
        //   <field name="VAR">item</field>
        // </block>
        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_get');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');

        block.appendChild(field);
        xmlList.push(block);
      }
    }

    if (options.includedBlocks.set && Blockly.Blocks['variables_set']) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_set" gap="20">
        //   <field name="VAR">item</field>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_set');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');

        block.appendChild(field);
        xmlList.push(block);
      }
    }
    if (options.includedBlocks.incr && Blockly.Blocks['math_change']) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="math_change">
        //   <value name="DELTA">
        //     <shadow type="math_number">
        //       <field name="NUM">1</field>
        //     </shadow>
        //   </value>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'math_change');
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }
        var value = goog.dom.createDom('value');
        value.setAttribute('name', 'DELTA');
        block.appendChild(value);

        var field = goog.dom.createDom('field', null, variableList[i]);
        field.setAttribute('name', 'VAR');
        block.appendChild(field);

        var shadowBlock = goog.dom.createDom('shadow');
        shadowBlock.setAttribute('type', 'math_number');
        value.appendChild(shadowBlock);

        var numberField = goog.dom.createDom('field', null, '1');
        numberField.setAttribute('name', 'NUM');
        shadowBlock.appendChild(numberField);

        xmlList.push(block);
      }
    }

  }
  return xmlList;
};


Blockly.Msg.VARIABLES_DEFAULT_NAME = "element";
Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

Blockly.Msg.DICTS_CREATE_EMPTY_TITLE = "dictionnaire vide";
Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Créer un dictionnaire";
Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH = "créer un dictionnaire :";
Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY = "cle";
Blockly.Msg.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE = "clé/valeur";
Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP = "";
Blockly.Msg.DICT_GET = "récupérer la clé";
Blockly.Msg.DICT_GET_TO = "de";
Blockly.Msg.DICT_KEYS = "liste des clés de";
Blockly.Msg.LISTS_APPEND_MSG = "à la liste %1 ajouter l'élément %2";
Blockly.Msg.LISTS_APPEND_TOOLTIP = "Ajouter un élément à la liste '%1'";
Blockly.Msg.TEXT_PRINT_TITLE = "afficher la ligne %1";
Blockly.Msg.TEXT_PRINT_TOOLTIP = "Afficher le texte, le nombre ou une autre valeur spécifiée, avec retour à la ligne après.";
Blockly.Msg.TEXT_PRINT_NOEND_TITLE = "afficher %1";
Blockly.Msg.TEXT_PRINT_NOEND_TOOLTIP = "Afficher le texte, le nombre ou une autre valeur spécifiée, sans retour à la ligne.";

Blockly.Msg.INPUT_NUM = "lire un nombre";
Blockly.Msg.INPUT_NUM_TOOLTIP = "Lit un nombre sur l'entrée du programme.";
Blockly.Msg.INPUT_CHAR = "lire un caractère";
Blockly.Msg.INPUT_CHAR_TOOLTIP = "Lit un caractère sur l'entrée du programme.";
Blockly.Msg.INPUT_WORD = "lire un mot";
Blockly.Msg.INPUT_WORD_TOOLTIP = "Lit un mot sur l'entrée du programme.";
Blockly.Msg.INPUT_LINE = "lire une ligne";
Blockly.Msg.INPUT_LINE_TOOLTIP = "Lit une ligne sur l'entrée du programme.";

Blockly.Blocks.dicts = {};

Blockly.Blocks.dicts.HUE = 0;


Blockly.Blocks['dict_get'] = {
  // Set element at index.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('ITEM');
    this.appendValueInput('DICT')
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_GET_TO);
    this.setInputsInline(false);
    this.setOutput(true);
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  }
};

Blockly.Blocks['dict_get_literal'] = {
  // Set element at index.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);   
    this.appendValueInput('DICT')
        //.appendField('get') // TODO: fix this to be outside
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput(
                     Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY),
                     'ITEM')
        .appendField(this.newQuote_(false))
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_GET_TO);
    this.setInputsInline(false);
    this.setOutput(true);
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAA0UlEQVQY023QP0oDURSF8e8MImhlUIiCjWKhrUUK3YCIVkq6bMAF2LkCa8ENWLoNS1sLEQKprMQ/GBDks3kDM+Oc8nfPfTxuANQTYBeYAvdJLL4FnAFfwF2ST9Rz27kp5YH/kwrYp50LdaXHAU4rYNYzWAdeenx7AbgF5sAhcARsAkkyVQ+ACbAKjIGqta4+l78udXxc/LiJG+qvet0pV+q7+tHE+iJzdbGz8FhmOzVcqj/qq7rcKI7Ut1Leq70C1oCrJMMk343HB8ADMEzyVOMff72l48gwfqkAAAAASUVORK5CYII=';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAvklEQVQY022PoapCQRRF97lBVDRYhBcEQcP1BwS/QLAqr7xitZn0HzRr8Rts+htmQdCqSbQIwmMZPMIw3lVmZu0zG44UAFSBLdBVBDAFZqFo8eYKtANfBC7AE5h8ZNOHd1FrDnh4VgmDO3ADkujDHPgHfkLZ84bfaLjg/hD6RFLq9z6wBDr+rvuZB1bAEDABY76pA2mGHyWSjvqmIemc4WsCLKOp4nssIj8wD8qS/iSVJK3N7OTeJPV9n72ZbV7iDuSc2BaQBQAAAABJRU5ErkJggg==';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};

Blockly.Blocks['dict_keys'] = {
  // Set element at index.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_KEYS);
    this.setInputsInline(false);
    this.setOutput(true, 'Array');
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  }
};

Blockly.Blocks['dicts_create_with_container'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with_item'] = {
  // Add items.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};
Blockly.Blocks['dicts_create_with'] = {
    /**
     * Block for creating a dict with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function() {
        this.setInputsInline(false);
        this.setColour(Blockly.Blocks.dicts.HUE);
        this.itemCount_ = 1;
        this.updateShape_();
        this.setOutput(true, 'dict');
        this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent dict inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function(workspace) {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the dict inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        // Delete everything.
        if (this.getInput("EMPTY")) {
            this.removeInput('EMPTY');
        }
        for (var i = 0; this.getInput('VALUE' + i); i++) {
            //this.getInput('VALUE' + i).removeField("KEY"+i);
            this.removeInput('VALUE' + i);
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
        } else {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
            for (var i = 0; i < this.itemCount_; i++) {
                this.appendValueInput('VALUE' + i)
                    .setCheck(null)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(
                          new Blockly.FieldTextInput(
                              Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY),
                         'KEY'+i)
                   .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_MAPPING);
            }
        }
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock =
            Blockly.Block.obtain(workspace, 'dicts_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
          var itemBlock = Blockly.Block.obtain(workspace, 'dicts_create_with_item');
          itemBlock.initSvg();
          connection.connect(itemBlock.previousConnection);
          connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('VALUE' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        // Store a pointer to any connected child blocks.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 0;
        while (itemBlock) {
            var value_input = this.getInput('VALUE' + x);
            itemBlock.valueConnection_ = value_input && value_input.connection.targetConnection;
            x++;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
        }
    }
};

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



Blockly.Blocks['logic_compare'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var rtlOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['>', 'LT'],
      ['>=', 'LTE'],
      ['<', 'GT'],
      ['<=', 'GTE']
    ];
    var ltrOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['<', 'LT'],
      ['<=', 'LTE'],
      ['>', 'GT'],
      ['>=', 'GTE']
    ];
    var OPERATORS = this.RTL ? rtlOperators : ltrOperators;
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  },
  /**
   * Called whenever anything on the workspace changes.
   * Prevent mismatched types from being compared.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(e) {
    var blockA = this.getInputTargetBlock('A');
    var blockB = this.getInputTargetBlock('B');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      // Ensure that any disconnections are grouped with the causing event.
      Blockly.Events.setGroup(e.group);
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.unplug();
          block.bumpNeighbours_();
        }
      }
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  }
};


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
      "colour": Blockly.Blocks.texts.HUE,
      "tooltip": Blockly.Msg.TEXT_PRINT_NOEND_TOOLTIP,
      "helpUrl": Blockly.Msg.TEXT_PRINT_HELPURL
    });
  }
};

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.JavaScript.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.JavaScript.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.JavaScript.functionNames_ = Object.create(null);

  if (!Blockly.JavaScript.variableDB_) {
    Blockly.JavaScript.variableDB_ =
        new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_);
  } else {
    Blockly.JavaScript.variableDB_.reset();
  }
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
Blockly.JavaScript.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/"/g, '\\"');
  return '"' + string + '"';
};


Blockly.JavaScript['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.JavaScript.valueToCode(block, 'BY',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (var ' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'var ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'var ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.JavaScript.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += 'var ' + incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'Math.abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + '; ' +
        incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + '; ' +
        variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'var ' + varName + ' = ' + argument0 + ';\n';
};

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Python.init = function(workspace) {
  /**
   * Empty loops or conditionals are not allowed in Python.
   */
  Blockly.Python.PASS = this.INDENT + 'pass\n';
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Python.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Python.functionNames_ = Object.create(null);

  if (!Blockly.Python.variableDB_) {
    Blockly.Python.variableDB_ =
        new Blockly.Names(Blockly.Python.RESERVED_WORDS_);
  } else {
    Blockly.Python.variableDB_.reset();
  }
};

/**
 * Encode a string as a properly escaped Python string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly.Python.quote_ = function(string) {
  // Can't use goog.string.quote since % must also be escaped.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/"/g, '\\"');
  return '"' + string + '"';
};

Blockly.JavaScript['dict_get'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dict_get_literal'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = block.getFieldValue('ITEM');
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dicts_create_with'] = function(block) {
    var value_keys = Blockly.JavaScript.valueToCode(block, 'keys', Blockly.   JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = block.getFieldValue('KEY' + n);
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE' + n,
                Blockly.JavaScript.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = 'Object({' + code.join(', ') + '})';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_keys'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var code = 'Object.keys(' + dict + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['input_num'] = function(block) {
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
                                                + "    var re = /\S+\s*/;\n"
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
                                                + "    var re = /\S+\s*/;\n"
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

Blockly.JavaScript['lists_append'] = function(block) {
  // Append
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  return varName + '.push(' + value + ');\n';
};

Blockly.JavaScript['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'loop', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_repeat'] =
    Blockly.JavaScript['controls_repeat_ext'];

Blockly.JavaScript['text_print_noend'] = Blockly.JavaScript['text_print'];

Blockly.Python['dict_get'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dict_get_literal'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.quote_(block.getFieldValue('ITEM'));
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dicts_create_with'] = function(block) {
    var value_keys = Blockly.Python.valueToCode(block, 'keys', Blockly.   Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = Blockly.Python.quote_(block.getFieldValue('KEY' + n));
        var value = Blockly.Python.valueToCode(block, 'VALUE' + n,
                Blockly.Python.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = '{' + code.join(', ') + '}';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['dict_keys'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var code = dict + '.keys()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['input_num'] = function(block) {
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

Blockly.Python['lists_append'] = function(block) {
  // Append
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  return varName + '.append(' + value + ')\n';
};

Blockly.Python['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(parseInt(block.getFieldValue('TIMES'), 10));
  } else {
    // External number.
    var repeats = Blockly.Python.valueToCode(block, 'TIMES',
        Blockly.Python.ORDER_NONE) || '0';
  }
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'int(' + repeats + ')';
  }
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var loopVar = Blockly.Python.variableDB_.getDistinctName(
      'loop', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
};

Blockly.Python['controls_repeat'] = Blockly.Python['controls_repeat_ext'];

Blockly.Python['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  // First, add a 'global' statement for every variable that is assigned.
  // acbart: Actually, skip that, globals are bad news!
  var globals = []; //Blockly.Variables.allVariables(block);
  for (var i = globals.length - 1; i >= 0; i--) {
    var varName = globals[i];
    if (block.arguments_.indexOf(varName) == -1) {
      globals[i] = Blockly.Python.variableDB_.getName(varName,
          Blockly.Variables.NAME_TYPE);
    } else {
      // This variable is actually a parameter name.  Do not include it in
      // the list of globals, thus allowing it be of local scope.
      globals.splice(i, 1);
    }
  }
  globals = globals.length ? '  global ' + globals.join(', ') + '\n' : '';
  // Get the function's name
  var funcName = Blockly.Python.variableDB_.getName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  // Get the stack of code
  var branch = Blockly.Python.statementToCode(block, 'STACK');
  // Handle prefixing
  if (Blockly.Python.STATEMENT_PREFIX) {
    branch = Blockly.Python.prefixLines(
        Blockly.Python.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.Python.INDENT) + branch;
  }
  // Handle infinite loop trapping
  if (Blockly.Python.INFINITE_LOOP_TRAP) {
    branch = Blockly.Python.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + branch;
  }
  // Handle return value
  var returnValue = Blockly.Python.valueToCode(block, 'RETURN',
      Blockly.Python.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + '\n';
  } else if (!branch) {
    branch = Blockly.Python.PASS;
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Python.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'def ' + funcName + '(' + args.join(', ') + '):\n' +
      globals + branch + returnValue;
  //acbart: I'm not sure why this is used here. It was fine before when
  //        functions didn't have anything after them, but now it's deadly.
  //code = Blockly.Python.scrub_(block, code);
  //Blockly.Python.definitions_[funcName] = code;
  return code;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Python['procedures_defnoreturn'] =
    Blockly.Python['procedures_defreturn'];

Blockly.Python['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Python.variableDB_.getName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Python.valueToCode(block, 'ARG' + x,
        Blockly.Python.ORDER_NONE) || '___';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.Python.variableDB_.getName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Python.valueToCode(block, 'ARG' + x,
        Blockly.Python.ORDER_NONE) || '___';
  }
  var code = funcName + '(' + args.join(', ') + ')\n';
  return code;
};

Blockly.Python['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_NONE) || '___';
  var code = 'if ' + condition + ':\n';
  if (block.hasReturnValue_) {
    var value = Blockly.Python.valueToCode(block, 'VALUE',
        Blockly.Python.ORDER_NONE) || '___';
    code += '  return ' + value + '\n';
  } else {
    code += '  return\n';
  }
  return code;
};

Blockly.Python['procedures_return'] = function(block) {
  // return value from a procedure.
  var code = "return";
  if (block.hasReturnValue_) {
    var value = Blockly.Python.valueToCode(block, 'VALUE',
        Blockly.Python.ORDER_NONE) || '___';
    code += ' ' + value + '\n';
  } else {
    code += '\n';
  }
  return code;
};

Blockly.Python['text_print_noend'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ', end="")\n';
};
