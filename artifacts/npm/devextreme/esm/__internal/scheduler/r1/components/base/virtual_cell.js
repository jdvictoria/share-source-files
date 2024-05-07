/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/virtual_cell.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';
export var VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false
};
export class VirtualCell extends BaseInfernoComponent {
  render() {
    var {
      colSpan,
      isHeaderCell,
      width,
      styles
    } = this.props;
    var modifiedStyles = renderUtils.addWidthToStyle(width, styles);
    var Cell = isHeaderCell ? HeaderCell : OrdinaryCell;
    return createComponentVNode(2, Cell, {
      "className": "dx-scheduler-virtual-cell",
      "styles": modifiedStyles,
      "colSpan": colSpan
    });
  }
}
VirtualCell.defaultProps = VirtualCellDefaultProps;
