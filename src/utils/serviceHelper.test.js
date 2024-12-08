import { sanitizeService, serviceWrapper } from './serviceHelper';

// const getError = async (call) => {
//   try {
//     await call();

//     throw new NoErrorThrownError();
//   } catch (error) {
//     return error as TError;
//   }
// }

describe('serviceWrapper', () => {
  let caller = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    caller = jest.fn();
  });
  it('should return function', () => {
    expect(typeof serviceWrapper()).toBe('function');
  });
  it('returned function should return expected object', () => {
    const options = {
      name: 'usePatrolType',
    };
    expect(serviceWrapper(caller)(options)).toHaveProperty('options');
    expect(serviceWrapper(caller)(options)).toHaveProperty('caller');
    expect(serviceWrapper(caller)(options)).toHaveProperty('call');
  });
  it('should return caller result', () => {
    caller.mockReturnValue('expected');
    const options = {
      name: 'usePatrolType',
    };
    const result = serviceWrapper(caller)(options);
    expect(result.call()).toEqual('expected');
  });
});

describe('sanitizeService', () => {
  it('return function', () => {
    expect(typeof sanitizeService()).toBe('function');
  });
  describe('axios instance', () => {
    it(`can call with options`, async () => {
      const axiosInstance = jest.fn().mockReturnValue({});
      const options = {
        test: 'x',
      };

      await sanitizeService(axiosInstance)(options);

      expect(axiosInstance).toHaveBeenCalledWith(options);
    });

    const testCases = [
      {
        name: 'return nothing',
        axiosReturn: undefined,
        expected: {
          reject: undefined,
        },
      },
      {
        name: 'status !== 200',
        axiosReturn: { status: 500 },
        expected: {
          reject: { status: 500 },
        },
      },
      {
        name: 'status === 200',
        axiosReturn: { status: 200 },
        expected: {
          resolve: { status: 200 },
        },
      },
      {
        name: 'statusCode !== 200',
        axiosReturn: { statusCode: 500 },
        expected: {
          reject: { statusCode: 500 },
        },
      },
      {
        name: 'statusCode === 200',
        axiosReturn: { statusCode: 200 },
        expected: {
          resolve: { statusCode: 200 },
        },
      },
    ];

    testCases.forEach((testCase) => {
      if (testCase.expected.resolve) {
        it(`resolve when ${testCase.name}`, async () => {
          const axiosInstance = jest.fn().mockReturnValue(testCase.axiosReturn);
          const f = async () => await sanitizeService(axiosInstance)();

          await expect(f()).resolves.toEqual(testCase.expected.resolve);
          expect(axiosInstance).toHaveBeenCalled();
        });
        return;
      }
      it(`reject when ${testCase.name}`, async () => {
        const axiosInstance = jest.fn().mockReturnValue(testCase.axiosReturn);
        const f = async () => await sanitizeService(axiosInstance)();

        await expect(f()).rejects.toEqual(testCase.expected.reject);
        expect(axiosInstance).toHaveBeenCalled();
      });
    });
  });
});
