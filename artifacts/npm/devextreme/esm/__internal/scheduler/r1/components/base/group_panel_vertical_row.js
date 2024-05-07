/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/group_panel_vertical_row.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { GroupPanelRowDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';
export class GroupPanelVerticalRow extends BaseInfernoComponent {
  render() {
    var {
      className,
      groupItems,
      cellTemplate
    } = this.props;
    var CellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, "div", "dx-scheduler-group-row ".concat(className), groupItems.map((_ref, index) => {
      var {
        color,
        data,
        id,
        key,
        text
      } = _ref;
      return createComponentVNode(2, GroupPanelVerticalCell, {
        "text": text,
        "id": id,
        "data": data,
        "index": index,
        "color": color,
        "cellTemplate": CellTemplateComponent
      }, key);
    }), 0);
  }
}
GroupPanelVerticalRow.defaultProps = GroupPanelRowDefaultProps;
