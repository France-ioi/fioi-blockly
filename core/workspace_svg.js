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
  if(this.dragSurface) {
    this.dragSurface.translateAndScaleGroup(x, y, this.scale);
  }
};

// Change zoom origin to be x = 0, y = 0 instead of the center of the screen
Blockly.WorkspaceSvg.prototype.zoom = function(x, y, type) {
  var speed = this.options.zoomOptions.scaleSpeed;
  var metrics = this.getMetrics();
  var center = this.getParentSvg().createSVGPoint();
  center.x = 0;
  center.y = 0;
  center = center.matrixTransform(this.getCanvas().getCTM().inverse());
  x = center.x;
  y = center.y;
  var canvas = this.getCanvas();
  // Scale factor.
  var scaleChange = (type == 1) ? speed : 1 / speed;
  // Clamp scale within valid range.
  var newScale = this.scale * scaleChange;
  if (newScale > this.options.zoomOptions.maxScale) {
    scaleChange = this.options.zoomOptions.maxScale / this.scale;
  } else if (newScale < this.options.zoomOptions.minScale) {
    scaleChange = this.options.zoomOptions.minScale / this.scale;
  }
  if (this.scale == newScale) {
    return;  // No change in zoom.
  }
  if (this.scrollbar) {
    var matrix = canvas.getCTM()
        .translate(x * (1 - scaleChange), y * (1 - scaleChange))
        .scale(scaleChange);
    // newScale and matrix.a should be identical (within a rounding error).
    this.scrollX = matrix.e - metrics.absoluteLeft;
    this.scrollY = matrix.f - metrics.absoluteTop;
  }
  this.setScale(newScale);
};
