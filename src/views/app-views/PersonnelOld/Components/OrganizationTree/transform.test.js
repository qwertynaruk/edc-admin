import React from 'react';
import { level1Raw, level2Raw, level3Raw } from './fixtures/transform';
import { fillDirectSubordinates, mapRawToTitle, toTreeData, transform } from './transform';

describe('fillDirectSubordinates', () => {
  it('not error when empty', () => {
    expect(() => fillDirectSubordinates()).not.toThrow();
  });
  it('not error when item not found direct_subordinates', () => {
    expect(() =>
      fillDirectSubordinates([
        {
          _id: '1',
          direct_subordinates: [{ _id: '2' }],
        },
      ])
    ).not.toThrow();
  });
  it('return same object when does not have direct_subordinates', () => {
    const got = fillDirectSubordinates(level1Raw);

    expect(got).toMatchObject(level1Raw);
  });
  it('return object with filled direct_subordinates', () => {
    const got = fillDirectSubordinates(level2Raw);

    expect(got[0].direct_subordinates[0]).toMatchObject(level2Raw[1]);
  });
  it('recursive', () => {
    const got = fillDirectSubordinates(level3Raw);

    expect(got[0].direct_subordinates[0].direct_subordinates[0]).toMatchObject(level3Raw[2]);
  });
});

