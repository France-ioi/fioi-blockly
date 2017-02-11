/**
 * Recalculate a horizontal scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeViewHorizontal = function(hostMetrics) {
  var viewSize = hostMetrics.viewWidth - hostMetrics.flyoutWidth - 1;
  if (this.pair_) {
    // Shorten the scrollbar to make room for the corner square.
    viewSize -= Blockly.Scrollbar.scrollbarThickness;
  }
  this.setScrollViewSize_(Math.max(0, viewSize));

  var xCoordinate = hostMetrics.absoluteLeft + hostMetrics.flyoutWidth + 0.5;
  if (this.pair_ && this.workspace_.RTL) {
    xCoordinate += Blockly.Scrollbar.scrollbarThickness;
  }

  // Horizontal toolbar should always be just above the bottom of the workspace.
  var yCoordinate = hostMetrics.absoluteTop + hostMetrics.viewHeight -
      Blockly.Scrollbar.scrollbarThickness - 0.5;
  this.setPosition(xCoordinate, yCoordinate);

  // If the view has been resized, a content resize will also be necessary.  The
  // reverse is not true.
  this.resizeContentHorizontal(hostMetrics);
};

/**
 * Recalculate a horizontal scrollbar's location within its path and length.
 * This should be called when the contents of the workspace have changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeContentHorizontal = function(hostMetrics) {
  if (!this.pair_) {
    // Only show the scrollbar if needed.
    // Ideally this would also apply to scrollbar pairs, but that's a bigger
    // headache (due to interactions with the corner square).
    this.setVisible(this.scrollViewSize_ < hostMetrics.contentWidth);
  }

  this.ratio_ = this.scrollViewSize_ / hostMetrics.contentWidth;
  if (this.ratio_ == -Infinity || this.ratio_ == Infinity ||
      isNaN(this.ratio_)) {
    this.ratio_ = 0;
  }

  var handleLength = (hostMetrics.viewWidth - hostMetrics.flyoutWidth) * this.ratio_;
  this.setHandleLength_(Math.max(0, handleLength));

  var handlePosition = (hostMetrics.viewLeft - hostMetrics.contentLeft) *
      this.ratio_;
  this.setHandlePosition(this.constrainHandle_(handlePosition));
};

