import useService, { getOptions, getSWRKey } from './useService';
import mockUseSWR from 'swr';
import { serviceWrapper } from 'utils/serviceHelper';
import { renderHook } from '@testing-library/react';
import { MAX_API_LIMIT } from 'constants/ApiConstant';

jest.mock('swr');

describe('useService', () => {
  let mutate = jest.fn();

  let caller = jest.fn();

  let mockService = {};

  const expectedSuccessResultData = {
    data: 'expected',
    countAll: 123,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mutate = jest.fn();
    caller = jest.fn();
    mockService = serviceWrapper(caller)({
      method: 'get',
      url: '/mock',
      params: {
        limit: MAX_API_LIMIT,
      },
      data: {
        data: 'a',
      },
    });
    mockUseSWR
      .mockImplementationOnce((key, fetcher) => {
        if (key && fetcher) fetcher(key);
        return {
          data: undefined,
          error: null,
          mutate,
        };
      })
      .mockImplementation((key, fetcher) => {
        if (key && fetcher) fetcher(key);
        return {
          data: expectedSuccessResultData,
          error: null,
          mutate,
        };
      });
  });
  it('call useSWR', () => {
    renderHook(() => useService());
    expect(mockUseSWR).toHaveBeenCalled();
  });
  it('have mutate function property', () => {
    const { result } = renderHook(() => useService());
    expect(result.current).toHaveProperty('mutate');
    expect(typeof result.current.mutate).toBe('function');
  });
  it('return raw, data', () => {
    const { result, rerender } = renderHook(() => useService());
    expect(result.current).toHaveProperty('raw');
    expect(result.current).toHaveProperty('data');
    expect(result.current.raw).not.toEqual(expectedSuccessResultData);
    expect(result.current.data).not.toEqual(expectedSuccessResultData.data);
    rerender();
    expect(result.current.raw).toEqual(expectedSuccessResultData);
    expect(result.current.data).toEqual(expectedSuccessResultData.data);
    expect(mockUseSWR).toHaveBeenCalledTimes(2);
  });

  describe.skip('(_, options)', () => {
    it('not call fetcher if options is function and return falsy', () => {
      renderHook(() => useService(mockService, () => false));
      expect(caller).not.toHaveBeenCalled();
    });
    it('not return loading forever when options is function and return falsy', () => {
      const { result, rerender } = renderHook(() => useService(mockService, () => false));
      expect(result.current.loading).toBe(false);
      rerender();
      expect(result.current.loading).toBe(false);
    });
    it('can pass options as second parameter', () => {
      const options = {
        mock: 'mock',
      };
      renderHook(() => useService(null, options));
      expect(mockUseSWR).toHaveBeenCalledWith(options, undefined);
    });
    it('merge options to service', () => {
      const options = {
        mock: 'mock',
      };
      const expected = {
        ...mockService.options,
        ...options,
      };
      renderHook(() => useService(mockService, options));
      expect(mockUseSWR).toHaveBeenCalledWith(expected, caller);
    });
    it('can use String', () => {
      renderHook(() => useService(serviceWrapper(caller), 'test'));
      expect(caller).toHaveBeenCalledWith('test');
    });
  });

  describe('second call', () => {
    beforeEach(() => {
      mockUseSWR();
    });
    it('call useSWR with service and fetcher function', () => {
      renderHook(() => useService(mockService));
      expect(mockUseSWR).toHaveBeenCalledWith(mockService.options, caller);
    });
    it('auto serialize data', () => {
      const { result } = renderHook(() => useService(mockService));
      expect(result.current.data).toEqual(expectedSuccessResultData.data);
    });
    it('call passed caller function', () => {
      renderHook(() => useService(mockService));
      expect(caller).toHaveBeenCalled();
    });
  });

  describe('when pass the function parameter', () => {
    it('call passed function to get the object', () => {
      renderHook(() => useService(() => mockService));
      expect(mockUseSWR).toHaveBeenCalledWith(mockService.options, caller);
    });
  });
});

describe('getOptions', () => {
  it('return empty object if not pass parameter', () => {
    expect(typeof getOptions()).toBe('function');
  });
  it('return empty object if pass empty object', () => {
    expect(getOptions({})).toEqual({});
  });
  it('return call the argument if it function', () => {
    const expected = { test: 'value' };
    const mock = jest.fn().mockImplementation(() => expected);

    const got = getOptions(mock);

    expect(mock).toHaveBeenCalled();
    expect(got).toStrictEqual(expected);
  });
});

