// reportValue allows to show a popup next to a block
Blockly.WorkspaceSvg.prototype.reportValue = function(id, value) {
  var block = this.getBlockById(id);
  if (!block) {
    throw 'Tried to report value on block that does not exist.';
  }
  Blockly.DropDownDiv.createDom();
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var contentDiv = Blockly.DropDownDiv.getContentDiv();
  var valueReportBox = goog.dom.createElement('div');
  valueReportBox.setAttribute('class', 'valueReportBox');
  valueReportBox.innerHTML = value;
  contentDiv.appendChild(valueReportBox);
  Blockly.DropDownDiv.setColour("#FFFFFF", "#AAAAAA");
  Blockly.DropDownDiv.showPositionedByBlock(this, block);
};

// Fix issue when unloading
Blockly.WorkspaceSvg.prototype.translate = function(x, y) {
  var translation = 'translate(' + x + ',' + y + ') ' +
      'scale(' + this.scale + ')';
  if(this.svgBlockCanvas_) {
    this.svgBlockCanvas_.setAttribute('transform', translation);
  }
  if(this.svgBubbleCanvas_) {
    this.svgBubbleCanvas_.setAttribute('transform', translation);
  }
};
