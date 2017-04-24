/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview A div that floats on top of the workspace, for drop-down menus.
 * The drop-down can be kept inside the workspace, animate in/out, etc.
 * @author tmickel@mit.edu (Tim Mickel)
 */

'use strict';

goog.provide('Blockly.DropDownDiv');

goog.require('goog.dom');
goog.require('goog.style');

/**
 * Class for drop-down div.
 * @constructor
 */
Blockly.DropDownDiv = function() {
};

/**
 * The div element. Set once by Blockly.DropDownDiv.createDom.
 * @type {Element}
 * @private
 */
Blockly.DropDownDiv.DIV_ = null;

/**
 * Drop-downs will appear within the bounds of this element if possible.
 * Set in Blockly.DropDownDiv.setBoundsElement.
 * @type {Element}
 * @private
 */
Blockly.DropDownDiv.boundsElement_ = null;

/**
 * The object currently using the drop-down.
 * @type {Object}
 * @private
 */
Blockly.DropDownDiv.owner_ = null;

/**
 * Arrow size in px. Should match the value in CSS (need to position pre-render).
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ARROW_SIZE = 16;

/**
 * Drop-down border size in px. Should match the value in CSS (need to position the arrow).
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.BORDER_SIZE = 1;

/**
 * Amount the arrow must be kept away from the edges of the main drop-down div, in px.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING = 12;

/**
 * Amount drop-downs should be padded away from the source, in px.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.PADDING_Y = 20;

/**
 * Length of animations in seconds.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ANIMATION_TIME = 0.25;

/**
 * Timer for animation out, to be cleared if we need to immediately hide
 * without disrupting new shows.
 * @type {number}
 */
Blockly.DropDownDiv.animateOutTimer_ = null;

/**
 * Callback for when the drop-down is hidden.
 * @type {Function}
 */
Blockly.DropDownDiv.onHide_ = 0;

// Don't hide a DropDownDiv we're showing
Blockly.DropDownDiv.isInAnimation = false;
Blockly.DropDownDiv.isInAnimationTimer = null;

/**
 * Create and insert the DOM element for this div.
 * @param {Element} container Element that the div should be contained in.
 */
Blockly.DropDownDiv.createDom = function() {
  if (Blockly.DropDownDiv.DIV_) {
    return;  // Already created.
  }
  Blockly.DropDownDiv.DIV_ = goog.dom.createDom('div', 'blocklyDropDownDiv');
  document.body.appendChild(Blockly.DropDownDiv.DIV_);
  Blockly.DropDownDiv.content_ = goog.dom.createDom('div', 'blocklyDropDownContent');
  Blockly.DropDownDiv.DIV_.appendChild(Blockly.DropDownDiv.content_);
  Blockly.DropDownDiv.arrow_ = goog.dom.createDom('div', 'blocklyDropDownArrow');
  Blockly.DropDownDiv.DIV_.appendChild(Blockly.DropDownDiv.arrow_);

  // Transition animation for transform: translate() and opacity.
  Blockly.DropDownDiv.DIV_.style.transition = 'transform ' +
    Blockly.DropDownDiv.ANIMATION_TIME + 's, ' +
    'opacity ' + Blockly.DropDownDiv.ANIMATION_TIME + 's';
  window.addEventListener('mousedown', Blockly.DropDownDiv.hideIfNotShowing, true);
};

/**
 * Set an element to maintain bounds within. Drop-downs will appear
 * within the box of this element if possible.
 * @param {Element} boundsElement Element to bound drop-down to.
 */
Blockly.DropDownDiv.setBoundsElement = function(boundsElement) {
  Blockly.DropDownDiv.boundsElement_ = boundsElement;
};

/**
 * Provide the div for inserting content into the drop-down.
 * @return {Element} Div to populate with content
 */
Blockly.DropDownDiv.getContentDiv = function() {
  return Blockly.DropDownDiv.content_;
};

/**
 * Clear the content of the drop-down.
 */
Blockly.DropDownDiv.clearContent = function() {
  Blockly.DropDownDiv.content_.innerHTML = '';
};

/**
 * Set the colour for the drop-down.
 * @param {string} backgroundColour Any CSS color for the background
 * @param {string} borderColour Any CSS color for the border
 */
