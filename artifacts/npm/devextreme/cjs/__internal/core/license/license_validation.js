/**
* DevExtreme (cjs/__internal/core/license/license_validation.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.parseLicenseKey = parseLicenseKey;
exports.peekValidationPerformed = peekValidationPerformed;
exports.setLicenseCheckSkipCondition = setLicenseCheckSkipCondition;
exports.validateLicense = validateLicense;
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _version = require("../../../core/version");
var _version2 = require("../../utils/version");
var _byte_utils = require("./byte_utils");
var _key = require("./key");
var _pkcs = require("./pkcs1");
var _rsa_bigint = require("./rsa_bigint");
var _sha = require("./sha1");
var _trial_panel = require("./trial_panel");
var _types = require("./types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const FORMAT = 1;
const RTM_MIN_PATCH_VERSION = 3;
const BUY_NOW_LINK = 'https://go.devexpress.com/Licensing_Installer_Watermark_DevExtreme.aspx';
const GENERAL_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'general'
};
const VERIFICATION_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'verification'
};
const DECODING_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'decoding'
};
const DESERIALIZATION_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'deserialization'
};
const PAYLOAD_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'payload'
};
const VERSION_ERROR = {
  kind: _types.TokenKind.corrupted,
  error: 'version'
};
let validationPerformed = false;
// verifies RSASSA-PKCS1-v1.5 signature
function verifySignature(_ref) {
  let {
    text,
    signature: encodedSignature
  } = _ref;
  return (0, _rsa_bigint.compareSignatures)({
    key: _key.PUBLIC_KEY,
    signature: (0, _byte_utils.base64ToBytes)(encodedSignature),
    actual: (0, _pkcs.pad)((0, _sha.sha1)(text))
  });
}
function parseLicenseKey(encodedKey) {
  if (encodedKey === undefined) {
    return GENERAL_ERROR;
  }
  const parts = encodedKey.split(_version2.VERSION_SPLITTER);
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return GENERAL_ERROR;
  }
  if (!verifySignature({
    text: parts[0],
    signature: parts[1]
  })) {
    return VERIFICATION_ERROR;
  }
  let decodedPayload = '';
  try {
    decodedPayload = atob(parts[0]);
  } catch (_a) {
    return DECODING_ERROR;
  }
  let payload = {};
  try {
    payload = JSON.parse(decodedPayload);
  } catch (_b) {
    return DESERIALIZATION_ERROR;
  }
  const {
      customerId,
      maxVersionAllowed,
      format,
      internalUsageId
    } = payload,
    rest = __rest(payload, ["customerId", "maxVersionAllowed", "format", "internalUsageId"]);
  if (internalUsageId !== undefined) {
    return {
      kind: _types.TokenKind.internal,
      internalUsageId
    };
  }
  if (customerId === undefined || maxVersionAllowed === undefined || format === undefined) {
    return PAYLOAD_ERROR;
  }
  if (format !== FORMAT) {
    return VERSION_ERROR;
  }
  return {
    kind: _types.TokenKind.verified,
    payload: _extends({
      customerId,
      maxVersionAllowed
    }, rest)
  };
}
function isPreview(patch) {
  return isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;
}
function getLicenseCheckParams(_ref2) {
  let {
    licenseKey,
    version
  } = _ref2;
  let preview = false;
  try {
    preview = isPreview(version.patch);
    const {
      major,
      minor
    } = preview ? (0, _version2.getPreviousMajorVersion)(version) : version;
    if (!licenseKey) {
      return {
        preview,
        error: 'W0019'
      };
    }
    const license = parseLicenseKey(licenseKey);
    if (license.kind === _types.TokenKind.corrupted) {
      return {
        preview,
        error: 'W0021'
      };
    }
    if (license.kind === _types.TokenKind.internal) {
      return {
        preview,
        internal: true,
        error: license.internalUsageId === _key.INTERNAL_USAGE_ID ? undefined : 'W0020'
      };
    }
    if (!(major && minor)) {
      return {
        preview,
        error: 'W0021'
      };
    }
    if (major * 10 + minor > license.payload.maxVersionAllowed) {
      return {
        preview,
        error: 'W0020'
      };
    }
    return {
      preview,
      error: undefined
    };
  } catch (_a) {
    return {
      preview,
      error: 'W0021'
    };
  }
}
function validateLicense(licenseKey) {
  let versionStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _version.version;
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;
  const version = (0, _version2.parseVersion)(versionStr);
  const preview = isPreview(version.patch);
  const {
    internal,
    error
  } = getLicenseCheckParams({
    licenseKey,
    version
  });
  if (error && !internal) {
    (0, _trial_panel.showTrialPanel)(BUY_NOW_LINK, (0, _version2.stringifyVersion)(version));
  }
  if (error) {
    _errors.default.log(preview ? 'W0022' : error);
    return;
  }
  if (preview && !internal) {
    _errors.default.log('W0022');
  }
}
function peekValidationPerformed() {
  return validationPerformed;
}
function setLicenseCheckSkipCondition() {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
}
// NOTE: We need this default export
// to allow QUnit mock the validateLicense function
var _default = exports.default = {
  validateLicense
};
