/**
* DevExtreme (esm/__internal/grids/data_grid/m_columns_controller.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { extend } from '../../../core/utils/extend';
import { columnsControllerModule } from '../../grids/grid_core/columns_controller/m_columns_controller';
import gridCore from './m_core';
gridCore.registerModule('columns', {
  defaultOptions() {
    return extend(true, {}, columnsControllerModule.defaultOptions(), {
      commonColumnSettings: {
        allowExporting: true
      }
    });
  },
  controllers: columnsControllerModule.controllers
});
