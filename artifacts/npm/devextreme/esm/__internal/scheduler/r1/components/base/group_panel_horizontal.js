/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/group_panel_horizontal.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createFragment, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { GroupPanelHorizontalRow } from './group_panel_horizontal_row';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
export class GroupPanelHorizontal extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this._groupPanelItems = null;
  }
  getGroupPanelItems() {
    if (this._groupPanelItems !== null) {
      return this._groupPanelItems;
    }
    var {
      groupPanelData: {
        baseColSpan,
        groupPanelItems
      }
    } = this.props;
    var colSpans = groupPanelItems.reduceRight((currentColSpans, groupsRow, idx) => {
      var nextColSpans = currentColSpans;
      var currentLevelGroupCount = groupsRow.length;
      var previousColSpan = idx === groupPanelItems.length - 1 ? baseColSpan : currentColSpans[idx + 1];
      var previousLevelGroupCount = idx === groupPanelItems.length - 1 ? currentLevelGroupCount : groupPanelItems[idx + 1].length;
      var groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;
      nextColSpans[idx] = groupCountDiff * previousColSpan;
      return nextColSpans;
    }, [...new Array(groupPanelItems.length)]);
    this._groupPanelItems = groupPanelItems.map((groupsRenderRow, index) => {
      var colSpan = colSpans[index];
      return groupsRenderRow.map(groupItem => _extends(_extends({}, groupItem), {
        colSpan
      }));
    });
    return this._groupPanelItems;
  }
  componentWillUpdate(nextProps) {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this._groupPanelItems = null;
    }
  }
  render() {
    var {
      resourceCellTemplate
    } = this.props;
    var groupPanelItems = this.getGroupPanelItems();
    var ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    return createFragment(groupPanelItems.map(group => createComponentVNode(2, GroupPanelHorizontalRow, {
      "groupItems": group,
      "cellTemplate": ResourceCellTemplateComponent
    }, group[0].key)), 0);
  }
}
GroupPanelHorizontal.defaultProps = GroupPanelBaseDefaultProps;
