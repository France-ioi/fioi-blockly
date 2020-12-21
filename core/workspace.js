Blockly.Workspace.prototype.remainingCapacity = function(maxBlocks) {
  if(!maxBlocks) {
    maxBlocks = this.options.maxBlocks;
  }
  if (isNaN(maxBlocks)) {
    return Infinity;
  }
  var allBlocks = this.getAllBlocks();
  var nbBlocks = 0;
  for(var i = 0; i < allBlocks.length; i++) {
    var block = allBlocks[i];
    // Ignore placeholders
    if(block.type.substring(0, 12) == 'placeholder_') {
      continue;
    }
    nbBlocks++;
  }
  return maxBlocks - nbBlocks;
};
