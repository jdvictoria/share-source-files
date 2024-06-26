"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StateStoringController = void 0;
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _storage = require("../../../../core/utils/storage");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // @ts-expect-error
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
const parseDates = function (state) {
  if (!state) return;
  (0, _iterator.each)(state, (key, value) => {
    if ((0, _type.isPlainObject)(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      const date = DATE_REGEX.exec(value);
      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};
const getStorage = function (options) {
  const storage = options.type === 'sessionStorage' ? (0, _storage.sessionStorage)() : (0, _window.getWindow)().localStorage;
  if (!storage) {
    throw new Error('E1007');
  }
  return storage;
};
const getUniqueStorageKey = function (options) {
  return (0, _type.isDefined)(options.storageKey) ? options.storageKey : 'storage';
};
let StateStoringController = exports.StateStoringController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(StateStoringController, _modules$ViewControll);
  function StateStoringController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = StateStoringController.prototype;
  // TODO getController
  // NOTE: sometimes fields empty in the runtime
  // getter here is a temporary solution
  _proto.getDataController = function getDataController() {
    return this.getController('data');
  };
  _proto.getExportController = function getExportController() {
    return this.getController('export');
  };
  _proto.getColumnsController = function getColumnsController() {
    return this.getController('columns');
  };
  _proto.init = function init() {
    this._state = {};
    this._isLoaded = false;
    this._isLoading = false;
    this._windowUnloadHandler = () => {
      if (this._savingTimeoutID !== undefined) {
        this._saveState(this.state());
      }
    };
    _events_engine.default.on((0, _window.getWindow)(), 'unload', this._windowUnloadHandler);
    return this; // needed by pivotGrid mocks
  };
  _proto.optionChanged = function optionChanged(args) {
    const that = this;
    switch (args.name) {
      case 'stateStoring':
        if (that.isEnabled() && !that.isLoading()) {
          that.load();
        }
        args.handled = true;
        break;
      default:
        _modules$ViewControll.prototype.optionChanged.call(this, args);
    }
  };
  _proto.dispose = function dispose() {
    clearTimeout(this._savingTimeoutID);
    _events_engine.default.off((0, _window.getWindow)(), 'unload', this._windowUnloadHandler);
  };
  _proto._loadState = function _loadState() {
    const options = this.option('stateStoring');
    if (options.type === 'custom') {
      return options.customLoad && options.customLoad();
    }
    try {
      // @ts-expect-error
      return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
    } catch (e) {
      _ui.default.log('W1022', 'State storing', e.message);
    }
  };
  _proto._saveState = function _saveState(state) {
    const options = this.option('stateStoring');
    if (options.type === 'custom') {
      options.customSave && options.customSave(state);
      return;
    }
    try {
      getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
    } catch (e) {
      _ui.default.log(e.message);
    }
  };
  _proto.publicMethods = function publicMethods() {
    return ['state'];
  };
  _proto.isEnabled = function isEnabled() {
    return this.option('stateStoring.enabled');
  };
  _proto.isLoaded = function isLoaded() {
    return this._isLoaded;
  };
  _proto.isLoading = function isLoading() {
    return this._isLoading;
  };
  _proto.load = function load() {
    this._isLoading = true;
    const loadResult = (0, _deferred.fromPromise)(this._loadState());
    loadResult.always(() => {
      this._isLoaded = true;
      this._isLoading = false;
    }).done(state => {
      if (state !== null && !(0, _type.isEmptyObject)(state)) {
        this.state(state);
      }
    });
    return loadResult;
  };
  _proto.state = function state(_state) {
    const that = this;
    if (!arguments.length) {
      return (0, _extend.extend)(true, {}, that._state);
    }
    that._state = (0, _extend.extend)({}, _state);
    parseDates(that._state);
  };
  _proto.save = function save() {
    const that = this;
    clearTimeout(that._savingTimeoutID);
    that._savingTimeoutID = setTimeout(() => {
      that._saveState(that.state());
      that._savingTimeoutID = undefined;
    }, that.option('stateStoring.savingTimeout'));
  };
  return StateStoringController;
}(_m_modules.default.ViewController);
var _default = exports.default = {
  StateStoringController
};