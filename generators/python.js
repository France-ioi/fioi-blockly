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

/**
 * Altered version of the default blockToCode function. Store all blocks in a global variable.
**/
Blockly.Python.blockToCodeUnaltered = Blockly.Python.blockToCode;

Blockly.Python.blockToCode = function(block, opt_thisOnly) {
  if (block) {
    var func = this[block.type];
    // Define altered functions for each block
    if (typeof func === 'function' && func.pyfeAltered === undefined) {
      this[block.type] = function (block) {
        if (!block || window.sortedBlocksList === undefined) {
          return func.call(block, block);
        }
        sortedBlocksList.push([block.id, 1]);
        var code = func.call(block, block);

        if (typeof code == "string") {
          codeOfBlock[block.id] = String(code)
        } else if (code) {
          codeOfBlock[block.id] = String(code[0]);
        } else {
          codeOfBlock[block.id] = "";
        }
        sortedBlocksList.push([block.id, -1]);
        return code;
      }
      this[block.type].pyfeAltered = true;
    }
  }
  return Blockly.Python.blockToCodeUnaltered(block, opt_thisOnly);
}

/**
 * Add blocks ids in comments to a python code
 * @param {function} Function that takes no parameters and returns the generated python code.
 * @return {string} Python code.
 */
Blockly.Python.blocksToCommentedCode = function(codeGenerator) {
  window.sortedBlocksList = [];
  window.codeOfBlock = {};

  var code = String(codeGenerator());

  var codeLines = code.split('\n');
  var blocksAtLines = new Array(codeLines.length);
  for (var i = 0; i < blocksAtLines.length; i++) {
    blocksAtLines[i] = [];
  }

  // For each block, find where it can be in the code
  var firstLine = 0;
  var lastLineStack = [codeLines.length];
  for (var iEvent = 0; iEvent < sortedBlocksList.length; iEvent++) {
    var blockId = sortedBlocksList[iEvent][0];

    if (sortedBlocksList[iEvent][1] == -1) {
      firstLine = lastLineStack.pop()-1;
    } else {
      var blockCode = codeOfBlock[blockId].split("\n");
      // Remove indentation
      for (var iLine = 0; iLine < blockCode.length; iLine++) {
        blockCode[iLine] = blockCode[iLine].trim();
      }

      // Find matching lines
      var lastLine = lastLineStack[lastLineStack.length-1];
      var startAt = -1;
      for (var iCodeLine = firstLine; iCodeLine < lastLine-blockCode.length+1; iCodeLine++) {
        var blockIsHere = true;
        for (var iBlockLine = 0; iBlockLine < blockCode.length && blockIsHere; iBlockLine++) {
          if (codeLines[iCodeLine+iBlockLine].indexOf(blockCode[iBlockLine]) === -1) {
            blockIsHere = false;
          }
        }
        if (blockIsHere) {
          startAt = iCodeLine;
          break;
        }
      }
      // Push sub-interval
      if (startAt == -1) {
        lastLineStack.push(lastLineStack[lastLineStack.length-1]);
        // console.log("Can't match", blockId);
      } else {
        firstLine = startAt;
        lastLineStack.push(startAt+blockCode.length);

        // Mark the maching lines
        for (var iBlockLine = 0; iBlockLine < blockCode.length; iBlockLine++) {
          if (blockCode[iBlockLine]) {
            blocksAtLines[startAt+iBlockLine].push(blockId);
          }
        }
      }
    }
  }

  // Add comments to the code
  for (var i = 0; i < blocksAtLines.length; i++) {
    if (blocksAtLines[i].length) {
      codeLines[i] += "#BlockIds=" + blocksAtLines[i].join("'");
    }
  }

  window.sortedBlocksList = undefined;
  window.codeOfBlock = undefined;
  return codeLines.join("\n");
}