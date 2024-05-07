/**
* DevExtreme (cjs/ui/html_editor/utils/image_uploader_helper.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ImageUploader = void 0;
exports.correctSlashesInUrl = correctSlashesInUrl;
exports.getFileUploaderBaseOptions = getFileUploaderBaseOptions;
exports.serverUpload = serverUpload;
exports.urlUpload = urlUpload;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _iterator = require("../../../core/utils/iterator");
var _extend = require("../../../core/utils/extend");
var _size = require("../../../core/utils/size");
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _type = require("../../../core/utils/type");
var _themes = require("../../themes");
var _button_group = _interopRequireDefault(require("../../button_group"));
var _file_uploader = _interopRequireDefault(require("../../file_uploader"));
var _text_box = _interopRequireDefault(require("../../text_box"));
const _excluded = ["imageSrc", "src"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const isMobile = _devices.default.current().deviceType === 'phone';
const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
const DIALOG_UPDATE_IMAGE_CAPTION = 'dxHtmlEditor-dialogUpdateImageCaption';
const DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
const DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
const DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
const DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';
const DIALOG_IMAGE_ADD_BUTTON = 'dxHtmlEditor-dialogImageAddButton';
const DIALOG_IMAGE_UPDATE_BUTTON = 'dxHtmlEditor-dialogImageUpdateButton';
const DIALOG_IMAGE_SPECIFY_URL = 'dxHtmlEditor-dialogImageSpecifyUrl';
const DIALOG_IMAGE_SELECT_FILE = 'dxHtmlEditor-dialogImageSelectFile';
const DIALOG_IMAGE_KEEP_ASPECT_RATIO = 'dxHtmlEditor-dialogImageKeepAspectRatio';
const DIALOG_IMAGE_ENCODE_TO_BASE64 = 'dxHtmlEditor-dialogImageEncodeToBase64';
const DIALOG_IMAGE_POPUP_CLASS = 'dx-htmleditor-add-image-popup';
const DIALOG_IMAGE_POPUP_WITH_TABS_CLASS = 'dx-htmleditor-add-image-popup-with-tabs';
const DIALOG_IMAGE_FIX_RATIO_CONTAINER = 'dx-fix-ratio-container';
const FORM_DIALOG_CLASS = 'dx-formdialog';
const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';
const FILE_UPLOADER_NAME = 'dx-htmleditor-image';
let ImageUploader = exports.ImageUploader = /*#__PURE__*/function () {
  function ImageUploader(module, config) {
    this.module = module;
    this.config = config !== null && config !== void 0 ? config : {};
    this.quill = this.module.quill;
    this.editorInstance = this.module.editorInstance;
  }
  var _proto = ImageUploader.prototype;
  _proto.render = function render() {
    if (this.editorInstance._formDialog) {
      this.editorInstance._formDialog.beforeAddButtonAction = () => this.getCurrentTab().upload();
    }
    this.tabPanelIndex = 0;
    this.formData = this.getFormData();
    this.isUpdating = this.isImageUpdating();
    this.tabsModel = this.createTabsModel(this.config.tabs);
    this.tabs = this.createTabs(this.formData);
    const formConfig = this.getFormConfig();
    this.updatePopupConfig();
    this.updateAddButtonState();
    this.editorInstance.showFormDialog(formConfig).done((formData, event) => {
      this.tabs[this.getActiveTabIndex()].strategy.pasteImage(formData, event);
    }).always(() => {
      this.resetDialogPopupOptions();
      this.quill.focus();
    });
  };
  _proto.getCurrentTab = function getCurrentTab() {
    return this.tabs[this.tabPanelIndex];
  };
  _proto.updateAddButtonState = function updateAddButtonState() {
    const isDisabled = this.getCurrentTab().isDisableButton();
    this.setAddButtonDisabled(isDisabled);
  };
  _proto.setAddButtonDisabled = function setAddButtonDisabled(value) {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.disabled': value
    });
  };
  _proto.getActiveTabIndex = function getActiveTabIndex() {
    return this.isUpdating ? 0 : this.tabPanelIndex;
  };
  _proto.getFormData = function getFormData() {
    return this.getUpdateDialogFormData(this.quill.getFormat());
  };
  _proto.getUpdateDialogFormData = function getUpdateDialogFormData(formData) {
    const {
        imageSrc,
        src
      } = formData,
      props = _objectWithoutPropertiesLoose(formData, _excluded);
    return _extends({
      src: imageSrc !== null && imageSrc !== void 0 ? imageSrc : src
    }, props);
  };
  _proto.createUrlTab = function createUrlTab(formData) {
    return new UrlTab(this.module, {
      config: this.config,
      formData,
      isUpdating: this.isUpdating
    }, () => this.updateAddButtonState());
  };
  _proto.createFileTab = function createFileTab() {
    return new FileTab(this.module, {
      config: this.config
    }, () => this.updateAddButtonState());
  };
  _proto.createTabsModel = function createTabsModel() {
    let model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (model.length === 0 || this.isUpdating) {
      return ['url'];
    }
    return model.map(tab => typeof tab === 'object' ? tab.name : tab);
  };
  _proto.createTabs = function createTabs(formData) {
    return this.tabsModel.map(tabName => {
      const isUrlTab = tabName === 'url';
      return isUrlTab ? this.createUrlTab(formData) : this.createFileTab();
    });
  };
  _proto.isImageUpdating = function isImageUpdating() {
    var _this$module$quill$ge;
    return Object.prototype.hasOwnProperty.call((_this$module$quill$ge = this.module.quill.getFormat()) !== null && _this$module$quill$ge !== void 0 ? _this$module$quill$ge : {}, 'imageSrc');
  };
  _proto.updatePopupConfig = function updatePopupConfig() {
    let wrapperClasses = "".concat(DIALOG_IMAGE_POPUP_CLASS, " ").concat(FORM_DIALOG_CLASS);
    if (this.useTabbedItems()) {
      wrapperClasses += " ".concat(DIALOG_IMAGE_POPUP_WITH_TABS_CLASS);
    }
    const titleKey = this.isUpdating ? DIALOG_UPDATE_IMAGE_CAPTION : DIALOG_IMAGE_CAPTION;
    const addButtonTextKey = this.isUpdating ? DIALOG_IMAGE_UPDATE_BUTTON : DIALOG_IMAGE_ADD_BUTTON;
    this.editorInstance.formDialogOption({
      title: _message.default.format(titleKey),
      'toolbarItems[0].options.text': _message.default.format(addButtonTextKey),
      'wrapperAttr': {
        class: wrapperClasses
      }
    });
  };
  _proto.resetDialogPopupOptions = function resetDialogPopupOptions() {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.text': _message.default.format('OK'),
      'toolbarItems[0].options.visible': true,
      'toolbarItems[0].options.disabled': false,
      wrapperAttr: {
        class: FORM_DIALOG_CLASS
      }
    });
  };
  _proto.useTabbedItems = function useTabbedItems() {
    return this.tabsModel.length > 1;
  };
  _proto.getFormWidth = function getFormWidth() {
    return isMobile ? '100%' : 493;
  };
  _proto.getFormConfig = function getFormConfig() {
    return {
      formData: this.formData,
      width: this.getFormWidth(),
      labelLocation: 'top',
      colCount: this.useTabbedItems() ? 1 : 11,
      items: this.getItemsConfig()
    };
  };
  _proto.getItemsConfig = function getItemsConfig() {
    if (this.useTabbedItems()) {
      const tabsConfig = (0, _iterator.map)(this.tabs, tabController => {
        return {
          title: tabController.getTabName(),
          colCount: 11,
          items: tabController.getItemsConfig()
        };
      });
      return [{
        itemType: 'tabbed',
        tabPanelOptions: {
          onSelectionChanged: e => {
            this.tabPanelIndex = e.component.option('selectedIndex');
            this.updateAddButtonState();
          }
        },
        tabs: tabsConfig
      }];
    }
    return this.tabs[0].getItemsConfig();
  };
  return ImageUploader;
}();
let BaseTab = /*#__PURE__*/function () {
  function BaseTab(module, _ref, onFileSelected) {
    let {
      config,
      formData,
      isUpdating
    } = _ref;
    this.module = module;
    this.config = config;
    this.formData = formData;
    this.isUpdating = isUpdating;
    this.onFileSelected = onFileSelected;
    this.strategy = this.createStrategy();
  }
  var _proto2 = BaseTab.prototype;
  _proto2.getItemsConfig = function getItemsConfig() {
    return this.strategy.getItemsConfig();
  };
  _proto2.createStrategy = function createStrategy() {
    return this.isUpdating ? new UpdateUrlStrategy(this.module, this.config, this.formData) : new AddUrlStrategy(this.module, this.config, this.onFileSelected);
  };
  _proto2.isDisableButton = function isDisableButton() {
    return false;
  };
  _proto2.upload = function upload() {
    return this.strategy.upload();
  };
  return BaseTab;
}();
let UrlTab = /*#__PURE__*/function (_BaseTab) {
  _inheritsLoose(UrlTab, _BaseTab);
  function UrlTab() {
    return _BaseTab.apply(this, arguments) || this;
  }
  var _proto3 = UrlTab.prototype;
  _proto3.getTabName = function getTabName() {
    return _message.default.format(DIALOG_IMAGE_SPECIFY_URL);
  };
  return UrlTab;
}(BaseTab);
let FileTab = /*#__PURE__*/function (_BaseTab2) {
  _inheritsLoose(FileTab, _BaseTab2);
  function FileTab() {
    return _BaseTab2.apply(this, arguments) || this;
  }
  var _proto4 = FileTab.prototype;
  _proto4.getTabName = function getTabName() {
    return _message.default.format(DIALOG_IMAGE_SELECT_FILE);
  };
  _proto4.createStrategy = function createStrategy() {
    return new FileStrategy(this.module, this.config, this.onFileSelected);
  };
  _proto4.isDisableButton = function isDisableButton() {
    return !this.strategy.isValid();
  };
  return FileTab;
}(BaseTab);
let BaseStrategy = /*#__PURE__*/function () {
  function BaseStrategy(module, config) {
    this.module = module;
    this.config = config;
    this.editorInstance = module.editorInstance;
    this.quill = module.quill;
    this.selection = this.getQuillSelection();
  }
  var _proto5 = BaseStrategy.prototype;
  _proto5.getQuillSelection = function getQuillSelection() {
    const selection = this.quill.getSelection();
    return selection !== null && selection !== void 0 ? selection : {
      index: this.quill.getLength(),
      length: 0
    };
  };
  _proto5.pasteImage = function pasteImage() {};
  _proto5.isValid = function isValid() {
    return true;
  };
  _proto5.upload = function upload() {};
  return BaseStrategy;
}();
let AddUrlStrategy = /*#__PURE__*/function (_BaseStrategy) {
  _inheritsLoose(AddUrlStrategy, _BaseStrategy);
  function AddUrlStrategy(module, config, onFileSelected) {
    var _this;
    _this = _BaseStrategy.call(this, module, config, onFileSelected) || this;
    _this.shouldKeepAspectRatio = true;
    return _this;
  }
  var _proto6 = AddUrlStrategy.prototype;
  _proto6.pasteImage = function pasteImage(formData, event) {
    this.module.saveValueChangeEvent(event);
    urlUpload(this.quill, this.selection.index, formData);
  };
  _proto6.keepAspectRatio = function keepAspectRatio(data, _ref2) {
    let {
      dependentEditor,
      e
    } = _ref2;
    const newValue = parseInt(e.value);
    const previousValue = parseInt(e.previousValue);
    const previousDependentEditorValue = parseInt(dependentEditor.option('value'));
    data.component.updateData(data.dataField, newValue);
    if (this.shouldKeepAspectRatio && previousDependentEditorValue && previousValue && !this.preventRecalculating) {
      this.preventRecalculating = true;
      dependentEditor.option('value', Math.round(newValue * previousDependentEditorValue / parseInt(previousValue)).toString());
    }
    this.preventRecalculating = false;
  };
  _proto6.createKeepAspectRatioEditor = function createKeepAspectRatioEditor($container, data, dependentEditorDataField) {
    return this.editorInstance._createComponent($container, _text_box.default, (0, _extend.extend)(true, data.editorOptions, {
      value: data.component.option('formData')[data.dataField],
      onEnterKey: data.component.option('onEditorEnterKey').bind(this.editorInstance._formDialog, data),
      onValueChanged: e => {
        this.keepAspectRatio(data, {
          dependentEditor: this[dependentEditorDataField + 'Editor'],
          e
        });
      }
    }));
  };
  _proto6.upload = function upload() {
    const result = this.editorInstance._formDialog._form.validate();
    return result.isValid;
  };
  _proto6.getItemsConfig = function getItemsConfig() {
    const stylingMode = (0, _themes.isFluent)() ? 'text' : 'outlined';
    return [{
      dataField: 'src',
      colSpan: 11,
      label: {
        text: _message.default.format(DIALOG_IMAGE_FIELD_URL)
      },
      validationRules: [{
        type: 'required'
      }, {
        type: 'stringLength',
        min: 1
      }]
    }, {
      dataField: 'width',
      colSpan: 6,
      label: {
        text: _message.default.format(DIALOG_IMAGE_FIELD_WIDTH)
      },
      template: data => {
        const $content = (0, _renderer.default)('<div>').addClass(DIALOG_IMAGE_FIX_RATIO_CONTAINER);
        const $widthEditor = (0, _renderer.default)('<div>').appendTo($content);
        this.widthEditor = this.createKeepAspectRatioEditor($widthEditor, data, 'height');
        const $ratioEditor = (0, _renderer.default)('<div>').appendTo($content);
        this.editorInstance._createComponent($ratioEditor, _button_group.default, {
          items: [{
            icon: 'imgarlock',
            value: 'keepRatio'
          }],
          hint: _message.default.format(DIALOG_IMAGE_KEEP_ASPECT_RATIO),
          focusStateEnabled: false,
          keyExpr: 'value',
          stylingMode,
          selectionMode: 'multiple',
          selectedItemKeys: ['keepRatio'],
          onSelectionChanged: e => {
            this.shouldKeepAspectRatio = !!e.component.option('selectedItems').length;
          }
        });
        return $content;
      }
    }, {
      dataField: 'height',
      colSpan: 5,
      label: {
        text: _message.default.format(DIALOG_IMAGE_FIELD_HEIGHT)
      },
      template: data => {
        const $content = (0, _renderer.default)('<div>');
        this.heightEditor = this.createKeepAspectRatioEditor($content, data, 'width');
        return $content;
      }
    }, {
      dataField: 'alt',
      colSpan: 11,
      label: {
        text: _message.default.format(DIALOG_IMAGE_FIELD_ALT)
      }
    }];
  };
  return AddUrlStrategy;
}(BaseStrategy);
let UpdateUrlStrategy = /*#__PURE__*/function (_AddUrlStrategy) {
  _inheritsLoose(UpdateUrlStrategy, _AddUrlStrategy);
  function UpdateUrlStrategy(module, config, formData, onFileSelected) {
    var _this2;
    _this2 = _AddUrlStrategy.call(this, module, config, onFileSelected) || this;
    _this2.formData = formData;
    _this2.modifyFormData();
    return _this2;
  }
  var _proto7 = UpdateUrlStrategy.prototype;
  _proto7.modifyFormData = function modifyFormData() {
    const {
      imageSrc
    } = this.quill.getFormat(this.selection.index - 1, 1);
    if (!imageSrc || this.selection.index === 0) {
      this.selection = {
        index: this.selection.index + 1,
        length: 0
      };
      this.quill.setSelection(this.selection.index, this.selection.length, SILENT_ACTION);
    }
    const imgElement = this.quill.getLeaf(this.selection.index)[0].domNode;
    if (imgElement) {
      var _this$formData$width, _this$formData$height;
      this.formData.width = (_this$formData$width = this.formData.width) !== null && _this$formData$width !== void 0 ? _this$formData$width : (0, _size.getWidth)((0, _renderer.default)(imgElement));
      this.formData.height = (_this$formData$height = this.formData.height) !== null && _this$formData$height !== void 0 ? _this$formData$height : (0, _size.getHeight)((0, _renderer.default)(imgElement));
    }
  };
  _proto7.pasteImage = function pasteImage(formData, event) {
    this.quill.deleteText(this.embedFormatIndex(), 1, SILENT_ACTION);
    this.selection.index -= 1;
    _AddUrlStrategy.prototype.pasteImage.call(this, formData, event);
  };
  _proto7.embedFormatIndex = function embedFormatIndex() {
    var _this$selection;
    const selection = (_this$selection = this.selection) !== null && _this$selection !== void 0 ? _this$selection : this.quill.getSelection();
    if (selection) {
      if (selection.length) {
        return selection.index;
      } else {
        return selection.index - 1;
      }
    } else {
      return this.quill.getLength();
    }
  };
  return UpdateUrlStrategy;
}(AddUrlStrategy);
let FileStrategy = /*#__PURE__*/function (_BaseStrategy2) {
  _inheritsLoose(FileStrategy, _BaseStrategy2);
  function FileStrategy(module, config, onFileSelected) {
    var _this3;
    _this3 = _BaseStrategy2.call(this, module, config, onFileSelected) || this;
    _this3.useBase64 = !(0, _type.isDefined)(_this3.config.fileUploadMode) || _this3.config.fileUploadMode === 'base64';
    _this3.isValidInternal = false;
    _this3.onFileSelected = onFileSelected;
    _this3.data = null;
    return _this3;
  }
  var _proto8 = FileStrategy.prototype;
  _proto8.upload = function upload() {
    if (this.useBase64) {
      this.base64Upload(this.data);
    } else if (this.data.value.length) {
      this.data.component.upload();
    }
    return true;
  };
  _proto8.isValid = function isValid() {
    return this.isValidInternal;
  };
  _proto8.onUploaded = function onUploaded(data) {
    serverUpload(this.config.uploadDirectory, data.file.name, this.quill, this.selection.index);
  };
  _proto8.base64Upload = function base64Upload(data) {
    this.quill.getModule('uploader').upload(this.selection, data.value, true);
  };
  _proto8.pasteImage = function pasteImage(formData, event) {
    if (this.useBase64) {
      _BaseStrategy2.prototype.pasteImage.call(this, formData, event);
    }
  };
  _proto8.isBase64Editable = function isBase64Editable() {
    return this.config.fileUploadMode === 'both';
  };
  _proto8.validate = function validate(e) {
    const fileUploader = e.component;
    this.isValidInternal = !fileUploader._files.some(file => !file.isValid());
    if (fileUploader._files.length === 0) {
      this.isValidInternal = false;
    }
  };
  _proto8.getFileUploaderOptions = function getFileUploaderOptions() {
    const fileUploaderOptions = {
      uploadUrl: this.config.uploadUrl,
      onValueChanged: data => {
        this.validate(data);
        this.data = data;
        this.onFileSelected();
      },
      onUploaded: e => this.onUploaded(e)
    };
    return (0, _extend.extend)({}, getFileUploaderBaseOptions(), fileUploaderOptions, this.config.fileUploaderOptions);
  };
  _proto8.getItemsConfig = function getItemsConfig() {
    return [{
      itemType: 'simple',
      dataField: 'files',
      colSpan: 11,
      label: {
        visible: false
      },
      template: () => {
        const $content = (0, _renderer.default)('<div>');
        this.module.editorInstance._createComponent($content, _file_uploader.default, this.getFileUploaderOptions());
        return $content;
      }
    }, {
      itemType: 'simple',
      colSpan: 11,
      label: {
        visible: false
      },
      editorType: 'dxCheckBox',
      editorOptions: {
        value: this.useBase64,
        visible: this.isBase64Editable(),
        text: _message.default.format(DIALOG_IMAGE_ENCODE_TO_BASE64),
        onValueChanged: e => {
          if (this.isBase64Editable()) {
            this.useBase64 = e.value;
          }
        }
      }
    }];
  };
  return FileStrategy;
}(BaseStrategy);
function correctSlashesInUrl(url) {
  return url[url.length - 1] !== '/' ? url + '/' : url;
}
function getFileUploaderBaseOptions() {
  return {
    value: [],
    name: FILE_UPLOADER_NAME,
    accept: 'image/*',
    uploadMode: 'useButtons'
  };
}
function urlUpload(quill, index, attributes) {
  quill.insertEmbed(index, 'extendedImage', attributes, USER_ACTION);
  quill.setSelection(index + 1, 0, USER_ACTION);
}
function serverUpload(url, fileName, quill, pasteIndex) {
  if (url) {
    const imageUrl = correctSlashesInUrl(url) + fileName;
    urlUpload(quill, pasteIndex, {
      src: imageUrl
    });
  }
}
