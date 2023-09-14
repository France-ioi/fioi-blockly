Blockly.FieldLabel.prototype.origInit = Blockly.FieldLabel.prototype.init;
Blockly.FieldLabel.prototype.init = function () {
    this.origInit();
    var style = this.sourceBlock_.getTextStyle();
    if (style) {
        this.textElement_.setAttribute('style', style);
    }
}