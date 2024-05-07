/**
* DevExtreme (esm/__internal/ui/m_autocomplete.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../core/component_registrator';
import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { Deferred } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { isCommandKeyPressed } from '../../events/utils/index';
import DropDownList from '../../ui/drop_down_editor/ui.drop_down_list';
var AUTOCOMPLETE_CLASS = 'dx-autocomplete';
var AUTOCOMPLETE_POPUP_WRAPPER_CLASS = 'dx-autocomplete-popup-wrapper';
var Autocomplete = DropDownList.inherit({
  _supportedKeys() {
    var item = this._list ? this._list.option('focusedElement') : null;
    var parent = this.callBase();
    item = item && $(item);
    return extend({}, parent, {
      upArrow(e) {
        if (parent.upArrow.apply(this, arguments) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(-1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      downArrow(e) {
        if (parent.downArrow.apply(this, arguments) && !isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (item && !this._calcNextItem(1)) {
            this._clearFocusedItem();
            return false;
          }
        }
        return true;
      },
      enter(e) {
        if (!item) {
          this.close();
        }
        var opened = this.option('opened');
        if (opened) {
          e.preventDefault();
        }
        return opened;
      }
    });
  },
  _getDefaultOptions() {
    return extend(this.callBase(), {
      minSearchLength: 1,
      maxItemCount: 10,
      noDataText: '',
      showDropDownButton: false,
      searchEnabled: true
    });
  },
  _initMarkup() {
    this.callBase();
    this.$element().addClass(AUTOCOMPLETE_CLASS);
  },
  _getAriaAutocomplete() {
    var {
      disabled,
      readOnly
    } = this.option();
    var isInputEditable = !(readOnly || disabled);
    return isInputEditable ? 'list' : 'none';
  },
  _displayGetterExpr() {
    return this.option('valueExpr');
  },
  _closeOutsideDropDownHandler(_ref) {
    var {
      target
    } = _ref;
    return !$(target).closest(this.$element()).length;
  },
  _renderDimensions() {
    this.callBase();
    this._updatePopupWidth();
    this._updateListDimensions();
  },
  _popupWrapperClass() {
    return "".concat(this.callBase(), " ").concat(AUTOCOMPLETE_POPUP_WRAPPER_CLASS);
  },
  _listConfig() {
    return extend(this.callBase(), {
      pageLoadMode: 'none',
      onSelectionChanged: e => {
        this._setSelectedItem(e.addedItems[0]);
      }
    });
  },
  _listItemClickHandler(e) {
    this._saveValueChangeEvent(e.event);
    var value = this._displayGetter(e.itemData);
    this.option('value', value);
    this.close();
  },
  _setListDataSource() {
    if (!this._list) {
      return;
    }
    this._list.option('selectedItems', []);
    this.callBase();
  },
  _refreshSelected: noop,
  _searchCanceled() {
    this.callBase();
    this.close();
  },
  _loadItem(value, cache) {
    var selectedItem = this._getItemFromPlain(value, cache);
    // @ts-expect-error
    return new Deferred().resolve(selectedItem).promise();
  },
  _dataSourceOptions() {
    return {
      paginate: true,
      pageSize: this.option('maxItemCount')
    };
  },
  _searchDataSource(searchValue) {
    this._dataSource.pageSize(this.option('maxItemCount'));
    this.callBase(searchValue);
    this._clearFocusedItem();
  },
  _clearFocusedItem() {
    if (this._list) {
      this._list.option('focusedElement', null);
      this._list.option('selectedIndex', -1);
    }
  },
  _renderValueEventName() {
    return 'input keyup';
  },
  _valueChangeEventHandler(e) {
    var value = this._input().val() || null;
    return this.callBase(e, value);
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'readOnly':
      case 'disabled':
        this.callBase(args);
        this._setDefaultAria();
        break;
      case 'maxItemCount':
        this._searchDataSource();
        break;
      case 'valueExpr':
        this._compileDisplayGetter();
        this._setListOption('displayExpr', this._displayGetterExpr());
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
  clear() {
    this.callBase();
    this.close();
  },
  reset() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    if (arguments.length) {
      this.callBase(value);
    } else {
      this.callBase();
    }
    this.close();
  }
});
registerComponent('dxAutocomplete', Autocomplete);
export default Autocomplete;
