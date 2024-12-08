import { transform } from './transform';

// _id: prefix r is relation, p is personnel
describe('transform', () => {
  it('return empty when recieve empty argument', () => {
    const got = transform();
    expect(got).toEqual({});
  });
  it('return organization as root', () => {
    const raw = [
      {
        organization: {
          _id: '1',
          name: 'root',
        },
        personnel: [],
      },
    ];

    const got = transform(raw);
    expect(got).toEqual({
      name: 'root',
      attributes: {
        _id: '1',
        name: 'root',
      },
      children: [],
    });
  });

  it('return name undefined when no organization provide', () => {
    const raw = [
      {
        personnel: [],
      },
    ];
    const got = transform(raw);
    expect(got).toEqual({
      name: undefined,
      attributes: {},
      children: [],
    });
  });

  it('return children even personnel not provide', () => {
    const raw = [{}];
    const got = transform(raw);
    expect(got).toEqual({
      name: undefined,
      attributes: {},
      children: [],
    });
  });

  describe('children', () => {
    it('have person', () => {
      const raw = [
        {
          organization: {
            _id: '1',
            name: 'root',
          },
          personnel: [
            {
              _id: '2',
              personnel_info: [
                {
                  _id: '3',
                  dominate_abbreviation: 'dom',
                  first_name: 'first',
                  last_name: 'last',
                },
              ],
            },
          ],
        },
      ];

      const got = transform(raw);
      expect(got).toEqual({
        name: 'root',
        attributes: {
          _id: '1',
          name: 'root',
        },
        children: [
          {
            name: 'dom first last',
            attributes: {
              _id: '3',
              dominate_abbreviation: 'dom',
              first_name: 'first',
              last_name: 'last',
            },
          },
        ],
      });
    });
    it('have person as children in person', () => {
      const raw = [
        {
          organization: {
            _id: 'r1',
            name: 'root',
          },
          personnel: [
            {
              _id: 'r2',
              personnel_info: [
                {
                  _id: 'p3',
                  dominate_abbreviation: 'dom',
                  first_name: 'first',
                  last_name: 'last',
                },
              ],
              children: [
                {
                  _id: 'r4',
                  personnel_info: [
                    {
                      _id: 'p5',
                      dominate_abbreviation: 'dom2',
                      first_name: 'first2',
                      last_name: 'last2',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const got = transform(raw);
      expect(got).toEqual({
        name: 'root',
        attributes: {
          _id: 'r1',
          name: 'root',
        },
        children: [
          {
            name: 'dom first last',
            attributes: {
              _id: 'p3',
              dominate_abbreviation: 'dom',
              first_name: 'first',
              last_name: 'last',
            },
            children: [
              {
                name: 'dom2 first2 last2',
                attributes: {
                  _id: 'p5',
                  dominate_abbreviation: 'dom2',
                  first_name: 'first2',
                  last_name: 'last2',
                },
              },
            ],
          },
        ],
      });
    });
    it('have object_type', () => {
      const raw = [
        {
          organization: {
            _id: '1',
            name: 'root',
          },
          personnel: [
            {
              _id: '2',
              object_type: 'personnel',
              personnel_info: [
                {
                  _id: '3',
                  dominate_abbreviation: 'dom',
                  first_name: 'first',
                  last_name: 'last',
                },
              ],
            },
          ],
        },
      ];

      const got = transform(raw);
      expect(got).toEqual({
        name: 'root',
        attributes: {
          _id: '1',
          name: 'root',
        },
        children: [
          {
            name: 'dom first last',
            attributes: {
              _id: '3',
              object_type: 'personnel',
              dominate_abbreviation: 'dom',
              first_name: 'first',
              last_name: 'last',
            },
          },
        ],
      });
    });
  });
});