Blockly.DropDownDiv.setColour = function(backgroundColour, borderColour) {
  Blockly.DropDownDiv.DIV_.style.backgroundColor = backgroundColour;
  Blockly.DropDownDiv.DIV_.style.borderColor = borderColour;
};

/**
 * Set the category for the drop-down.
 * @param {string} category The new category for the drop-down.
 */
Blockly.DropDownDiv.setCategory = function(category) {
  Blockly.DropDownDiv.DIV_.setAttribute('data-category', category);
};

// Modified: find blocklyPath
Blockly.DropDownDiv.showPositionedByBlock = function(owner, block,
      opt_onHide, opt_secondaryYOffset) {
  var scale = block.workspace.scale;
  var bBox = {width: block.width, height: block.height};
  bBox.width *= scale;
  bBox.height *= scale;
  var blockSvg = block.getSvgRoot();
  for(var i=0; i<blockSvg.children.length; i++) {
     if(blockSvg.children[i].classList[0] == 'blocklyPath') {
        blockSvg = blockSvg.children[i];
        break;
     }
  }
  var position = blockSvg.getBoundingClientRect();
  // If we can fit it, render below the block.
  var primaryX = position.left + position.width / 2;
  var primaryY = position.top + position.height;
  // If we can't fit it, render above the entire parent block.
  var secondaryX = primaryX;
  var secondaryY = position.top;
  if (opt_secondaryYOffset) {
    secondaryY += opt_secondaryYOffset;
  }
  // Set bounds to workspace; show the drop-down.
  Blockly.DropDownDiv.setBoundsElement(block.workspace.getParentSvg().parentNode);
  return Blockly.DropDownDiv.show(this, primaryX, primaryY, secondaryX, secondaryY, opt_onHide);
};

/**
 * Show and place the drop-down.
 * The drop-down is placed with an absolute "origin point" (x, y) - i.e.,
 * the arrow will point at this origin and box will positioned below or above it.
 * If we can maintain the container bounds at the primary point, the arrow will
 * point there, and the container will be positioned below it.
 * If we can't maintain the container bounds at the primary point, fall-back to the
 * secondary point and position above.
 * @param {Object} owner The object showing the drop-down
 * @param {number} primaryX Desired origin point x, in absolute px
 * @param {number} primaryY Desired origin point y, in absolute px
 * @param {number} secondaryX Secondary/alternative origin point x, in absolute px
 * @param {number} secondaryY Secondary/alternative origin point y, in absolute px
 * @param {Function=} opt_onHide Optional callback for when the drop-down is hidden
 * @return {boolean} True if the menu rendered at the primary origin point.
 */
Blockly.DropDownDiv.show = function(owner, primaryX, primaryY, secondaryX, secondaryY, opt_onHide) {
  // Do not hide the div while we're showing it
  Blockly.DropDownDiv.isInAnimation = true;
  if(Blockly.DropDownDiv.animateOutTimer_) {
    window.clearTimeout(Blockly.DropDownDiv.animateOutTimer_);
    Blockly.DropDownDiv.animateOutTimer_ = null;
  }
  if(Blockly.DropDownDiv.isInAnimationTimer) {
    window.clearTimeout(Blockly.DropDownDiv.isInAnimationTimer);
    Blockly.DropDownDiv.isInAnimationTimer = null;
  }
  Blockly.DropDownDiv.isInAnimationTimer = window.setTimeout(function () { Blockly.DropDownDiv.isInAnimation = false; }, Blockly.DropDownDiv.ANIMATION_TIME*1000);

  Blockly.DropDownDiv.owner_ = owner;
  Blockly.DropDownDiv.onHide_ = opt_onHide;
  var div = Blockly.DropDownDiv.DIV_;
  var metrics = Blockly.DropDownDiv.getPositionMetrics(primaryX, primaryY, secondaryX, secondaryY);
  // Update arrow CSS
  Blockly.DropDownDiv.arrow_.style.transform = 'translate(' +
    metrics.arrowX + 'px,' + metrics.arrowY + 'px) rotate(45deg)';
  Blockly.DropDownDiv.arrow_.setAttribute('class',
    metrics.arrowAtTop ? 'blocklyDropDownArrow arrowTop' : 'blocklyDropDownArrow arrowBottom');

  // When we change `translate` multiple times in close succession,
  // Chrome may choose to wait and apply them all at once.
  // Since we want the translation to initial X, Y to be immediate,
  // and the translation to final X, Y to be animated,
  // we saw problems where both would be applied after animation was turned on,
  // making the dropdown appear to fly in from (0, 0).
  // Using both `left`, `top` for the initial translation and then `translate`
  // for the animated transition to final X, Y is a workaround.

  // First apply initial translation.
  div.style.left = metrics.initialX + 'px';
  div.style.top = metrics.initialY + 'px';
  // Show the div.
  div.style.display = 'block';
  div.style.opacity = 1;
  // Add final translate, animated through `transition`.
  // Coordinates are relative to (initialX, initialY),
  // where the drop-down is absolutely positioned.
  var dx = (metrics.finalX - metrics.initialX);
  var dy = (metrics.finalY - metrics.initialY);
  div.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  return metrics.arrowAtTop;
};

