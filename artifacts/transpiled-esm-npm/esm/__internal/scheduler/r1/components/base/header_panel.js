import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode, createComponentVNode } from "inferno";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { isHorizontalGroupingApplied } from '../../utils/index';
import { DateHeader } from './date_header';
import { GroupPanel, GroupPanelDefaultProps } from './group_panel';
export var HeaderPanelDefaultProps = _extends(_extends({}, GroupPanelDefaultProps), {
  isRenderDateHeader: true,
  dateHeaderTemplate: DateHeader
});
export class HeaderPanel extends InfernoWrapperComponent {
  // eslint-disable-next-line class-methods-use-this
  createEffects() {
    return [createReRenderEffect()];
  }
  render() {
    var {
      dateHeaderData,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      dateCellTemplate,
      dateHeaderTemplate,
      resourceCellTemplate,
      timeCellTemplate
    } = this.props;
    var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
    var DateCellTemplateComponent = getTemplate(dateCellTemplate);
    var DateHeaderTemplateComponent = getTemplate(dateHeaderTemplate);
    var ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    var TimeCellTemplateComponent = getTemplate(timeCellTemplate);
    return createVNode(1, "thead", null, [isHorizontalGrouping && !groupByDate && createComponentVNode(2, GroupPanel, {
      "groupPanelData": groupPanelData,
      "groups": groups,
      "groupByDate": groupByDate,
      "groupOrientation": groupOrientation,
      "resourceCellTemplate": ResourceCellTemplateComponent
    }), isRenderDateHeader && DateHeaderTemplateComponent({
      groupByDate,
      dateHeaderData,
      groupOrientation,
      groups,
      dateCellTemplate: DateCellTemplateComponent,
      timeCellTemplate: TimeCellTemplateComponent
    }), groupByDate && createComponentVNode(2, GroupPanel, {
      "groupPanelData": groupPanelData,
      "groups": groups,
      "groupByDate": groupByDate,
      "groupOrientation": groupOrientation,
      "resourceCellTemplate": ResourceCellTemplateComponent
    })], 0);
  }
}
HeaderPanel.defaultProps = HeaderPanelDefaultProps;