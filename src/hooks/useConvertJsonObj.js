export const useConvertJsonObj = () => {
  const convertNow = (data, key = 'name_th') => {
    const clone_data = { ...data };
    const array_to_obj = Object.entries(clone_data);
    const result_convert = array_to_obj.map((item_list) => {
      return item_list.map((sub_item_list, index) => {
        if (index % 2 !== 0) {
          //   if (
          //     typeof sub_item_list === "number" ||
          //     typeof sub_item_list === "boolean"
          //   )
          //     return sub_item_list;
          //   if (!sub_item_list || sub_item_list === null) return null;
          // เช็คว่าเป็น Array ไหม
          if (Array.isArray(sub_item_list || '')) {
            return sub_item_list.map((obj) => {
              // เช็คว่าข้อมูลเป็น Object ไหม
              if (typeof obj !== 'object') return obj; // ไม่ใช่ให้ return ออกไปเลย
              return convertNow(obj);
            });
          }
          if (typeof sub_item_list === 'string') {
            try {
              const respConvert = JSON.parse(sub_item_list)[key];
              if (Object.keys(respConvert || []).length > 0) {
                return respConvert;
              }
              return sub_item_list;
            } catch (e) {
              return sub_item_list;
            }
          }
          if (typeof sub_item_list === 'object' && sub_item_list !== null) {
            return convertNow(sub_item_list);
          }
          return sub_item_list;
        }
        return sub_item_list;
      });
    });
    return convertArrayToObj(result_convert);
  };
  const convertArrayToObj = (result_convert = []) => {
    return result_convert.reduce((accum, [k, v]) => {
      accum[k] = v;
      return accum;
    }, {});
  };
  return { convertNow, convertArrayToObj };
};
