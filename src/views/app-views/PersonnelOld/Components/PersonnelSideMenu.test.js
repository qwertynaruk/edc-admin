import { getDepartments } from './PersonnelSideMenu';

describe('getDepartments', () => {
  it('will merge department and subDepartment', () => {
    const json1 = [{ id: 1, root: [{ id: 2 }, { id: 3 }] }];
    const json2 = [
      { id: 2, children: [{ id: 4 }] },
      { id: 3, children: [{ id: 5 }] },
    ];

    const result = getDepartments(json1, json2);

    expect(result).toEqual([
      {
        id: 1,
        children: [
          { id: 2, children: [{ id: 4 }] },
          { id: 3, children: [{ id: 5 }] },
        ],
      },
    ]);
  });
  it('will merge random id department and subDepartment', () => {
    const json1 = [{ id: 1, root: [{ id: 3 }, { id: 2 }] }];
    const json2 = [
      { id: 3, children: [{ id: 5 }] },
      { id: 2, children: [{ id: 4 }] },
    ];

    const result = getDepartments(json1, json2);

    expect(result).toEqual([
      {
        id: 1,
        children: [
          { id: 3, children: [{ id: 5 }] },
          { id: 2, children: [{ id: 4 }] },
        ],
      },
    ]);
  });
  it('will go deeper with random id department and subDepartment', () => {
    const json1 = [{ id: 1, root: [{ id: 3 }, { id: 2 }] }];
    const json2 = [
      { id: 3, children: [{ id: 5 }] },
      { id: 2, children: [{ id: 4 }] },
    ];

    const result = getDepartments(json1, json2);

    expect(result).toEqual([
      {
        id: 1,
        children: [
          { id: 3, children: [{ id: 5 }] },
          { id: 2, children: [{ id: 4 }] },
        ],
      },
    ]);
  });
});
