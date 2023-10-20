Blockly.BlockSvg.terminateDragCallback = null;

Blockly.BlockSvg.prototype.originalShowContextMenu_ = Blockly.BlockSvg.prototype.showContextMenu_;

Blockly.BlockSvg.prototype.showContextMenu_ = function () {
    if (FioiBlockly.helpHooks === false) {
        this.helpUrl = null;
    } else if (FioiBlockly.helpHooks) {
        this.helpUrl = FioiBlockly.helpHooks.exists(this) && '#';
    }
    this.originalShowContextMenu_.apply(this, arguments);
};

Blockly.BlockSvg.prototype.showHelp_ = function () {
    if (FioiBlockly.helpHooks) {
        return FioiBlockly.helpHooks.display(this);
    }
    var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
    if (url) {
        window.open(url);
    }
};

Blockly.BlockSvg.originalTerminateDrag = Blockly.BlockSvg.terminateDrag;

Blockly.BlockSvg.terminateDrag = function () {
    if (Blockly.BlockSvg.terminateDragCallback && Blockly.dragMode_ == Blockly.DRAG_FREE) {
        try {
            Blockly.BlockSvg.terminateDragCallback();
        } catch (e) { }
    }
    Blockly.BlockSvg.originalTerminateDrag.apply(this, arguments);
}