describe('getSWRKey(options, serviceOptions)', () => {
  const testCases = [
    {
      name: 'have no options and no serviceOptions',
      options: null,
      serviceOptions: null,
      expected: null,
    },
    {
      name: 'have empty object options and no serviceOptions',
      options: {},
      serviceOptions: null,
      expected: {},
    },
    {
      name: 'have no options and empty object serviceOptions',
      options: null,
      serviceOptions: {},
      expected: {},
    },
    {
      name: 'have options and no serviceOptions',
      options: { test: 'test' },
      serviceOptions: null,
      expected: { test: 'test' },
    },
    {
      name: 'have no options and serviceOptions',
      options: null,
      serviceOptions: { test2: 'value2' },
      expected: { test2: 'value2' },
    },
    {
      name: 'have options and serviceOptions',
      options: { test: 'value' },
      serviceOptions: { test2: 'value2' },
      expected: { test: 'value', test2: 'value2' },
    },
    {
      name: 'have string options and no serviceOptions',
      options: 'test',
      serviceOptions: null,
      expected: 'test',
    },
    {
      name: 'have no options and string serviceOptions',
      options: null,
      serviceOptions: 'test2',
      expected: 'test2',
    },
    {
      name: 'have string options and string serviceOptions',
      options: 'test',
      serviceOptions: 'test2',
      expected: 'testtest2',
    },
    {
      name: 'have int options and no serviceOptions',
      options: 1,
      serviceOptions: null,
      expected: '1',
    },
    {
      name: 'have no options and int serviceOptions',
      options: null,
      serviceOptions: 2,
      expected: '2',
    },
    {
      name: 'have int options and int serviceOptions',
      options: 1,
      serviceOptions: 2,
      expected: '12',
    },
    {
      name: 'have float options and int serviceOptions',
      options: 1.1,
      serviceOptions: 2,
      expected: '1.12',
    },
    {
      name: 'have float options and string serviceOptions',
      options: 1.1,
      serviceOptions: '2',
      expected: '1.12',
    },
    {
      name: 'have string options and object serviceOptions',
      options: 'test',
      serviceOptions: { test2: 'value2' },
      expected: 'test{"test2":"value2"}',
    },
    {
      name: 'have string options and object serviceOptions',
      options: 'test',
      serviceOptions: { test2: 'value2' },
      expected: 'test{"test2":"value2"}',
    },
    {
      name: 'have object options and string serviceOptions',
      options: { test: 'value' },
      serviceOptions: 'test2',
      expected: '{"test":"value"}test2',
    },
    {
      name: 'have function of options that return string and no serviceOptions',
      options: () => 'test',
      serviceOptions: null,
      expected: 'test',
    },
    {
      name: 'have no options and function of serviceOptions that return string',
      options: null,
      serviceOptions: () => 'test2',
      expected: 'test2',
    },
    {
      name: 'have function of options that return string and function of serviceOptions that return string',
      options: () => 'test',
      serviceOptions: () => 'test2',
      expected: 'testtest2',
    },
    {
      name: 'have function of options that return object and no serviceOptions',
      options: () => ({ test: 'value' }),
      serviceOptions: null,
      expected: { test: 'value' },
    },
    {
      name: 'have no options and function of serviceOptions that return object',
      options: null,
      serviceOptions: () => ({ test2: 'test2' }),
      expected: { test2: 'test2' },
    },
    {
      name: 'have function of options that return object and function of serviceOptions that return object',
      options: () => ({ test: 'value' }),
      serviceOptions: () => ({ test2: 'test2' }),
      expected: { test: 'value', test2: 'test2' },
    },
    {
      name: 'have function of options that return object and function of serviceOptions that return string',
      options: () => ({ test: 'value' }),
      serviceOptions: () => 'test2',
      expected: '{"test":"value"}test2',
    },
  ];
  testCases.forEach((testCase) => {
    it(`${testCase.name}`, () => {
      expect(getSWRKey(testCase.options, testCase.serviceOptions)).toStrictEqual(testCase.expected);
    });
  });
});