/**
 * Helper to position the drop-down and the arrow, maintaining bounds.
 * See explanation of origin points in Blockly.DropDownDiv.show.
 * @param {number} primaryX Desired origin point x, in absolute px
 * @param {number} primaryY Desired origin point y, in absolute px
 * @param {number} secondaryX Secondary/alternative origin point x, in absolute px
 * @param {number} secondaryY Secondary/alternative origin point y, in absolute px
 * @returns {Object} Various final metrics, including rendered positions for drop-down and arrow.
 */
Blockly.DropDownDiv.getPositionMetrics = function(primaryX, primaryY, secondaryX, secondaryY) {
  var div = Blockly.DropDownDiv.DIV_;
  var boundPosition = Blockly.DropDownDiv.boundsElement_.getBoundingClientRect();

  var boundSize = goog.style.getSize(Blockly.DropDownDiv.boundsElement_);
  var divSize = goog.style.getSize(div);

  // First decide if we will render at primary or secondary position
  // i.e., above or below
  // renderX, renderY will eventually be the final rendered position of the box.
  var renderX, renderY, renderedSecondary;
  // Can the div fit inside the bounds if we render below the primary point?
  if (secondaryY - divSize.height < boundPosition.top) {
    // We can't fit below in terms of y. Can we fit above?
    if (primaryY + divSize.height > boundPosition.top + boundSize.height) {
      // We also can't fit above, so just render below anyway.
      renderX = secondaryX;
      renderY = secondaryY - divSize.height - Blockly.DropDownDiv.PADDING_Y;
      renderedSecondary = true;
    } else {
      // We can fit above, render secondary
      renderX = primaryX;
      renderY = primaryY + Blockly.DropDownDiv.PADDING_Y;
      renderedSecondary = false;
    }
  } else {
    // We can fit below, render primary
    renderX = secondaryX;
    renderY = secondaryY - divSize.height - Blockly.DropDownDiv.PADDING_Y;
    renderedSecondary = true;
  }
  // First calculate the absolute arrow X
  // This needs to be done before positioning the div, since the arrow
  // wants to be as close to the origin point as possible.
  var arrowX = renderX - Blockly.DropDownDiv.ARROW_SIZE / 2;
  // Keep in overall bounds
  arrowX = Math.max(boundPosition.left, Math.min(arrowX, boundPosition.left + boundSize.width));

  // Adjust the x-position of the drop-down so that the div is centered and within bounds.
  var centerX = divSize.width / 2;
  renderX -= centerX;
  // Fit horizontally in the bounds.
  renderX = Math.max(
    boundPosition.left,
    Math.min(renderX, boundPosition.left + boundSize.width - divSize.width)
  );
  // After we've finished caclulating renderX, adjust the arrow to be relative to it.
  arrowX -= renderX;

  // Pad the arrow by some pixels, primarily so that it doesn't render on top of a rounded border.
  arrowX = Math.max(
    Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING,
    Math.min(arrowX, divSize.width - Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING - Blockly.DropDownDiv.ARROW_SIZE)
  );

  // Calculate arrow Y. If we rendered secondary, add on bottom.
  // Extra pixels are added so that it covers the border of the div.
  var arrowY = (renderedSecondary) ? divSize.height - Blockly.DropDownDiv.BORDER_SIZE : 0;
  arrowY -= (Blockly.DropDownDiv.ARROW_SIZE / 2) + Blockly.DropDownDiv.BORDER_SIZE;

  // Initial position calculated without any padding to provide an animation point.
  var initialX = renderX; // X position remains constant during animation.
  var initialY;
  if (renderedSecondary) {
    initialY = secondaryY - divSize.height; // No padding on Y
  } else {
    initialY = primaryY; // No padding on Y
  }

  return {
    initialX: initialX,
    initialY : initialY+10,
    finalX: renderX,
    finalY: renderY+10,
    arrowX: arrowX,
    arrowY: arrowY,
    arrowAtTop: !renderedSecondary
  };
};

