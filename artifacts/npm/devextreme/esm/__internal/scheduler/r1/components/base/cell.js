/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/cell.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../utils/index';
export var CellBaseDefaultProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: {
    data: {},
    index: 0
  }
};
export class CellBase extends BaseInfernoComponent {
  render() {
    var {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      children,
      ariaLabel
    } = this.props;
    var classes = renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
    return createVNode(1, "td", classes, children, 0, {
      "aria-label": ariaLabel
    });
  }
}
CellBase.defaultProps = CellBaseDefaultProps;
