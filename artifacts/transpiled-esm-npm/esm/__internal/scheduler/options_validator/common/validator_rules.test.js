import { mustBeDivisibleBy, mustBeGreaterThan, mustBeInRange, mustBeInteger, mustBeLessThan } from '../../../scheduler/options_validator/common/validator_rules';
import * as validationFunctions from './validation_functions';
describe('mustBeInteger', () => {
  var mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'isInteger');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call isInteger function', () => {
    mustBeInteger(10);
    expect(mock).toHaveBeenCalledWith(10);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    var result = mustBeInteger(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var result = mustBeInteger(10.5);
    expect(result).toBe('10.5 must be an integer.');
  });
  it('should be the function with the correct name', () => {
    var func = mustBeInteger;
    expect(func.name).toBe('mustBeInteger');
  });
});
describe('mustBeGreaterThan', () => {
  var mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call greaterThan function', () => {
    var func = mustBeGreaterThan(10, true);
    func(15);
    expect(mock).toHaveBeenCalledWith(15, 10, true);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    var func = mustBeGreaterThan(10, true);
    var result = func(15);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeGreaterThan(15, true);
    var result = func(10);
    expect(result).toBe('10 must be > than 15.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeGreaterThan(15, false);
    var result = func(10);
    expect(result).toBe('10 must be >= than 15.');
  });
  it('should be the function with the correct name', () => {
    var func = mustBeGreaterThan(15, false);
    expect(func.name).toBe('mustBeGreaterThan');
  });
});
describe('mustBeLessThan', () => {
  var mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call lessThan function', () => {
    var func = mustBeLessThan(10, true);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, 10, true);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    var func = mustBeLessThan(10, true);
    var result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeLessThan(10, true);
    var result = func(15);
    expect(result).toBe('15 must be < than 10.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeLessThan(10, false);
    var result = func(15);
    expect(result).toBe('15 must be <= than 10.');
  });
  it('should be the function with the correct name', () => {
    var func = mustBeLessThan(15, false);
    expect(func.name).toBe('mustBeLessThan');
  });
});
describe('mustBeInRange', () => {
  var mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'inRange');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call inRange function', () => {
    var func = mustBeInRange([0, 10]);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, [0, 10]);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    var func = mustBeInRange([0, 10]);
    var result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeInRange([0, 10]);
    var result = func(15);
    expect(result).toBe('15 must be in range [0, 10].');
  });
  it('should be the function with the correct name', () => {
    var func = mustBeInRange([0, 10]);
    expect(func.name).toBe('mustBeInRange');
  });
});
describe('mustBeDivisibleBy', () => {
  var mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });
  afterEach(() => {
    mock === null || mock === void 0 ? void 0 : mock.mockReset();
  });
  it('should call divisibleBy function', () => {
    var func = mustBeDivisibleBy(10);
    func(100);
    expect(mock).toHaveBeenCalledWith(100, 10);
  });
  it('should return true if valid', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => true);
    var func = mustBeDivisibleBy(5);
    var result = func(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    mock === null || mock === void 0 ? void 0 : mock.mockImplementation(() => false);
    var func = mustBeDivisibleBy(5);
    var result = func(6);
    expect(result).toBe('6 must be divisible by 5.');
  });
  it('should be the function with the correct name', () => {
    var func = mustBeDivisibleBy(5);
    expect(func.name).toBe('mustBeDivisibleBy');
  });
});