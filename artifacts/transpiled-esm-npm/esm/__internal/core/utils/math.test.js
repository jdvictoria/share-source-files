import _taggedTemplateLiteral from "@babel/runtime/helpers/esm/taggedTemplateLiteral";
var _templateObject;
import { shiftIntegerByModule } from '../../core/utils/math';
import each from 'jest-each';
describe('Math utils tests', () => {
  describe('shiftIntegerByModule', () => {
    each(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      value         | module   | expectedResult\n      ", "          | ", "    | ", "\n      ", "          | ", "    | ", "\n      ", "          | ", "    | ", "\n      ", "          | ", " | ", "\n      ", "          | ", "    | ", "\n      ", "          | ", "    | ", "\n      ", "          | ", "    | ", "\n      ", "       | ", "   | ", "\n      ", "   | ", "   | ", "\n      ", "         | ", "    | ", "\n      ", "         | ", "    | ", "\n      ", "         | ", "    | ", "\n      ", "         | ", "    | ", "\n      ", "      | ", "   | ", "\n      ", "  | ", "   | ", "\n    "])), 0, 2, 0, 2, 2, 0, 2, 4, 2, 2, 1000, 2, 4, 2, 0, 5, 2, 1, 6, 2, 0, 1e10, 10, 0, 1e10 + 3, 10, 3, -9, 3, 0, -1, 6, 5, -3, 9, 6, -5, 9, 4, -1e10, 10, 0, -1e10 + 3, 10, 3).it('should return correct result', _ref => {
      var {
        value,
        module,
        expectedResult
      } = _ref;
      var result = shiftIntegerByModule(value, module);
      expect(result).toEqual(expectedResult);
    });
    it('should throw error if value isn\'t integer', () => {
      expect(() => shiftIntegerByModule(1.5, 3)).toThrow();
    });
    it('should throw error if module value isn\'t integer', () => {
      expect(() => shiftIntegerByModule(2, 2.5)).toThrow();
    });
    it('should throw error if module value equals zero', () => {
      expect(() => shiftIntegerByModule(2, 0)).toThrow();
    });
    it('should throw error if module value less than zero', () => {
      expect(() => shiftIntegerByModule(2, -2)).toThrow();
    });
  });
});