/**
 * Is the container visible?
 * @return {boolean} True if visible.
 */
Blockly.DropDownDiv.isVisible = function() {
  return !!Blockly.DropDownDiv.owner_;
};

/**
 * Hide the menu only if it is owned by the provided object.
 * @param {Object} owner Object which must be owning the drop-down to hide
 * @return {Boolean} True if hidden
 */
Blockly.DropDownDiv.hideIfOwner = function(owner) {
  if (Blockly.DropDownDiv.owner_ === owner) {
    Blockly.DropDownDiv.hide();
    return true;
  }
  return false;
};

/**
 * Hide the menu, triggering animation.
 */
Blockly.DropDownDiv.hide = function() {
  Blockly.DropDownDiv.isInAnimation = false;
  // Start the animation by setting the translation and fading out.
  var div = Blockly.DropDownDiv.DIV_;
  // Reset to (initialX, initialY) - i.e., no translation.
  div.style.transform = 'translate(0px, 0px)';
  div.style.opacity = 0;
  Blockly.DropDownDiv.animateOutTimer_ = setTimeout(function() {
    // Finish animation - reset all values to default.
    Blockly.DropDownDiv.hideWithoutAnimation();
  }, Blockly.DropDownDiv.ANIMATION_TIME * 1000);
  if (Blockly.DropDownDiv.onHide_) {
    Blockly.DropDownDiv.onHide_();
    Blockly.DropDownDiv.onHide_ = null;
  }
};

// Hide after a timeout
Blockly.DropDownDiv.hideIfNotShowing = function () {
  if(!Blockly.DropDownDiv.isInAnimation) {
    Blockly.DropDownDiv.hide();
  }
}

/**
 * Hide the menu, without animation.
 */
Blockly.DropDownDiv.hideWithoutAnimation = function() {
  if (!Blockly.DropDownDiv.isVisible()) {
    return;
  }
  var div = Blockly.DropDownDiv.DIV_;
  Blockly.DropDownDiv.animateOutTimer_ && window.clearTimeout(Blockly.DropDownDiv.animateOutTimer_);
  div.style.transform = '';
  div.style.top = '';
  div.style.left = '';
  div.style.display = 'none';
  Blockly.DropDownDiv.clearContent();
  Blockly.DropDownDiv.owner_ = null;
  if (Blockly.DropDownDiv.onHide_) {
    Blockly.DropDownDiv.onHide_();
    Blockly.DropDownDiv.onHide_ = null;
  }
};

// Adapt to our custom Blockly.Variables.promptName behavior
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    var cb = function(text) {
      if (text) {
        workspace.renameVariable(oldVar, text);
      }
    };
    text = Blockly.Variables.promptName(
        Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar, cb);
    return null;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1',
      this.getText())) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};

// Options for the variables flyout
Blockly.Procedures.flyoutOptions = {
  includedBlocks: {noret: true, ret: true, ifret: true}, // Blocks to add to the list
  };


