import { service } from 'axios/FetchPortal';

const PortalService = {};
const mockStore =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJlbnpiZW56OTAwQGdtYWlsLmNvbSIsImlhdCI6MTY1MTEzNjA1MSwiZXhwIjoxNjUxMTM3ODUxLCJ0ZW5hbnQiOiJ0aG9uZ2xvciIsIm9yZ2FuaXphdGlvbiI6Ii9wb2xpY2UvdGhvbmdsb3IifQ.1S7MKE1tno7bqBTMXG99eMXpt5GJ63NU6Vy56lQH6IM';

PortalService.createFormRequest = async (data, authId) => {
  return await service({
    method: 'post',
    url: `/request`,
    data: { data },
    headers: { Authorization: authId },
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.requestOTP = async (data) => {
  return await service({
    method: 'post',
    url: `/portal/send_email_otp`,
    data,
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.verifyOTP = async (data) => {
  return await service({
    method: 'post',
    url: `/portal/verify_email_otp`,
    data,
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.getWebForm = async (webformID) => {
  return await service({
    method: 'get',
    url: `/webform/${webformID}/client`,
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.getRequestPortal = async () => {
  const proms = await service({
    method: 'get',
    url: `/request/client`,
    headers: { Authorization: mockStore },
  });

  if (proms.statusCode !== 200) {
    return Promise.reject(proms);
  }

  return Promise.resolve(proms.body);
};

PortalService.getRequestPortalById = async (request_id) => {
  return await service({
    method: 'get',
    url: `/request/${request_id}/client`,
    headers: {
      Authorization: mockStore,
    },
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.getComment = async (request_id) => {
  return await service({
    method: 'get',
    url: `/request/comment?request_id=${request_id}`,
    headers: {
      Authorization: mockStore,
    },
  })
    .then((resp) => resp)
    .catch((err) => err);
};

PortalService.submitComment = async (data, request_id, ukey) => {
  return await service({
    method: 'post',
    url: `/request/${request_id}/activities/client?user_key=${ukey}`,
    data: { data },
    headers: {
      Authorization: mockStore,
    },
  })
    .then((resp) => resp)
    .catch((err) => err);
};

export default PortalService;
