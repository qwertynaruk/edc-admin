import fetch from 'auth/FetchInterceptor';

const JwtAuthService = {};

JwtAuthService.Forgot_Password = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user/password',
    method: 'post',
    data,
  });
};
JwtAuthService.Confirm_New_Password = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user/password',
    method: 'put',
    data,
  });
};
JwtAuthService.Reset_Password = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user/admin/password',
    method: 'put',
    data,
  });
};

JwtAuthService.Get_User_Info = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user',
    method: 'get',
    params: { access_token: data },
  });
};
JwtAuthService.Update_User_Info = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user',
    method: 'put',
    data,
  });
};
JwtAuthService.Refresh_Token = function (data) {
  // return {id:'test'}
  return fetch({
    url: '/user/token',
    method: 'put',
    data,
  });
};

JwtAuthService.password_verify = function async(data) {
  return fetch({
    url: '/user/token/verify',
    method: 'post',
    data,
  });
};

JwtAuthService.login = function async(data) {
  // return {id:'test'}
  // return Promise.resolve(FIDO(data))
  // .then((newCredentialInfo) => {
  // 	console.log('1')
  // 	newCredentialInfo = publicKeyCredentialToJSON(newCredentialInfo)
  // 	makeCredentialResponse(newCredentialInfo)
  // 	.then((serverResponse) => {
  // 		console.log('2')
  // 		if(serverResponse.status !== 'ok')
  // 			throw new Error('Error registering user! Server returned: ' + serverResponse.errorMessage);

  return fetch({
    url: '/login',
    method: 'post',
    data,
  });
  // 	})
  // 	.catch((error) => {
  // 		console.log('3')
  // 		return {}
  // 	})
  // })
  // .catch((error) => {
  // 	console.log('4')
  // 	return {}
  // })
};

JwtAuthService.signUp = function (data) {
  return fetch({
    url: '/auth/signup',
    method: 'post',
    // 	headers: {
    //   'public-request': 'true'
    // },
    data,
  });
};

export default JwtAuthService;