// Allow configuration of the category
Blockly.Procedures.flyoutCategory = function(workspace) {
  var incl = Blockly.Procedures.flyoutOptions.includedBlocks;
  var xmlList = [];
  if (incl.noret && Blockly.Blocks['procedures_defnoreturn']) {
    // <block type="procedures_defnoreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defnoreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (incl.ret && Blockly.Blocks['procedures_defreturn']) {
    // <block type="procedures_defreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (incl.ifret && Blockly.Blocks['procedures_ifreturn']) {
    // <block type="procedures_ifreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_ifreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  function populateProcedures(procedureList, templateName) {
    for (var i = 0; i < procedureList.length; i++) {
      var name = procedureList[i][0];
      var args = procedureList[i][1];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      var block = goog.dom.createDom('block');
      block.setAttribute('type', templateName);
      block.setAttribute('gap', 16);
      var mutation = goog.dom.createDom('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      for (var j = 0; j < args.length; j++) {
        var arg = goog.dom.createDom('arg');
        arg.setAttribute('name', args[j]);
        mutation.appendChild(arg);
      }
      xmlList.push(block);
    }
  }

  var tuple = Blockly.Procedures.allProcedures(workspace);
  populateProcedures(tuple[0], 'procedures_callnoreturn');
  populateProcedures(tuple[1], 'procedures_callreturn');
  return xmlList;
};

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

  // Detect if we're in Blockly or Scratch
  var scratchMode = !!(Blockly.registerButtonCallback);
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
      if(scratchMode) {
        // Scratch
        button.setAttribute('callbackKey', 'CREATE_VARIABLE');
        Blockly.registerButtonCallback('CREATE_VARIABLE', function(button) {
          Blockly.Variables.createVariable(button.getTargetWorkspace());
        });
      }
      xmlList.push(button);
    }
  } else {
    var fullVariableList = [];
  }

  var variableList = options.fixed.concat(fullVariableList);

  if (variableList.length > 0) {
    if(scratchMode) {
      var blockNames = {
        get: 'data_variable',
        set: 'data_setvariableto',
        incr: 'data_changevariableby'
        };
    } else {
      var blockNames = {
        get: 'variables_get',
        set: 'variables_set',
        incr: 'math_change'
        };
    }

    if (options.includedBlocks.get && Blockly.Blocks[blockNames.get]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_get" gap="8">
        //   <field name="VAR">item</field>
        // </block>
        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.get);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
        }

        block.appendChild(field);
        xmlList.push(block);
      }
    }

    if (options.includedBlocks.set && Blockly.Blocks[blockNames.set]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_set" gap="20">
        //   <field name="VAR">item</field>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.set);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createTextDom_());
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }
    if (options.includedBlocks.incr && Blockly.Blocks[blockNames.incr]) {
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
        block.setAttribute('type', blockNames.incr);
        if (i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }
        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createMathNumberDom_())
        } else {
          var value = goog.dom.createDom('value');
          value.setAttribute('name', 'DELTA');
          block.appendChild(value);

          var shadowBlock = goog.dom.createDom('shadow');
          shadowBlock.setAttribute('type', 'math_number');
          value.appendChild(shadowBlock);

          var numberField = goog.dom.createDom('field', null, '1');
          numberField.setAttribute('name', 'NUM');
          shadowBlock.appendChild(numberField);

          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }

  }
  return xmlList;
};

// Adapt to our custom Blockly.Variables.promptName behavior
// We also return null instead of the variable name as anyway no call seems to
// read the return value
Blockly.Variables.createVariable = function(workspace) {
  var cb = function(text) {
    if (text) {
      if (workspace.variableIndexOf(text) != -1) {
        displayHelper.showPopupMessage(Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace('%1',
            text.toLowerCase()), 'blanket');
      } else {
        workspace.createVariable(text);
      }
    }
  }
  Blockly.Variables.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '', cb);
  return null;
};

/**
 * Prompt the user for a new variable name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @return {?string} The new variable name, or null if the user picked
 *     something illegal.
 */
Blockly.Variables.promptName = function(promptText, defaultText, callback) {
  var cb = function (newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    };
    callback(newVar);
  };
  displayHelper.showPopupMessage(promptText, 'input', null, cb);
};

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

Blockly.Msg.LISTS_GET_INDEX_FIRST = "au début";
Blockly.Msg.LISTS_GET_INDEX_FROM_END = "à l'indice depuis la fin";
Blockly.Msg.LISTS_GET_INDEX_FROM_START = "à l'indice";
Blockly.Msg.LISTS_GET_INDEX_GET = "obtenir la valeur";
Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = "obtenir et supprimer la valeur";
Blockly.Msg.LISTS_GET_INDEX_LAST = "à la fin";
Blockly.Msg.LISTS_GET_INDEX_RANDOM = "à un indice aléatoire";
Blockly.Msg.LISTS_GET_INDEX_REMOVE = "supprimer la valeur";
Blockly.Msg.LISTS_SET_INDEX_INSERT = "insérer";