describe('transform', () => {
  it('return empty array when pass falsy value', () => {
    expect(transform()).toEqual([]);
  });

  it('should not error when pass only level 1', () => {
    const got = transform({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 0,
        indirect_subordinate_count: 0,
        total_subordinate_count: 0,
      },
      managers: [],
      children: [],
    });

    expect(got).toStrictEqual([
      {
        title: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
        key: '6397ec127fea1bac082be3f0',
      },
    ]);
  });

  describe('additional data', () => {
    it('managers', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
        children: [],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          key: '6397ec127fea1bac082be3f0',
        },
      ]);
    });
    it('children', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
        managers: [],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          key: '6397ec127fea1bac082be3f0',
        },
      ]);
    });
    it('missing all', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          key: '6397ec127fea1bac082be3f0',
        },
      ]);
    });
  });

  describe('have children', () => {
    it('one child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 1,
          indirect_subordinate_count: 0,
          total_subordinate_count: 1,
        },
        managers: [],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 0,
            total_subordinate_count: 1,
          },
          key: '6397ec127fea1bac082be3f0',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f1',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f1',
            },
          ],
        },
      ]);
    });
    it('two child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 2,
          indirect_subordinate_count: 0,
          total_subordinate_count: 2,
        },
        managers: [],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 2,
            indirect_subordinate_count: 0,
            total_subordinate_count: 2,
          },
          key: '6397ec127fea1bac082be3f0',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f1',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f1',
            },
            {
              title: {
                _id: '6397ec127fea1bac082be3f2',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f2',
            },
          ],
        },
      ]);
    });
    it('three child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 3,
          indirect_subordinate_count: 0,
          total_subordinate_count: 3,
        },
        managers: [],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          {
            _id: '6397ec127fea1bac082be3f3',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f0',
            direct_subordinate_count: 3,
            indirect_subordinate_count: 0,
            total_subordinate_count: 3,
          },
          key: '6397ec127fea1bac082be3f0',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f1',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f1',
            },
            {
              title: {
                _id: '6397ec127fea1bac082be3f2',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f2',
            },
            {
              title: {
                _id: '6397ec127fea1bac082be3f3',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f3',
            },
          ],
        },
      ]);
    });
  });

  describe('have managers', () => {
    it('one manager', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
        managers: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 0,
            total_subordinate_count: 1,
          },
        ],
        children: [],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 0,
            total_subordinate_count: 1,
          },
          key: '6397ec127fea1bac082be3f1',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f0',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f0',
            },
          ],
        },
      ]);
    });

    it('two manager', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
        managers: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 0,
            total_subordinate_count: 1,
          },
        ],
        children: [],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
          key: '6397ec127fea1bac082be3f1',
        },
        {
          title: {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 0,
            total_subordinate_count: 1,
          },
          key: '6397ec127fea1bac082be3f2',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f0',
                direct_subordinate_count: 0,
                indirect_subordinate_count: 0,
                total_subordinate_count: 0,
              },
              key: '6397ec127fea1bac082be3f0',
            },
          ],
        },
      ]);
    });
  });

  describe('have managers and children', () => {
    it('one manager and one child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 1,
          indirect_subordinate_count: 0,
          total_subordinate_count: 1,
        },
        managers: [
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
        ],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
          key: '6397ec127fea1bac082be3f2',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f0',
                direct_subordinate_count: 1,
                indirect_subordinate_count: 0,
                total_subordinate_count: 1,
              },
              key: '6397ec127fea1bac082be3f0',
              children: [
                {
                  title: {
                    _id: '6397ec127fea1bac082be3f1',
                    direct_subordinate_count: 0,
                    indirect_subordinate_count: 0,
                    total_subordinate_count: 0,
                  },
                  key: '6397ec127fea1bac082be3f1',
                },
              ],
            },
          ],
        },
      ]);
    });
    it('two manager and one child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 1,
          indirect_subordinate_count: 0,
          total_subordinate_count: 1,
        },
        managers: [
          {
            _id: '6397ec127fea1bac082be3f3',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 2,
            total_subordinate_count: 3,
          },
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
        ],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f3',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 2,
            total_subordinate_count: 3,
          },
          key: '6397ec127fea1bac082be3f3',
        },
        {
          title: {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
          key: '6397ec127fea1bac082be3f2',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f0',
                direct_subordinate_count: 1,
                indirect_subordinate_count: 0,
                total_subordinate_count: 1,
              },
              key: '6397ec127fea1bac082be3f0',
              children: [
                {
                  title: {
                    _id: '6397ec127fea1bac082be3f1',
                    direct_subordinate_count: 0,
                    indirect_subordinate_count: 0,
                    total_subordinate_count: 0,
                  },
                  key: '6397ec127fea1bac082be3f1',
                },
              ],
            },
          ],
        },
      ]);
    });
    it('two manager and two child', () => {
      const got = transform({
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 1,
          indirect_subordinate_count: 0,
          total_subordinate_count: 1,
        },
        managers: [
          {
            _id: '6397ec127fea1bac082be3f3',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 2,
            total_subordinate_count: 3,
          },
          {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
        ],
        children: [
          {
            _id: '6397ec127fea1bac082be3f1',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
          {
            _id: '6397ec127fea1bac082be3f4',
            direct_subordinate_count: 0,
            indirect_subordinate_count: 0,
            total_subordinate_count: 0,
          },
        ],
      });

      expect(got).toStrictEqual([
        {
          title: {
            _id: '6397ec127fea1bac082be3f3',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 2,
            total_subordinate_count: 3,
          },
          key: '6397ec127fea1bac082be3f3',
        },
        {
          title: {
            _id: '6397ec127fea1bac082be3f2',
            direct_subordinate_count: 1,
            indirect_subordinate_count: 1,
            total_subordinate_count: 2,
          },
          key: '6397ec127fea1bac082be3f2',
          children: [
            {
              title: {
                _id: '6397ec127fea1bac082be3f0',
                direct_subordinate_count: 1,
                indirect_subordinate_count: 0,
                total_subordinate_count: 1,
              },
              key: '6397ec127fea1bac082be3f0',
              children: [
                {
                  title: {
                    _id: '6397ec127fea1bac082be3f1',
                    direct_subordinate_count: 0,
                    indirect_subordinate_count: 0,
                    total_subordinate_count: 0,
                  },
                  key: '6397ec127fea1bac082be3f1',
                },
                {
                  title: {
                    _id: '6397ec127fea1bac082be3f4',
                    direct_subordinate_count: 0,
                    indirect_subordinate_count: 0,
                    total_subordinate_count: 0,
                  },
                  key: '6397ec127fea1bac082be3f4',
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});

describe('mapRawToTitle', () => {
  it('not error when empty', () => {
    expect(() => mapRawToTitle()).not.toThrow();
  });
  it('not error when does not have personnel_info', () => {
    expect(() => mapRawToTitle({})).not.toThrow();
  });
  it('has all person info', () => {
    const got = mapRawToTitle(level2Raw[0]);

    expect(got).toMatchObject(level2Raw[0].personnel_info[0]);
  });
  it('has subordinate count', () => {
    const got = mapRawToTitle(level2Raw[0]);

    expect(got).toMatchObject({
      direct_subordinate_count: level2Raw[0].direct_subordinate_count,
      indirect_subordinate_count: level2Raw[0].indirect_subordinate_count,
      total_subordinate_count: level2Raw[0].total_subordinate_count,
    });
  });
});

describe('toTreeData', () => {
  it('has title as React.Component', () => {
    const got = toTreeData({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 0,
        indirect_subordinate_count: 0,
        total_subordinate_count: 0,
      },
      managers: [],
      children: [],
    });

    expect(React.isValidElement(got[0].title)).toBe(true);
  });
  it('transform children to React.Component too', () => {
    const got = toTreeData({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 1,
        indirect_subordinate_count: 0,
        total_subordinate_count: 1,
      },
      managers: [],
      children: [
        {
          _id: '6397ec127fea1bac082be3f1',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      ],
    });
    expect(React.isValidElement(got[0].children[0].title)).toBe(true);
  });
  it('pass person prop with person data', () => {
    const got = toTreeData({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 1,
        indirect_subordinate_count: 0,
        total_subordinate_count: 1,
      },
      managers: [],
      children: [
        {
          _id: '6397ec127fea1bac082be3f1',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      ],
    });

    expect(got[0].title.props.person).toMatchObject({
      _id: '6397ec127fea1bac082be3f0',
      direct_subordinate_count: 1,
      indirect_subordinate_count: 0,
      total_subordinate_count: 1,
    });
    expect(got[0].children[0].title.props.person).toMatchObject({
      _id: '6397ec127fea1bac082be3f1',
      direct_subordinate_count: 0,
      indirect_subordinate_count: 0,
      total_subordinate_count: 0,
    });
  });

  it('not error when does not have children', () => {
    expect(() => toTreeData({})).not.toThrow();
  });

  it('has props isLeaf = false flag if it has only one element', () => {
    const got = toTreeData({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 0,
        indirect_subordinate_count: 0,
        total_subordinate_count: 0,
      },
      managers: [],
      children: [],
    });

    expect(got).toHaveProperty('0.isLeaf', false);
  });

  it('can dynamic change current that match _id', () => {
    const got = toTreeData(
      {
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      },
      { _id: '6397ec127fea1bac082be3f0' }
    );

    expect(got).toHaveProperty('0.title.props.person._id', '6397ec127fea1bac082be3f0');
  });

  it('has pass active=true props when match current._id', () => {
    const got = toTreeData(
      {
        self: {
          _id: '6397ec127fea1bac082be3f0',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      },
      { _id: '6397ec127fea1bac082be3f0' }
    );

    expect(got).toHaveProperty('0.title.props.active', true);
  });
  it('return current if data parameter is missing', () => {
    const got = toTreeData(null, { _id: '1' });

    expect(got).toHaveProperty('0.title.props.active', true);
  });
  it('has all level', () => {
    const got = toTreeData({
      self: {
        _id: '6397ec127fea1bac082be3f0',
        direct_subordinate_count: 1,
        indirect_subordinate_count: 0,
        total_subordinate_count: 1,
      },
      managers: [
        {
          _id: '6397ec127fea1bac082be3f2',
          direct_subordinate_count: 1,
          indirect_subordinate_count: 1,
          total_subordinate_count: 2,
        },
      ],
      children: [
        {
          _id: '6397ec127fea1bac082be3f1',
          direct_subordinate_count: 0,
          indirect_subordinate_count: 0,
          total_subordinate_count: 0,
        },
      ],
    });
    expect(got).toMatchObject([
      {
        key: '6397ec127fea1bac082be3f2',
        children: [
          {
            key: '6397ec127fea1bac082be3f0',
            children: [{ key: '6397ec127fea1bac082be3f1' }],
          },
        ],
      },
    ]);
  });
});
