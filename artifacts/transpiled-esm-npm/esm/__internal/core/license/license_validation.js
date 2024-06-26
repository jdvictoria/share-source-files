import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import errors from '../../../core/errors';
import { version as packageVersion } from '../../../core/version';
import { getPreviousMajorVersion, parseVersion, stringifyVersion, VERSION_SPLITTER } from '../../utils/version';
import { base64ToBytes } from './byte_utils';
import { INTERNAL_USAGE_ID, PUBLIC_KEY } from './key';
import { pad } from './pkcs1';
import { compareSignatures } from './rsa_bigint';
import { sha1 } from './sha1';
import { showTrialPanel } from './trial_panel';
import { TokenKind } from './types';
var FORMAT = 1;
var RTM_MIN_PATCH_VERSION = 3;
var BUY_NOW_LINK = 'https://go.devexpress.com/Licensing_Installer_Watermark_DevExtreme.aspx';
var GENERAL_ERROR = {
  kind: TokenKind.corrupted,
  error: 'general'
};
var VERIFICATION_ERROR = {
  kind: TokenKind.corrupted,
  error: 'verification'
};
var DECODING_ERROR = {
  kind: TokenKind.corrupted,
  error: 'decoding'
};
var DESERIALIZATION_ERROR = {
  kind: TokenKind.corrupted,
  error: 'deserialization'
};
var PAYLOAD_ERROR = {
  kind: TokenKind.corrupted,
  error: 'payload'
};
var VERSION_ERROR = {
  kind: TokenKind.corrupted,
  error: 'version'
};
var validationPerformed = false;
// verifies RSASSA-PKCS1-v1.5 signature
function verifySignature(_ref) {
  var {
    text,
    signature: encodedSignature
  } = _ref;
  return compareSignatures({
    key: PUBLIC_KEY,
    signature: base64ToBytes(encodedSignature),
    actual: pad(sha1(text))
  });
}
export function parseLicenseKey(encodedKey) {
  if (encodedKey === undefined) {
    return GENERAL_ERROR;
  }
  var parts = encodedKey.split(VERSION_SPLITTER);
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return GENERAL_ERROR;
  }
  if (!verifySignature({
    text: parts[0],
    signature: parts[1]
  })) {
    return VERIFICATION_ERROR;
  }
  var decodedPayload = '';
  try {
    decodedPayload = atob(parts[0]);
  } catch (_a) {
    return DECODING_ERROR;
  }
  var payload = {};
  try {
    payload = JSON.parse(decodedPayload);
  } catch (_b) {
    return DESERIALIZATION_ERROR;
  }
  var {
      customerId,
      maxVersionAllowed,
      format,
      internalUsageId
    } = payload,
    rest = __rest(payload, ["customerId", "maxVersionAllowed", "format", "internalUsageId"]);
  if (internalUsageId !== undefined) {
    return {
      kind: TokenKind.internal,
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
    kind: TokenKind.verified,
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
  var {
    licenseKey,
    version
  } = _ref2;
  var preview = false;
  try {
    preview = isPreview(version.patch);
    var {
      major,
      minor
    } = preview ? getPreviousMajorVersion(version) : version;
    if (!licenseKey) {
      return {
        preview,
        error: 'W0019'
      };
    }
    var license = parseLicenseKey(licenseKey);
    if (license.kind === TokenKind.corrupted) {
      return {
        preview,
        error: 'W0021'
      };
    }
    if (license.kind === TokenKind.internal) {
      return {
        preview,
        internal: true,
        error: license.internalUsageId === INTERNAL_USAGE_ID ? undefined : 'W0020'
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
export function validateLicense(licenseKey) {
  var versionStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : packageVersion;
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;
  var version = parseVersion(versionStr);
  var preview = isPreview(version.patch);
  var {
    internal,
    error
  } = getLicenseCheckParams({
    licenseKey,
    version
  });
  if (error && !internal) {
    showTrialPanel(BUY_NOW_LINK, stringifyVersion(version));
  }
  if (error) {
    errors.log(preview ? 'W0022' : error);
    return;
  }
  if (preview && !internal) {
    errors.log('W0022');
  }
}
export function peekValidationPerformed() {
  return validationPerformed;
}
export function setLicenseCheckSkipCondition() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
}
// NOTE: We need this default export
// to allow QUnit mock the validateLicense function
export default {
  validateLicense
};