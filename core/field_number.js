Blockly.FieldNumber.prototype.showEditor_ = function(opt_quietInput) {
  this.workspace_ = this.sourceBlock_.workspace;
  var quietInput = opt_quietInput || false;

  if(window.quickAlgoInterface && quickAlgoInterface.displayKeypad) {
    quietInput = true;
  }

  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    // Mobile browsers have issues with in-line textareas (focus & keyboards).
    var newValue = window.prompt(Blockly.Msg.CHANGE_VALUE_TITLE, this.text_);
    if (this.sourceBlock_) {
      newValue = this.callValidator(newValue);
    }
    this.setValue(newValue);
    return;
  }

  Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
  var div = Blockly.WidgetDiv.DIV;
  // Create the input.
  var htmlInput =
      goog.dom.createDom(goog.dom.TagName.INPUT, 'blocklyHtmlInput');
  htmlInput.setAttribute('spellcheck', this.spellcheck_);
  var fontSize =
      (Blockly.FieldTextInput.FONTSIZE * this.workspace_.scale) + 'pt';
  div.style.fontSize = fontSize;
  htmlInput.style.fontSize = fontSize;
  /** @type {!HTMLInputElement} */
  Blockly.FieldTextInput.htmlInput_ = htmlInput;
  div.appendChild(htmlInput);

  htmlInput.value = htmlInput.defaultValue = this.text_;
  htmlInput.oldValue_ = null;
  this.validate_();
  this.resizeEditor_();
  if (!quietInput) {
    htmlInput.focus();
    htmlInput.select();
  }

  var that = this;
  if(window.quickAlgoInterface && quickAlgoInterface.displayKeypad) {
    var posTop = parseInt(Blockly.WidgetDiv.DIV.style.top) + 24;
    var posLeft = parseInt(Blockly.WidgetDiv.DIV.style.left);
    posTop = Math.max(posTop, 0);
    posLeft = Math.max(posLeft, 0);
    posTop = Math.min(posTop, (window.innerHeight || document.documentElement.clientHeight) - 270);
    posLeft = Math.min(posLeft, (window.innerWidth || document.documentElement.clientWidth) - 238);
    quickAlgoInterface.displayKeypad(
      this.text_,
      {top: posTop + 'px',
       left: posLeft + 'px'},
      function(value) {
        htmlInput.value = value;
        that.onHtmlInputChange_();
      },
      function(value, validated) {
        htmlInput.value = value;
        if(validated) {
          Blockly.WidgetDiv.hide();
        } else {
          htmlInput.focus();
          htmlInput.select();
        }
      });
       
  }

  // Bind to keydown -- trap Enter without IME and Esc to hide.
  htmlInput.onKeyDownWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keydown', this,
      this.onHtmlInputKeyDown_);
  // Bind to keyup -- trap Enter; resize after every keystroke.
  htmlInput.onKeyUpWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keyup', this,
      this.onHtmlInputChange_);
  // Bind to keyPress -- repeatedly resize when holding down a key.
  htmlInput.onKeyPressWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keypress', this,
      this.onHtmlInputChange_);
  htmlInput.onWorkspaceChangeWrapper_ = this.resizeEditor_.bind(this);
  this.workspace_.addChangeListener(htmlInput.onWorkspaceChangeWrapper_);
};
