export default function UseIgnoreUndefinedObject() {
  const isObject = (obj) => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  };

  const isEmptyObject = (obj) => {
    return typeof obj === 'object' && obj !== null && !Object.keys(obj).length;
  };

  const stripEmptyObjects = (obj) => {
    const cleanObj = obj;

    if (!isObject(obj) && !Array.isArray(cleanObj)) {
      return cleanObj;
    } else if (obj === null) {
      return undefined;
    }

    if (!Array.isArray(cleanObj)) {
      Object.keys(cleanObj).forEach((key) => {
        let value = cleanObj[key];
        if (typeof value === 'object' && value !== null) {
          value = stripEmptyObjects(value);

          if (isEmptyObject(value)) {
            delete cleanObj[key];
          } else {
            cleanObj[key] = value;
          }
        } else if (value === null || value === '') {
          delete cleanObj[key];
        }
      });

      return cleanObj;
    }

    cleanObj.forEach((o, idx) => {
      let value = o;
      if (typeof value === 'object' && value !== null) {
        value = stripEmptyObjects(value);

        if (isEmptyObject(value)) {
          delete cleanObj[idx];
        } else {
          cleanObj[idx] = value;
        }
      } else if (value === null) {
        delete cleanObj[idx];
      }
    });

    return cleanObj.filter((el) => el !== undefined);
  };

  const remove = (obj) => {
    if (obj === undefined) {
      return undefined;
    }

    let withoutUndefined = JSON.parse(JSON.stringify(obj));

    withoutUndefined = stripEmptyObjects(withoutUndefined);

    if (isEmptyObject(withoutUndefined)) return undefined;

    return withoutUndefined;
  };

  return {
    remove,
  };
}
