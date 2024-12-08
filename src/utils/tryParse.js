export const tryParse = (json) => {
  if (typeof json === 'undefined') {
    return { status: false };
  }
  if (typeof json !== 'string') {
    return {
      status: true,
      data: json,
    };
  }
  try {
    const data = JSON.parse(json);
    return {
      status: true,
      data,
    };
  } catch {
    return {
      status: false,
    };
  }
};
export default tryParse;
