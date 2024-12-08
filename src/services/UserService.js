import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const systemAdmin = sanitizeService(fetchMaster.system_admin);
const authentication = sanitizeService(fetchMaster.authentication);
const personnel = sanitizeService(fetchMaster.personnel);
const signUp = sanitizeService(fetchMaster.signUp);

const UserService = {
  get_users: async (
    params = {
      page: 1,
      limit: 100,
    }
  ) => {
    return systemAdmin({
      method: 'get',
      url: '/users',
      params,
    });
  },
  forgetPassword: async (data) => {
    return authentication({
      method: 'POST',
      url: '/forget_password',
      data,
    });
  },
  verifyForgetPassword: async (data) => {
    return authentication({
      method: 'POST',
      url: '/verify_forget_password',
      data,
    });
  },
  signIn: async (data) => {
    const payload = {
      cookie_session_id: 'admin',
      ...data,
    };

    return authentication({
      method: 'POST',
      url: '/login',
      data: payload,
    });
  },
  signOut: async (data) => {
    return signUp({
      method: 'POST',
      url: '/logout_police',
      data,
    });
  },
  refreshToken: async (data) => {
    return authentication({
      method: 'POST',
      url: '/refresh_token',
      data,
    });
  },
  refreshQueueToken: async (data) => {
    return authentication({
      method: 'POST',
      url: '/queue_system/refresh_token',
      data,
    });
  },
  create: async (data) => {
    return signUp({
      method: 'POST',
      url: '/sign_up_police',
      data,
    });
  },
  update: async (id, body) => {
    return systemAdmin({
      method: 'PUT',
      url: '/users',
      params: {
        _id: id,
      },
      data: body,
    });
  },
  get_user: async (id) => {
    return personnel({
      method: 'GET',
      url: `/personnel/${id}`,
    });
  },
  create_role: async (data) => {
    return systemAdmin({
      method: 'POST',
      url: '/roles',
      data,
    });
  },
  get_roles: async (data) => {
    return systemAdmin({
      method: 'GET',
      url: '/roles',
      data,
    });
  },
  reset_password_police: async (options = {}) => {
    return signUp({
      method: 'POST',
      url: '/reset_password_police',
      ...options,
    });
  },
  reset_password_police_no_header: async (options = {}) => {
    return authentication({
      method: 'POST',
      url: '/reset_password_police',
      ...options,
    });
  },
  change_password_police: async (options = {}) => {
    return signUp({
      method: 'POST',
      url: '/change_password_police',
      ...options,
    });
  },
};

export default UserService;
