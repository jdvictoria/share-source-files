"use strict";

exports.NotificationManagerStub = exports.NotificationManager = exports.MANAGER_ID_NAME = void 0;
var _guid = _interopRequireDefault(require("../../core/guid"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _icon = require("../../core/utils/icon");
var _uiFile_managerNotification = _interopRequireDefault(require("./ui.file_manager.notification.progress_panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_PROGRESS_BOX_CLASS = 'dx-filemanager-progress-box';
const FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = "".concat(FILE_MANAGER_PROGRESS_BOX_CLASS, "-error");
const FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = "".concat(FILE_MANAGER_PROGRESS_BOX_CLASS, "-image");
const FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = "".concat(FILE_MANAGER_PROGRESS_BOX_CLASS, "-wrapper");
const FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = "".concat(FILE_MANAGER_PROGRESS_BOX_CLASS, "-common");
const MANAGER_ID_NAME = exports.MANAGER_ID_NAME = '__operationInfoManager';
const ACTION_PROGRESS_STATUS = {
  default: 'default',
  progress: 'progress',
  error: 'error',
  success: 'success'
};
let NotificationManagerBase = /*#__PURE__*/function () {
  function NotificationManagerBase(_ref) {
    let {
      onActionProgressStatusChanged,
      isActual
    } = _ref;
    this._id = new _guid.default().toString();
    this._isActual = isActual || false;
    this._actionProgressStatus = ACTION_PROGRESS_STATUS.default;
    this._raiseActionProgress = onActionProgressStatusChanged;
  }
  var _proto = NotificationManagerBase.prototype;
  _proto.getId = function getId() {
    return this._id;
  };
  _proto.isActual = function isActual() {
    return this._isActual;
  };
  _proto.createErrorDetailsProgressBox = function createErrorDetailsProgressBox($container, item, errorText) {
    const detailsItem = this._createDetailsItem($container, item);
    this.renderError(detailsItem.$wrapper, errorText);
  };
  _proto.renderError = function renderError($container, errorText) {
    (0, _renderer.default)('<div>').text(errorText).addClass(FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS).appendTo($container);
  };
  _proto.isActionProgressStatusDefault = function isActionProgressStatusDefault() {
    return this._actionProgressStatus === ACTION_PROGRESS_STATUS.default;
  };
  _proto._createDetailsItem = function _createDetailsItem($container, item) {
    const $detailsItem = (0, _renderer.default)('<div>').appendTo($container);
    return this._createProgressBox($detailsItem, {
      commonText: item.commonText,
      imageUrl: item.imageUrl
    });
  };
  _proto._createProgressBox = function _createProgressBox($container, options) {
    $container.addClass(FILE_MANAGER_PROGRESS_BOX_CLASS);
    if (options.imageUrl) {
      (0, _icon.getImageContainer)(options.imageUrl).addClass(FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS).appendTo($container);
    }
    const $wrapper = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS).appendTo($container);
    const $commonText = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS).text(options.commonText).appendTo($wrapper);
    return {
      $commonText,
      $element: $container,
      $wrapper
    };
  };
  return NotificationManagerBase;
}();
let NotificationManagerStub = exports.NotificationManagerStub = /*#__PURE__*/function (_NotificationManagerB) {
  _inheritsLoose(NotificationManagerStub, _NotificationManagerB);
  function NotificationManagerStub() {
    return _NotificationManagerB.apply(this, arguments) || this;
  }
  var _proto2 = NotificationManagerStub.prototype;
  _proto2.addOperation = function addOperation() {
    return {
      [MANAGER_ID_NAME]: this._id
    };
  };
  _proto2.addOperationDetails = function addOperationDetails() {};
  _proto2.updateOperationItemProgress = function updateOperationItemProgress() {};
  _proto2.completeOperationItem = function completeOperationItem() {};
  _proto2.finishOperation = function finishOperation() {};
  _proto2.completeOperation = function completeOperation() {};
  _proto2.completeSingleOperationWithError = function completeSingleOperationWithError() {};
  _proto2.addOperationDetailsError = function addOperationDetailsError() {};
  _proto2.handleDimensionChanged = function handleDimensionChanged() {
    return false;
  };
  _proto2.ensureProgressPanelCreated = function ensureProgressPanelCreated() {};
  _proto2.tryHideActionProgress = function tryHideActionProgress() {
    this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
  };
  _proto2.updateActionProgressStatus = function updateActionProgressStatus() {
    this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
  };
  _proto2._updateActionProgress = function _updateActionProgress(message, status) {
    if (status !== ACTION_PROGRESS_STATUS.default && status !== ACTION_PROGRESS_STATUS.progress) {
      return;
    }
    this._actionProgressStatus = status;
    this._raiseActionProgress(message, status);
  };
  _proto2.hasNoOperations = function hasNoOperations() {
    return true;
  };
  _createClass(NotificationManagerStub, [{
    key: "_operationInProgressCount",
    get: function () {
      return 0;
    },
    set: function (value) {}
  }, {
    key: "_failedOperationCount",
    get: function () {
      return 0;
    },
    set: function (value) {}
  }]);
  return NotificationManagerStub;
}(NotificationManagerBase);
let NotificationManager = exports.NotificationManager = /*#__PURE__*/function (_NotificationManagerB2) {
  _inheritsLoose(NotificationManager, _NotificationManagerB2);
  function NotificationManager(options) {
    var _this;
    _this = _NotificationManagerB2.call(this, options) || this;
    _this._failedOperationCount = 0;
    _this._operationInProgressCount = 0;
    return _this;
  }
  var _proto3 = NotificationManager.prototype;
  _proto3.addOperation = function addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
    this._operationInProgressCount++;
    const operationInfo = this._progressPanel.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
    operationInfo[MANAGER_ID_NAME] = this._id;
    this._updateActionProgress(processingMessage, ACTION_PROGRESS_STATUS.progress);
    return operationInfo;
  };
  _proto3.addOperationDetails = function addOperationDetails(operationInfo, details, showCloseButton) {
    this._progressPanel.addOperationDetails(operationInfo, details, showCloseButton);
  };
  _proto3.updateOperationItemProgress = function updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
    this._progressPanel.updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress);
  };
  _proto3.completeOperationItem = function completeOperationItem(operationInfo, itemIndex, commonProgress) {
    this._progressPanel.completeOperationItem(operationInfo, itemIndex, commonProgress);
  };
  _proto3.finishOperation = function finishOperation(operationInfo, commonProgress) {
    this._progressPanel.updateOperationCommonProgress(operationInfo, commonProgress);
  };
  _proto3.completeOperation = function completeOperation(operationInfo, commonText, isError, statusText) {
    this._operationInProgressCount--;
    if (isError) {
      this._failedOperationCount++;
    }
    this._progressPanel.completeOperation(operationInfo, commonText, isError, statusText);
  };
  _proto3.completeSingleOperationWithError = function completeSingleOperationWithError(operationInfo, errorInfo) {
    this._progressPanel.completeSingleOperationWithError(operationInfo, errorInfo.detailErrorText);
    this._notifyError(errorInfo);
  };
  _proto3.addOperationDetailsError = function addOperationDetailsError(operationInfo, errorInfo) {
    this._progressPanel.addOperationDetailsError(operationInfo, errorInfo.itemIndex, errorInfo.detailErrorText);
    this._notifyError(errorInfo);
  };
  _proto3.handleDimensionChanged = function handleDimensionChanged() {
    if (this._progressPanel) {
      this._progressPanel.$element().detach();
    }
    return true;
  };
  _proto3.ensureProgressPanelCreated = function ensureProgressPanelCreated(container, options) {
    if (!this._progressPanel) {
      const $progressPanelElement = (0, _renderer.default)('<div>').appendTo(container);
      const ProgressPanelClass = this._getProgressPanelComponent();
      this._progressPanel = new ProgressPanelClass($progressPanelElement, (0, _extend.extend)({}, options, {
        onOperationClosed: _ref2 => {
          let {
            info
          } = _ref2;
          return this._onProgressPanelOperationClosed(info);
        }
      }));
    } else {
      this._progressPanel.$element().appendTo(container);
    }
  }

  // needed for editingProgress.tests.js
  ;
  _proto3._getProgressPanelComponent = function _getProgressPanelComponent() {
    return _uiFile_managerNotification.default;
  };
  _proto3._onProgressPanelOperationClosed = function _onProgressPanelOperationClosed(operationInfo) {
    if (operationInfo.hasError) {
      this._failedOperationCount--;
      this.tryHideActionProgress();
    }
  };
  _proto3.tryHideActionProgress = function tryHideActionProgress() {
    if (this.hasNoOperations()) {
      this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
    }
  };
  _proto3.updateActionProgressStatus = function updateActionProgressStatus(operationInfo) {
    if (operationInfo) {
      const status = this._failedOperationCount === 0 ? ACTION_PROGRESS_STATUS.success : ACTION_PROGRESS_STATUS.error;
      this._updateActionProgress('', status);
    }
  };
  _proto3._notifyError = function _notifyError(errorInfo) {
    const status = this.hasNoOperations() ? ACTION_PROGRESS_STATUS.default : ACTION_PROGRESS_STATUS.error;
    this._updateActionProgress(errorInfo.commonErrorText, status);
  };
  _proto3._updateActionProgress = function _updateActionProgress(message, status) {
    this._actionProgressStatus = status;
    this._raiseActionProgress(message, status);
  };
  _proto3.hasNoOperations = function hasNoOperations() {
    return this._operationInProgressCount === 0 && this._failedOperationCount === 0;
  };
  _createClass(NotificationManager, [{
    key: "_operationInProgressCount",
    get: function () {
      return this._operationInProgressCountInternal;
    },
    set: function (value) {
      this._operationInProgressCountInternal = value;
    }
  }, {
    key: "_failedOperationCount",
    get: function () {
      return this._failedOperationCountInternal;
    },
    set: function (value) {
      this._failedOperationCountInternal = value;
    }
  }]);
  return NotificationManager;
}(NotificationManagerBase);