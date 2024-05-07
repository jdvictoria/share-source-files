"use strict";

exports.TemplateManager = void 0;
var _renderer = _interopRequireDefault(require("./renderer"));
var _type = require("./utils/type");
var _common = require("./utils/common");
var _extend = require("./utils/extend");
var _function_template = require("./templates/function_template");
var _empty_template = require("./templates/empty_template");
var _template_manager = require("./utils/template_manager");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = 'template';
const TEMPLATE_OPTIONS_NAME = 'dxTemplate';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const DX_POLYMORPH_WIDGET_TEMPLATE = new _function_template.FunctionTemplate(_ref => {
  let {
    model,
    parent
  } = _ref;
  const widgetName = model.widget;
  if (!widgetName) return (0, _renderer.default)();
  const widgetElement = (0, _renderer.default)('<div>');
  const widgetOptions = model.options || {};
  if (parent) {
    parent._createComponent(widgetElement, widgetName, widgetOptions);
  } else {
    widgetElement[widgetName](widgetOptions);
  }
  return widgetElement;
});
let TemplateManager = exports.TemplateManager = /*#__PURE__*/function () {
  function TemplateManager(createElement, anonymousTemplateName) {
    this._tempTemplates = [];
    this._defaultTemplates = {};
    this._anonymousTemplateName = anonymousTemplateName || ANONYMOUS_TEMPLATE_NAME;
    this._createElement = createElement || _template_manager.defaultCreateElement;
    this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this);
  }
  TemplateManager.createDefaultOptions = function createDefaultOptions() {
    return {
      integrationOptions: {
        watchMethod: function (fn, callback) {
          let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          if (!options.skipImmediate) {
            callback(fn());
          }
          return _common.noop;
        },
        templates: {
          'dx-polymorph-widget': DX_POLYMORPH_WIDGET_TEMPLATE
        },
        useDeferUpdateForTemplates: true
      }
    };
  };
  var _proto = TemplateManager.prototype;
  _proto.addDefaultTemplates = function addDefaultTemplates(templates) {
    this._defaultTemplates = (0, _extend.extend)({}, this._defaultTemplates, templates);
  };
  _proto.dispose = function dispose() {
    this._tempTemplates.forEach(tempTemplate => {
      tempTemplate.template.dispose && tempTemplate.template.dispose();
    });
    this._tempTemplates = [];
  };
  _proto.extractTemplates = function extractTemplates($el) {
    const templates = this._extractTemplates($el);
    const anonymousTemplateMeta = this._extractAnonymousTemplate($el);
    return {
      templates,
      anonymousTemplateMeta
    };
  };
  _proto._extractTemplates = function _extractTemplates($el) {
    const templates = (0, _template_manager.findTemplates)($el, TEMPLATE_OPTIONS_NAME);
    const suitableTemplates = (0, _template_manager.suitableTemplatesByName)(templates);
    templates.forEach(_ref2 => {
      let {
        element,
        options: {
          name
        }
      } = _ref2;
      if (element === suitableTemplates[name]) {
        (0, _renderer.default)(element).addClass(TEMPLATE_WRAPPER_CLASS).detach();
      } else {
        (0, _renderer.default)(element).remove();
      }
    });
    return Object.keys(suitableTemplates).map(name => {
      return {
        name,
        template: this._createTemplate(suitableTemplates[name])
      };
    });
  };
  _proto._extractAnonymousTemplate = function _extractAnonymousTemplate($el) {
    const $anonymousTemplate = $el.contents().detach();
    const $notJunkTemplateContent = $anonymousTemplate.filter((_, element) => {
      const isTextNode = element.nodeType === TEXT_NODE;
      const isEmptyText = (0, _renderer.default)(element).text().trim().length < 1;
      return !(isTextNode && isEmptyText);
    });
    return $notJunkTemplateContent.length > 0 ? {
      template: this._createTemplate($anonymousTemplate),
      name: this._anonymousTemplateName
    } : {};
  };
  _proto._createTemplateIfNeeded = function _createTemplateIfNeeded(templateSource) {
    const cachedTemplate = this._tempTemplates.filter(tempTemplate => tempTemplate.source === (0, _template_manager.templateKey)(templateSource))[0];
    if (cachedTemplate) return cachedTemplate.template;
    const template = this._createTemplate(templateSource);
    this._tempTemplates.push({
      template,
      source: (0, _template_manager.templateKey)(templateSource)
    });
    return template;
  };
  _proto._createTemplate = function _createTemplate(templateSource) {
    return this._createElement((0, _template_manager.validateTemplateSource)(templateSource));
  };
  _proto.getTemplate = function getTemplate(templateSource, templates, _ref3, context) {
    let {
      isAsyncTemplate,
      skipTemplates
    } = _ref3;
    if (!(0, _type.isFunction)(templateSource)) {
      return (0, _template_manager.acquireTemplate)(templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
    }
    return new _function_template.FunctionTemplate(options => {
      const templateSourceResult = templateSource.apply(context, (0, _template_manager.getNormalizedTemplateArgs)(options));
      if (!(0, _type.isDefined)(templateSourceResult)) {
        return new _empty_template.EmptyTemplate();
      }
      let dispose = false;
      const template = (0, _template_manager.acquireTemplate)(templateSourceResult, templateSource => {
        if (templateSource.nodeType || (0, _type.isRenderer)(templateSource) && !(0, _renderer.default)(templateSource).is('script')) {
          return new _function_template.FunctionTemplate(() => templateSource);
        }
        dispose = true;
        return this._createTemplate(templateSource);
      }, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
      const result = template.render(options);
      dispose && template.dispose && template.dispose();
      return result;
    });
  };
  _createClass(TemplateManager, [{
    key: "anonymousTemplateName",
    get: function () {
      return this._anonymousTemplateName;
    }
  }]);
  return TemplateManager;
}();