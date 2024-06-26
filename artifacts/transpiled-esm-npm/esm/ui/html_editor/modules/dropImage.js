import Quill from 'devextreme-quill';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import { each } from '../../../core/utils/iterator';
import browser from '../../../core/utils/browser';
import { getWindow } from '../../../core/utils/window';
import BaseModule from './base';
var DropImageModule = BaseModule;
if (Quill) {
  DropImageModule = class DropImageModule extends BaseModule {
    constructor(quill, options) {
      super(quill, options);
      var widgetName = this.editorInstance.NAME;
      eventsEngine.on(this.quill.root, addNamespace('drop', widgetName), this._dropHandler.bind(this));
      eventsEngine.on(this.quill.root, addNamespace('paste', widgetName), this._pasteHandler.bind(this));
    }
    _dropHandler(e) {
      var _dataTransfer$files;
      var dataTransfer = e.originalEvent.dataTransfer;
      var hasFiles = dataTransfer === null || dataTransfer === void 0 ? void 0 : (_dataTransfer$files = dataTransfer.files) === null || _dataTransfer$files === void 0 ? void 0 : _dataTransfer$files.length;
      this.saveValueChangeEvent(e);
      e.preventDefault();
      if (hasFiles) {
        this._getImage(dataTransfer.files, this._addImage.bind(this));
      }
    }
    _pasteHandler(e) {
      var _clipboardData$items;
      var {
        clipboardData
      } = e.originalEvent;
      this.saveValueChangeEvent(e);
      if (!clipboardData) {
        return;
      }
      var hasDataItems = (_clipboardData$items = clipboardData.items) === null || _clipboardData$items === void 0 ? void 0 : _clipboardData$items.length;
      var isHtmlData = clipboardData.getData('text/html');
      if (!isHtmlData && hasDataItems) {
        this._getImage(clipboardData.items, imageData => {
          if (browser.mozilla) {
            return;
          }
          this._addImage(imageData);
        });
      }
    }
    _isImage(file) {
      return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i);
    }
    _getImage(files, callback) {
      var window = getWindow();
      each(files, (index, file) => {
        if (!this._isImage(file)) {
          return;
        }
        var reader = new window.FileReader();
        reader.onload = _ref => {
          var {
            target
          } = _ref;
          callback(target.result);
        };
        var readableFile = file.getAsFile ? file.getAsFile() : file;
        if (readableFile instanceof window.Blob) {
          reader.readAsDataURL(readableFile);
        }
      });
    }
    _addImage(data) {
      var selection = this.quill.getSelection();
      var pasteIndex = selection ? selection.index : this.quill.getLength();
      this.quill.insertEmbed(pasteIndex, 'extendedImage', data, 'user');
    }
  };
}
export default DropImageModule;