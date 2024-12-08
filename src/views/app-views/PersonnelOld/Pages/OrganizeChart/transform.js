import { renderPersonnelName } from 'utils/stringRender';

export function transform(raw) {
  if (!raw) {
    return {};
  }
  const { organization = {}, personnel = [] } = raw;

  const transformPersonnel = (item) => {
    const person = item.personnel_info[0];

    return {
      name: renderPersonnelName(person),
      attributes: { object_type: item.object_type, ...person },
      children: item.children?.map(transformPersonnel),
    };
  };

  return {
    name: organization.name,
    attributes: organization,
    children: personnel.map(transformPersonnel),
  };
}
