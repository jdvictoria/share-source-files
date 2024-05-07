"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
var _uiFile_managerDialog = _interopRequireDefault(require("./ui.file_manager.dialog.name_editor"));
var _uiFile_managerDialog2 = _interopRequireDefault(require("./ui.file_manager.dialog.folder_chooser"));
var _uiFile_managerDialog3 = _interopRequireDefault(require("./ui.file_manager.dialog.delete_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let FileManagerDialogManager = /*#__PURE__*/function () {
  function FileManagerDialogManager($element, options) {
    this._$element = $element;
    this._options = options;
    const baseDialogOptions = {
      onClosed: this._options['onDialogClosed'],
      rtlEnabled: this._options['rtlEnabled']
    };
    const $chooseFolderDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._chooseDirectoryDialog = new _uiFile_managerDialog2.default($chooseFolderDialog, (0, _extend.extend)(baseDialogOptions, this._options['chooseDirectoryDialog']));
    const $renameDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._renameItemDialog = new _uiFile_managerDialog.default($renameDialog, (0, _extend.extend)(baseDialogOptions, {
      title: _message.default.format('dxFileManager-dialogRenameItemTitle'),
      buttonText: _message.default.format('dxFileManager-dialogRenameItemButtonText')
    }));
    const $createDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._createItemDialog = new _uiFile_managerDialog.default($createDialog, (0, _extend.extend)(baseDialogOptions, {
      title: _message.default.format('dxFileManager-dialogCreateDirectoryTitle'),
      buttonText: _message.default.format('dxFileManager-dialogCreateDirectoryButtonText')
    }));
    const $deleteItemDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._deleteItemDialog = new _uiFile_managerDialog3.default($deleteItemDialog, baseDialogOptions);
  }
  var _proto = FileManagerDialogManager.prototype;
  _proto.getCopyDialog = function getCopyDialog(targetItemInfos) {
    this._chooseDirectoryDialog.switchToCopyDialog(targetItemInfos);
    return this._chooseDirectoryDialog;
  };
  _proto.getMoveDialog = function getMoveDialog(targetItemInfos) {
    this._chooseDirectoryDialog.switchToMoveDialog(targetItemInfos);
    return this._chooseDirectoryDialog;
  };
  _proto.getRenameItemDialog = function getRenameItemDialog() {
    return this._renameItemDialog;
  };
  _proto.getCreateItemDialog = function getCreateItemDialog() {
    return this._createItemDialog;
  };
  _proto.getDeleteItemDialog = function getDeleteItemDialog() {
    return this._deleteItemDialog;
  };
  _proto.updateDialogRtl = function updateDialogRtl(value) {
    [this._chooseDirectoryDialog, this._renameItemDialog, this._createItemDialog, this._deleteItemDialog].forEach(dialog => {
      dialog.option('rtlEnabled', value);
    });
  };
  return FileManagerDialogManager;
}();
var _default = exports.default = FileManagerDialogManager;
module.exports = exports.default;
module.exports.default = exports.default;