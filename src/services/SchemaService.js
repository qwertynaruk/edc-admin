import fetch from 'auth/FetchInterceptor';

const SchemaService = {};

SchemaService.get_schema = function (data) {
  return fetch({
    url: '/schema',
    method: 'get',
    //     headers: {
    //     'public-request': 'true'
    // },
    data,
  });
};
SchemaService.get_schema_damage = function (data) {
  return fetch({
    url: '/schema/damage-object',
    method: 'get',
    //     headers: {
    //     'public-request': 'true'
    // },
    data,
  });
};
SchemaService.get_schema_progress = function (data) {
  return fetch({
    url: '/schema/progress-object',
    method: 'get',
    //     headers: {
    //     'public-request': 'true'
    // },
    data,
  });
};
SchemaService.get_schema_police_department = function (data) {
  return fetch({
    url: '/schema/police-department',
    method: 'get',
    //     headers: {
    //     'public-request': 'true'
    // },
    data,
  });
};
SchemaService.put_schema_case_type = function (data) {
  return fetch({
    url: '/schema/case-type',
    method: 'put',
    data,
  });
};
SchemaService.put_schema_damage_object = function (data) {
  return fetch({
    url: '/schema/damage-object',
    method: 'put',
    data,
  });
};
SchemaService.put_schema_location_zone = function (data) {
  return fetch({
    url: '/schema/location-zone',
    method: 'put',
    data,
  });
};
SchemaService.put_schema_police_department = function (data) {
  return fetch({
    url: '/schema/police-department',
    method: 'put',
    data,
  });
};

// CaseService.get_case_list = function (data) {
// 	return fetch({
// 		url: '/auth/signup',
// 		method: 'post',
// 		headers: {
//       'public-request': 'true'
//     },
// 		data: data
// 	})
// }

export default SchemaService;
