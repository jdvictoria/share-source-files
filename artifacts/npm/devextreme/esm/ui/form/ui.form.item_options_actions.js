/**
* DevExtreme (esm/ui/form/ui.form.item_options_actions.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import ItemOptionAction from './ui.form.item_option_action';
import { data } from '../../core/element_data';
import { extend } from '../../core/utils/extend';
import { getFullOptionName } from './ui.form.utils';
class WidgetOptionItemOptionAction extends ItemOptionAction {
  tryExecute() {
    var {
      value
    } = this._options;
    var instance = this.findInstance();
    if (instance) {
      instance.option(value);
      return true;
    }
    return false;
  }
}
class TabOptionItemOptionAction extends ItemOptionAction {
  tryExecute() {
    var tabPanel = this.findInstance();
    if (tabPanel) {
      var {
        optionName,
        item,
        value
      } = this._options;
      var itemIndex = this._itemsRunTimeInfo.findItemIndexByItem(item);
      if (itemIndex >= 0) {
        tabPanel.option(getFullOptionName("items[".concat(itemIndex, "]"), optionName), value);
        return true;
      }
    }
    return false;
  }
}
class SimpleItemTemplateChangedAction extends ItemOptionAction {
  tryExecute() {
    return false;
  }
}
class GroupItemTemplateChangedAction extends ItemOptionAction {
  tryExecute() {
    var preparedItem = this.findPreparedItem();
    if (preparedItem != null && preparedItem._prepareGroupItemTemplate && preparedItem._renderGroupContentTemplate) {
      preparedItem._prepareGroupItemTemplate(this._options.item.template);
      preparedItem._renderGroupContentTemplate();
      return true;
    }
    return false;
  }
}
class TabsOptionItemOptionAction extends ItemOptionAction {
  tryExecute() {
    var tabPanel = this.findInstance();
    if (tabPanel) {
      var {
        value
      } = this._options;
      tabPanel.option('dataSource', value);
      return true;
    }
    return false;
  }
}
class ValidationRulesItemOptionAction extends ItemOptionAction {
  tryExecute() {
    var {
      item
    } = this._options;
    var instance = this.findInstance();
    var validator = instance && data(instance.$element()[0], 'dxValidator');
    if (validator && item) {
      var filterRequired = item => item.type === 'required';
      var oldContainsRequired = (validator.option('validationRules') || []).some(filterRequired);
      var newContainsRequired = (item.validationRules || []).some(filterRequired);
      if (!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
        validator.option('validationRules', item.validationRules);
        return true;
      }
    }
    return false;
  }
}
class CssClassItemOptionAction extends ItemOptionAction {
  tryExecute() {
    var $itemContainer = this.findItemContainer();
    var {
      previousValue,
      value
    } = this._options;
    if ($itemContainer) {
      $itemContainer.removeClass(previousValue).addClass(value);
      return true;
    }
    return false;
  }
}
var tryCreateItemOptionAction = (optionName, itemActionOptions) => {
  switch (optionName) {
    case 'editorOptions': // SimpleItem/#editorOptions
    case 'buttonOptions':
      // ButtonItem/#buttonOptions
      return new WidgetOptionItemOptionAction(itemActionOptions);
    case 'validationRules':
      // SimpleItem/#validationRules
      return new ValidationRulesItemOptionAction(itemActionOptions);
    case 'cssClass':
      // ButtonItem/#cssClass or EmptyItem/#cssClass or GroupItem/#cssClass or SimpleItem/#cssClass or TabbedItem/#cssClass
      return new CssClassItemOptionAction(itemActionOptions);
    case 'badge': // TabbedItem/tabs/#badge
    case 'disabled': // TabbedItem/tabs/#disabled
    case 'icon': // TabbedItem/tabs/#icon
    case 'tabTemplate': // TabbedItem/tabs/#tabTemplate
    case 'title':
      // TabbedItem/tabs/#title
      return new TabOptionItemOptionAction(extend(itemActionOptions, {
        optionName
      }));
    case 'tabs':
      // TabbedItem/tabs
      return new TabsOptionItemOptionAction(itemActionOptions);
    case 'template':
      {
        var _itemActionOptions$it, _itemActionOptions$it2, _itemActionOptions$it3;
        // TabbedItem/tabs/#template or SimpleItem/#template or GroupItem/#template
        var itemType = (_itemActionOptions$it = itemActionOptions === null || itemActionOptions === void 0 ? void 0 : (_itemActionOptions$it2 = itemActionOptions.item) === null || _itemActionOptions$it2 === void 0 ? void 0 : _itemActionOptions$it2.itemType) !== null && _itemActionOptions$it !== void 0 ? _itemActionOptions$it : (_itemActionOptions$it3 = itemActionOptions.itemsRunTimeInfo.findPreparedItemByItem(itemActionOptions === null || itemActionOptions === void 0 ? void 0 : itemActionOptions.item)) === null || _itemActionOptions$it3 === void 0 ? void 0 : _itemActionOptions$it3.itemType;
        if (itemType === 'simple') {
          return new SimpleItemTemplateChangedAction(itemActionOptions);
        } else if (itemType === 'group') {
          return new GroupItemTemplateChangedAction(itemActionOptions);
        }
        return new TabOptionItemOptionAction(extend(itemActionOptions, {
          optionName
        }));
      }
    default:
      return null;
  }
};
export default tryCreateItemOptionAction;
