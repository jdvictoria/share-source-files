import registerComponent from '../../core/component_registrator';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import $ from '../../core/renderer';
// @ts-expect-error
import { grep, noop } from '../../core/utils/common';
import { Deferred, when } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { map } from '../../core/utils/iterator';
import { isDefined, isObject } from '../../core/utils/type';
import eventsEngine from '../../events/core/events_engine';
import { normalizeKeyName } from '../../events/utils/index';
import DropDownEditor from '../../ui/drop_down_editor/ui.drop_down_editor';
import DataExpressionMixin from '../../ui/editor/ui.data_expression';
import { getElementMaxHeightByWindow } from '../../ui/overlay/utils';
import { tabbable } from '../../ui/widget/selectors';
var {
  getActiveElement
} = domAdapter;
var DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
var ANONYMOUS_TEMPLATE_NAME = 'content';
var realDevice = devices.real();
var DropDownBox = DropDownEditor.inherit({
  _supportedKeys() {
    return extend({}, this.callBase(), {
      tab(e) {
        if (!this.option('opened')) {
          return;
        }
        var $tabbableElements = this._getTabbableElements();
        var $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();
        // @ts-expect-error
        $focusableElement && eventsEngine.trigger($focusableElement, 'focus');
        e.preventDefault();
      }
    });
  },
  _getTabbableElements() {
    return this._getElements().filter(tabbable);
  },
  _getElements() {
    return $(this.content()).find('*');
  },
  _getDefaultOptions() {
    return extend(this.callBase(), {
      acceptCustomValue: false,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      openOnFieldClick: true,
      displayValueFormatter(value) {
        return Array.isArray(value) ? value.join(', ') : value;
      },
      useHiddenSubmitElement: true
    });
  },
  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates() {
    this.callBase();
  },
  _initMarkup() {
    this._initDataExpressions();
    this.$element().addClass(DROP_DOWN_BOX_CLASS);
    this.callBase();
  },
  _setSubmitValue() {
    var value = this.option('value');
    var submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;
    this._getSubmitElement().val(submitValue);
  },
  _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && isObject(value);
  },
  _sortValuesByKeysOrder(orderedKeys, values) {
    var sortedValues = values.sort((a, b) => orderedKeys.indexOf(a.itemKey) - orderedKeys.indexOf(b.itemKey));
    return sortedValues.map(x => x.itemDisplayValue);
  },
  _renderInputValue() {
    this._rejectValueLoading();
    var values = [];
    if (!this._dataSource) {
      this.callBase(values);
      // @ts-expect-error
      return new Deferred().resolve();
    }
    var currentValue = this._getCurrentValue();
    var keys = currentValue !== null && currentValue !== void 0 ? currentValue : [];
    keys = Array.isArray(keys) ? keys : [keys];
    var itemLoadDeferreds = map(keys, key => {
      // @ts-expect-error
      var deferred = new Deferred();
      this._loadItem(key).always(item => {
        var displayValue = this._displayGetter(item);
        if (isDefined(displayValue)) {
          values.push({
            itemKey: key,
            itemDisplayValue: displayValue
          });
        } else if (this.option('acceptCustomValue')) {
          values.push({
            itemKey: key,
            itemDisplayValue: key
          });
        }
        deferred.resolve();
      });
      return deferred;
    });
    var callBase = this.callBase.bind(this);
    return when.apply(this, itemLoadDeferreds).always(() => {
      var orderedValues = this._sortValuesByKeysOrder(keys, values);
      this.option('displayValue', orderedValues);
      callBase(values.length && orderedValues);
    });
  },
  _loadItem(value) {
    // @ts-expect-error
    var deferred = new Deferred();
    var that = this;
    var selectedItem = grep(this.option('items') || [], item => this._isValueEquals(this._valueGetter(item), value))[0];
    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
      this._loadValue(value).done(item => {
        deferred.resolve(item);
      }).fail(args => {
        if (args === null || args === void 0 ? void 0 : args.shouldSkipCallback) {
          return;
        }
        if (that.option('acceptCustomValue')) {
          deferred.resolve(value);
        } else {
          deferred.reject();
        }
      });
    }
    return deferred.promise();
  },
  _popupTabHandler(e) {
    if (normalizeKeyName(e) !== 'tab') return;
    var $firstTabbable = this._getTabbableElements().first().get(0);
    var $lastTabbable = this._getTabbableElements().last().get(0);
    var $target = e.target;
    var moveBackward = !!($target === $firstTabbable && e.shiftKey);
    var moveForward = !!($target === $lastTabbable && !e.shiftKey);
    if (moveBackward || moveForward) {
      this.close();
      // @ts-expect-error
      eventsEngine.trigger(this._input(), 'focus');
      if (moveBackward) {
        e.preventDefault();
      }
    }
  },
  _renderPopupContent() {
    if (this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }
    var contentTemplate = this._getTemplateByOption('contentTemplate');
    if (!(contentTemplate && this.option('contentTemplate'))) {
      return;
    }
    var $popupContent = this._popup.$content();
    var templateData = {
      value: this._fieldRenderData(),
      component: this
    };
    $popupContent.empty();
    contentTemplate.render({
      container: getPublicElement($popupContent),
      model: templateData
    });
  },
  _canShowVirtualKeyboard() {
    // @ts-expect-error
    return realDevice.mac; // T845484
  },
  _isNestedElementActive() {
    var activeElement = getActiveElement();
    return activeElement && this._popup.$content().get(0).contains(activeElement);
  },
  _shouldHideOnParentScroll() {
    return realDevice.deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  },
  _popupHiddenHandler() {
    this.callBase();
    this._popupPosition = undefined;
  },
  _popupPositionedHandler(e) {
    this.callBase(e);
    this._popupPosition = e.position;
  },
  _getDefaultPopupPosition(isRtlEnabled) {
    var {
      my,
      at
    } = this.callBase(isRtlEnabled);
    return {
      my,
      at,
      offset: {
        v: -1
      },
      collision: 'flipfit'
    };
  },
  _popupConfig() {
    var {
      focusStateEnabled
    } = this.option();
    return extend(this.callBase(), {
      tabIndex: -1,
      dragEnabled: false,
      focusStateEnabled,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      hideOnParentScroll: this._shouldHideOnParentScroll.bind(this),
      position: extend(this.option('popupPosition'), {
        of: this.$element()
      }),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: function () {
        var _a;
        var popupLocation = (_a = this._popupPosition) === null || _a === void 0 ? void 0 : _a.v.location;
        return getElementMaxHeightByWindow(this.$element(), popupLocation);
      }.bind(this)
    });
  },
  _popupShownHandler() {
    this.callBase();
    var $firstElement = this._getTabbableElements().first();
    // @ts-expect-error
    eventsEngine.trigger($firstElement, 'focus');
  },
  _setCollectionWidgetOption: noop,
  _optionChanged(args) {
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'dataSource':
        this._renderInputValue();
        break;
      case 'displayValue':
        this.option('text', args.value);
        break;
      case 'displayExpr':
        this._renderValue();
        break;
      case 'contentTemplate':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  }
}).include(DataExpressionMixin);
registerComponent('dxDropDownBox', DropDownBox);
export default DropDownBox;