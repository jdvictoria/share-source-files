/**
* DevExtreme (cjs/ui/speed_dial_action/speed_dial_main_item.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.disposeAction = disposeAction;
exports.initAction = initAction;
exports.repaint = repaint;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _config = _interopRequireDefault(require("../../core/config"));
var _extend = require("../../core/utils/extend");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _ui = _interopRequireDefault(require("../widget/ui.errors"));
var _swatch_container = _interopRequireDefault(require("../widget/swatch_container"));
var _speed_dial_item = _interopRequireDefault(require("./speed_dial_item"));
var _themes = require("../themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const {
  getSwatchContainer
} = _swatch_container.default;
const FAB_MAIN_CLASS = 'dx-fa-button-main';
const FAB_MAIN_CLASS_WITH_LABEL = 'dx-fa-button-with-label';
const FAB_MAIN_CLASS_WITHOUT_ICON = 'dx-fa-button-without-icon';
const FAB_CLOSE_ICON_CLASS = 'dx-fa-button-icon-close';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
let speedDialMainItem = null;
const modifyActionOptions = action => {
  const {
    animation,
    actionComponent,
    actionVisible,
    actions,
    activeStateEnabled,
    direction,
    elementAttr,
    hint,
    hoverStateEnabled,
    icon,
    id,
    index,
    label,
    onClick,
    onContentReady,
    parentPosition,
    position,
    visible,
    zIndex
  } = action.option();
  return (0, _extend.extend)({}, {
    animation,
    actionComponent,
    actionVisible,
    actions,
    activeStateEnabled,
    direction,
    elementAttr,
    hint,
    hoverStateEnabled,
    icon,
    id,
    index,
    label,
    onClick,
    onContentReady,
    parentPosition,
    position,
    visible,
    zIndex
  }, {
    onInitialized: null,
    onDisposing: null
  });
};
let SpeedDialMainItem = /*#__PURE__*/function (_SpeedDialItem) {
  _inheritsLoose(SpeedDialMainItem, _SpeedDialItem);
  function SpeedDialMainItem() {
    return _SpeedDialItem.apply(this, arguments) || this;
  }
  var _proto = SpeedDialMainItem.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    const defaultOptions = {
      icon: 'add',
      closeIcon: 'close',
      position: {
        at: 'right bottom',
        my: 'right bottom',
        offset: {
          x: -16,
          y: -16
        }
      },
      maxSpeedDialActionCount: 5,
      hint: '',
      label: '',
      direction: 'auto',
      actions: [],
      activeStateEnabled: true,
      hoverStateEnabled: true,
      indent: (0, _themes.isCompact)() ? 49 : 55,
      childIndent: 40,
      childOffset: (0, _themes.isCompact)() ? 2 : 9,
      callOverlayRenderShading: true,
      hideOnOutsideClick: true
    };
    return (0, _extend.extend)(_SpeedDialItem.prototype._getDefaultOptions.call(this), (0, _extend.extend)(defaultOptions, (0, _config.default)().floatingActionButtonConfig, {
      shading: false
    }));
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _SpeedDialItem.prototype._defaultOptionsRules.call(this).concat([{
      device() {
        return (0, _themes.isFluent)() && !(0, _themes.isCompact)();
      },
      options: {
        indent: 60,
        childIndent: 60,
        childOffset: 0
      }
    }, {
      device() {
        return (0, _themes.isFluent)() && (0, _themes.isCompact)();
      },
      options: {
        indent: 48,
        childIndent: 48,
        childOffset: 0
      }
    }, {
      device() {
        return (0, _themes.isMaterial)() && !(0, _themes.isCompact)();
      },
      options: {
        indent: 72,
        childIndent: 56,
        childOffset: 8
      }
    }, {
      device() {
        return (0, _themes.isMaterial)() && (0, _themes.isCompact)();
      },
      options: {
        indent: 58,
        childIndent: 48,
        childOffset: 1
      }
    }]);
  };
  _proto._render = function _render() {
    this.$element().addClass(FAB_MAIN_CLASS);
    _SpeedDialItem.prototype._render.call(this);
    this._moveToContainer();
    this._renderCloseIcon();
    this._renderClick();
  };
  _proto._renderLabel = function _renderLabel() {
    _SpeedDialItem.prototype._renderLabel.call(this);
    this.$element().toggleClass(FAB_MAIN_CLASS_WITH_LABEL, !!this._$label);
  };
  _proto._renderIcon = function _renderIcon() {
    _SpeedDialItem.prototype._renderIcon.call(this);
    this.$element().toggleClass(FAB_MAIN_CLASS_WITHOUT_ICON, !this.option('icon'));
  };
  _proto._renderCloseIcon = function _renderCloseIcon() {
    this._$closeIcon = this._renderButtonIcon(this._$closeIcon, this._options.silent('closeIcon'), FAB_CLOSE_ICON_CLASS);
    this._$closeIcon.addClass(INVISIBLE_STATE_CLASS);
  };
  _proto._renderClick = function _renderClick() {
    this._clickAction = this._getVisibleActions().length === 1 ? this._getActionComponent()._createActionByOption('onClick') : this._createAction(this._clickHandler.bind(this));
    this._setClickAction();
  };
  _proto._getVisibleActions = function _getVisibleActions(actions) {
    const currentActions = actions || this.option('actions');
    return currentActions.filter(action => action.option('visible'));
  };
  _proto._getCurrentOptions = function _getCurrentOptions(actions) {
    const visibleActions = speedDialMainItem._getVisibleActions(actions);
    const defaultOptions = this._getDefaultOptions();
    delete defaultOptions.closeOnOutsideClick;
    return visibleActions.length === 1 ? (0, _extend.extend)(modifyActionOptions(visibleActions[0]), {
      position: this._getPosition()
    }) : (0, _extend.extend)(defaultOptions, {
      visible: visibleActions.length !== 0
    });
  };
  _proto._clickHandler = function _clickHandler() {
    const actions = this._actionItems.filter(action => action.option('actionVisible')).sort((action, nextAction) => action.option('index') - nextAction.option('index'));
    if (actions.length === 1) return;
    const lastActionIndex = actions.length - 1;
    for (let i = 0; i < actions.length; i++) {
      actions[i].option('animation', this._getActionAnimation(actions[i], i, lastActionIndex));
      actions[i].option('position', this._getActionPosition(actions, i));
      actions[i]._$wrapper.css('position', this._$wrapper.css('position'));
      actions[i].toggle();
    }
    if ((0, _config.default)().floatingActionButtonConfig.shading) {
      this._isShadingShown = !this.option('shading');
      this.option('shading', this._isShadingShown);
    }
    this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
    this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS);
  };
  _proto._updateZIndexStackPosition = function _updateZIndexStackPosition() {
    _SpeedDialItem.prototype._updateZIndexStackPosition.call(this);
    const overlayStack = this._overlayStack();
    overlayStack.push(this);
  };
  _proto._renderActions = function _renderActions() {
    const actions = this.option('actions');
    const minActionButtonCount = 1;
    if (this._actionItems && this._actionItems.length) {
      this._actionItems.forEach(actionItem => {
        actionItem.dispose();
        actionItem.$element().remove();
      });
      this._actionItems = [];
    }
    this._actionItems = [];
    if (actions.length === minActionButtonCount) return;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const $actionElement = (0, _renderer.default)('<div>').appendTo(getSwatchContainer(action.$element()));
      _events_engine.default.off($actionElement, 'click');
      _events_engine.default.on($actionElement, 'click', () => {
        this._clickHandler();
      });
      action._options.silent('actionComponent', action);
      action._options.silent('parentPosition', this._getPosition());
      action._options.silent('actionVisible', action._options.silent('visible'));
      this._actionItems.push(this._createComponent($actionElement, _speed_dial_item.default, (0, _extend.extend)({}, modifyActionOptions(action), {
        visible: false
      })));
    }
  };
  _proto._getActionAnimation = function _getActionAnimation(action, index, lastActionIndex) {
    const actionAnimationDelay = 30;
    action._options.silent('animation.show.delay', actionAnimationDelay * index);
    action._options.silent('animation.hide.delay', actionAnimationDelay * (lastActionIndex - index));
    return action._options.silent('animation');
  };
  _proto._getDirectionIndex = function _getDirectionIndex(actions, direction) {
    const directionIndex = 1;
    if (direction === 'auto') {
      const contentHeight = (0, _size.getHeight)(this.$content());
      const actionsHeight = this.initialOption('indent') + this.initialOption('childIndent') * actions.length - contentHeight;
      const offsetTop = this.$content().offset().top;
      if (actionsHeight < offsetTop) {
        return -directionIndex;
      } else {
        const offsetBottom = (0, _size.getHeight)(this._positionController._$wrapperCoveredElement) - contentHeight - offsetTop;
        return offsetTop >= offsetBottom ? -directionIndex : directionIndex;
      }
    }
    return direction !== 'down' ? -directionIndex : directionIndex;
  };
  _proto._getActionPosition = function _getActionPosition(actions, index) {
    const action = actions[index];
    const actionOffsetXValue = this.initialOption('childOffset');
    const actionOffsetX = action._options.silent('label') && !this._$label ? this._isPositionLeft(this._getPosition()) ? actionOffsetXValue : -actionOffsetXValue : 0;
    const actionOffsetYValue = this.initialOption('indent') + this.initialOption('childIndent') * index;
    const actionOffsetY = this._getDirectionIndex(actions, this.option('direction')) * actionOffsetYValue;
    const actionPositionAtMy = action._options.silent('label') ? this._isPositionLeft(this._getPosition()) ? 'left' : 'right' : 'center';
    return {
      of: this.$content(),
      at: actionPositionAtMy,
      my: actionPositionAtMy,
      offset: {
        x: actionOffsetX,
        y: actionOffsetY
      }
    };
  };
  _proto._outsideClickHandler = function _outsideClickHandler(e) {
    if (this._isShadingShown) {
      const isShadingClick = (0, _renderer.default)(e.target)[0] === this._$wrapper[0];
      if (isShadingClick) {
        e.preventDefault();
        this._clickHandler();
      }
    }
  };
  _proto._setPosition = function _setPosition() {
    if (this.option('visible')) {
      this._hide();
      this._show();
    }
  };
  _proto._getPosition = function _getPosition() {
    return this._getDefaultOptions().position;
  };
  _proto._getInkRippleContainer = function _getInkRippleContainer() {
    return this.$content();
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'actions':
        if (this._isVisible()) {
          this._renderIcon();
          this._renderLabel();
        }
        this._renderCloseIcon();
        this._renderClick();
        this._renderActions();
        break;
      case 'maxSpeedDialActionCount':
        this._renderActions();
        break;
      case 'closeIcon':
        this._renderCloseIcon();
        break;
      case 'position':
        _SpeedDialItem.prototype._optionChanged.call(this, args);
        this._setPosition();
        break;
      case 'label':
        if (this._isVisible()) this._renderLabel();
        this._setPosition();
        break;
      case 'icon':
        if (this._isVisible()) this._renderIcon();
        break;
      default:
        _SpeedDialItem.prototype._optionChanged.call(this, args);
    }
  };
  return SpeedDialMainItem;
}(_speed_dial_item.default);
function initAction(newAction) {
  // TODO: workaround for Angular/React/Vue
  newAction._options.silent('onInitializing', null);
  let isActionExist = false;
  if (!speedDialMainItem) {
    const $fabMainElement = (0, _renderer.default)('<div>').appendTo(getSwatchContainer(newAction.$element()));
    speedDialMainItem = newAction._createComponent($fabMainElement, SpeedDialMainItem, (0, _extend.extend)({}, modifyActionOptions(newAction), {
      actions: [newAction]
    }));
  } else {
    const savedActions = speedDialMainItem.option('actions');
    savedActions.forEach(action => {
      if (action._options.silent('id') === newAction._options.silent('id')) {
        isActionExist = true;
        return newAction;
      }
    });
    delete speedDialMainItem._options.position;
    if (!isActionExist) {
      if (speedDialMainItem._getVisibleActions(savedActions).length >= speedDialMainItem.option('maxSpeedDialActionCount')) {
        newAction.dispose();
        _ui.default.log('W1014');
        return;
      }
      savedActions.push(newAction);
      speedDialMainItem.option((0, _extend.extend)(speedDialMainItem._getCurrentOptions(savedActions), {
        actions: savedActions
      }));
    } else if (savedActions.length === 1) {
      speedDialMainItem.option((0, _extend.extend)({}, modifyActionOptions(savedActions[0]), {
        actions: savedActions,
        position: speedDialMainItem._getPosition()
      }));
    } else {
      speedDialMainItem.option((0, _extend.extend)(speedDialMainItem._getCurrentOptions(savedActions), {
        actions: savedActions
      }));
    }
  }
}
function disposeAction(actionId) {
  if (!speedDialMainItem) return;
  let savedActions = speedDialMainItem.option('actions');
  const savedActionsCount = savedActions.length;
  savedActions = savedActions.filter(action => {
    return action._options.silent('id') !== actionId;
  });
  if (savedActionsCount === savedActions.length) return;
  if (!savedActions.length) {
    speedDialMainItem.dispose();
    speedDialMainItem.$element().remove();
    speedDialMainItem = null;
  } else if (savedActions.length === 1) {
    speedDialMainItem.option((0, _extend.extend)({}, modifyActionOptions(savedActions[0]), {
      actions: savedActions
    }));
  } else {
    speedDialMainItem.option({
      actions: savedActions
    });
  }
}
function repaint() {
  if (!speedDialMainItem) return;
  const visibleActions = speedDialMainItem._getVisibleActions();
  const icon = visibleActions.length === 1 ? visibleActions[0].option('icon') : speedDialMainItem._getDefaultOptions().icon;
  const label = visibleActions.length === 1 ? visibleActions[0].option('label') : speedDialMainItem._getDefaultOptions().label;
  speedDialMainItem.option({
    actions: speedDialMainItem.option('actions'),
    icon,
    closeIcon: speedDialMainItem._getDefaultOptions().closeIcon,
    position: speedDialMainItem._getPosition(),
    label,
    maxSpeedDialActionCount: speedDialMainItem._getDefaultOptions().maxSpeedDialActionCount,
    direction: speedDialMainItem._getDefaultOptions().direction
  });
}
