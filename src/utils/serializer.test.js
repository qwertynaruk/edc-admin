import { getWithQuery } from './serializer';

describe('getWithQuery', () => {
  it('should return default value when undefined or null', () => {
    expect(getWithQuery(undefined)).toBe('-');
    expect(getWithQuery(null)).toBe('-');
  });
  it('should return original type of result when query with single', () => {
    const input = { a: 1, b: 2, c: [1, 2, 3] };
    expect(getWithQuery(input, 'a')).toBe(1);
    expect(getWithQuery(input, 'c')).toEqual([1, 2, 3]);
  });
  it('should can query with multiple key and return string', () => {
    const input = { a: 1, b: 2 };
    expect(getWithQuery(input, 'a, b')).toEqual('1, 2');
  });
  it('should can query nested', () => {
    const input = { a: { b: { c: 1 } } };
    expect(getWithQuery(input, 'a.b.c')).toBe(1);
    expect(getWithQuery(input, 'a.b.c, a.b.c')).toBe('1, 1');
  });
  it('should not include when not found', () => {
    const input = { a: 1, b: 2 };
    expect(getWithQuery(input, 'a, c')).toEqual('1');
    expect(getWithQuery(input, 'a, b, c')).toEqual('1, 2');
    expect(getWithQuery(input, 'b, c')).toEqual('2');
    expect(getWithQuery(input, 'c')).toEqual('-');
    expect(getWithQuery(input, 'c, c')).toEqual('-');
  });
  it('should can custom default value', () => {
    const input = { a: 1, b: 2 };
    expect(getWithQuery(input, 'c', 'not found')).toEqual('not found');
  });
  it('should can custom join seperator', () => {
    const input = { a: 1, b: 2 };
    expect(getWithQuery(input, 'a, b', '-', '.')).toEqual('1.2');
  });
  it('should can query with array', () => {
    const input = { a: 1, b: 2, c: [1, 2, 3] };
    expect(getWithQuery(input, 'a, c.2')).toEqual('1, 3');
    expect(getWithQuery(input, 'a, c[2]')).toEqual('1, 3');
    expect(getWithQuery(input, 'c[1], c[2]')).toEqual('2, 3');
    expect(getWithQuery(input, 'a, c')).toEqual('1, 1, 2, 3');
  });
  it('should can query with plain object', () => {
    const input = { c: [1, 2, 3], d: { a: 1 } };
    expect(getWithQuery(input, 'c, d')).toEqual('1, 2, 3, {"a":1}');
  });
  it('should can query with function', () => {
    const input = { c: [1, 2, 3], d: { a: 1 }, e: () => 1 };
    expect(getWithQuery(input, 'c, e')).toEqual('1, 2, 3, 1');
  });
});