Blockly.Msg.INPUT_NUM = "lire un nombre";
Blockly.Msg.INPUT_NUM_TOOLTIP = "Lit un nombre sur l'entrée du programme.";
Blockly.Msg.INPUT_CHAR = "lire un caractère";
Blockly.Msg.INPUT_CHAR_TOOLTIP = "Lit un caractère sur l'entrée du programme.";
Blockly.Msg.INPUT_WORD = "lire un mot";
Blockly.Msg.INPUT_WORD_TOOLTIP = "Lit un mot sur l'entrée du programme.";
Blockly.Msg.INPUT_LINE = "lire une ligne";
Blockly.Msg.INPUT_LINE_TOOLTIP = "Lit une ligne sur l'entrée du programme.";

Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE = "Impossible de supprimer la variable '%1', utilisée par la procédure '%2'.";

Blockly.Msg.DATA_REPLACEITEMOFLIST_TITLE = "remplacer l'élément %1 de la liste %2 par %3";
Blockly.Msg.DATA_ITEMOFLIST_TITLE = "obtenir %1 dans la liste %2";
Blockly.Msg.DATA_LISTREPEAT_TITLE = "initialiser la liste %1 avec %2 répété %3 fois";

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

if(typeof Blockly.Blocks.lists === 'undefined') {
  Blockly.Blocks.lists = {};
}

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

// Modify order of fields
Blockly.Blocks['lists_setIndex'] = {
  /**
   * Block for setting the element at index.
   * @this Blockly.Block
   */
  init: function() {
    var MODE =
        [[Blockly.Msg.LISTS_SET_INDEX_SET, 'SET'],
         [Blockly.Msg.LISTS_SET_INDEX_INSERT, 'INSERT']];
    this.WHERE_OPTIONS =
        [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_INDEX_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_INDEX_FIRST, 'FIRST'],
         [Blockly.Msg.LISTS_GET_INDEX_LAST, 'LAST'],
         [Blockly.Msg.LISTS_GET_INDEX_RANDOM, 'RANDOM']];
    this.setHelpUrl(Blockly.Msg.LISTS_SET_INDEX_HELPURL);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput('AT');
    this.appendDummyInput('MODEDUMMY')
        .appendField(new Blockly.FieldDropdown(MODE), 'MODE');
    this.appendValueInput('TO');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_SET_INDEX_TOOLTIP);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('MODE');
      var where = thisBlock.getFieldValue('WHERE');
      var tooltip = '';
      switch (mode + ' ' + where) {
        case 'SET FROM_START':
        case 'SET FROM_END':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM;
          break;
        case 'SET FIRST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST;
          break;
        case 'SET LAST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST;
          break;
        case 'SET RANDOM':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM;
          break;
        case 'INSERT FROM_START':
        case 'INSERT FROM_END':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM;
          break;
        case 'INSERT FIRST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST;
          break;
        case 'INSERT LAST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST;
          break;
        case 'INSERT RANDOM':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM;
          break;
      }
      if (where == 'FROM_START' || where == 'FROM_END') {
        tooltip += '  ' + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP
            .replace('%1',
                thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  },
  /**
   * Create XML to represent whether there is an 'AT' input.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = (xmlElement.getAttribute('at') != 'false');
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(isAt) {
    // Destroy old 'AT' and 'ORDINAL' input.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL')
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT');
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(newAt); 
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.moveInputBefore('AT', 'MODEDUMMY');
    if (this.getInput('ORDINAL')) {
      this.moveInputBefore('ORDINAL', 'TO');
    }
    
    this.getInput('AT').appendField(menu, 'WHERE'); 
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

Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
      Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var incrCode = varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', "+varName+", '"+varName+"');\n";

  return incrCode + reportCode;
};

Blockly.JavaScript['text_print_noend'] = Blockly.JavaScript['text_print'];

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var assignCode = varName + ' = ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', "+varName+", '"+varName+"');\n";

  return assignCode + reportCode;
};

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
