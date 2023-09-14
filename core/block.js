Blockly.Block.prototype.jsonInit = function (json) {
    // Validate inputs.
    goog.asserts.assert(json['output'] == undefined ||
        json['previousStatement'] == undefined,
        'Must not have both an output and a previousStatement.');

    // Set basic properties of block.
    if (json['colour'] !== undefined) {
        this.setColour(json['colour'], json['colourSecondary'], json['colourTertiary']);
    }

    // Interpolate the message blocks.
    var i = 0;
    while (json['message' + i] !== undefined) {
        this.interpolate_(json['message' + i], json['args' + i] || [],
            json['lastDummyAlign' + i]);
        i++;
    }

    if (json['inputsInline'] !== undefined) {
        this.setInputsInline(json['inputsInline']);
    }
    // Set output and previous/next connections.
    if (json['output'] !== undefined) {
        this.setOutput(true, json['output']);
    }
    if (json['previousStatement'] !== undefined) {
        this.setPreviousStatement(true, json['previousStatement']);
    }
    if (json['nextStatement'] !== undefined) {
        this.setNextStatement(true, json['nextStatement']);
    }
    if (json['tooltip'] !== undefined) {
        this.setTooltip(json['tooltip']);
    }
    if (json['helpUrl'] !== undefined) {
        this.setHelpUrl(json['helpUrl']);
    }
    if (json['outputShape'] !== undefined && this.setOutputShape) {
        this.setOutputShape(json['outputShape']);
    }
    if (json['checkboxInFlyout'] !== undefined && this.setCheckboxInFlyout) {
        this.setCheckboxInFlyout(json['checkboxInFlyout']);
    }
    if (json['category'] !== undefined && this.setCategory) {
        this.setCategory(json['category']);
    }
    if (json['textStyle'] !== undefined) {
        this.setTextStyle(json['textStyle']);
    }
};

Blockly.Block.prototype.getTextStyle = function () {
    return this.textStyle_ || '';
}

Blockly.Block.prototype.setTextStyle = function (style) {
    this.textStyle_ = style;
}