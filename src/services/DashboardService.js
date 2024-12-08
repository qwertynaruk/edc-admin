import fetch from 'auth/FetchInterceptor';

const DashboardService = {};

DashboardService.get_dashboard_list = function (data) {
  return fetch({
    url: '/dashboard',
    method: 'get',
    data,
  });
};
DashboardService.get_dashboardbyid = function (id) {
  return fetch({
    url: '/dashboard/' + id,
    method: 'get',
  });
};

export default DashboardService;
