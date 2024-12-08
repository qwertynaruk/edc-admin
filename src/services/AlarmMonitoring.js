import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const asset = sanitizeService(fetch.alarm_monitoring);
const AlarmMonitoring = {
  getAlarmMonitoringList: async (
    options = {
      params: {
        page: 1,
        limit: 10,
      },
    }
  ) => {
    const { params, data } = options;
    return asset({
      headers: {
        accept: 'application/json',
        Authorization:
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJLd3ZQZ2VKai14WlMzVktWOVVKQzBoZFZlblVNZjIzakFNLU5ZQnlmUUFzIn0.eyJleHAiOjE3MTM5MzI4NjAsImlhdCI6MTcxMzkyOTI2MCwianRpIjoiNzA1MjQ2NDktNDQyMC00NTFjLWJjYjEtODU2Y2E0Nzg5NjQwIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrdGhlbWVlY3Nsb2FkYmFsYW5jZXItODkwMDk4MDM4LmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL3JlYWxtcy9hbmd0aG9uZyIsInN1YiI6IjliMWZiZmZmLTM3NzMtNDJiYS1hNTMyLTE2MmQzODgwOWZjYiIsInR5cCI6IkJlYXJlciIsImF6cCI6InRlc3QtMDEiLCJzZXNzaW9uX3N0YXRlIjoiZjgyYmUyMWYtYTM0NS00MzYxLTlkM2YtNDlkMGFmMTkxYzViIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbbnVsbCwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwic2NvcGUiOiIiLCJzaWQiOiJmODJiZTIxZi1hMzQ1LTQzNjEtOWQzZi00OWQwYWYxOTFjNWIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmFtaWx5IG5hbWUiOiJhbmd0aG9uZyIsImN1c3RvbTpvcmdhbmlzYXRpb24iOiJhbmd0aG9uZyIsImdyb3VwcyI6W10sImNvZ25pdG86dXNlcm5hbWUiOiI2NjI3NTQ4MzRhNWNkNDFhNjdjYTE2ZjAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI2NjI3NTQ4MzRhNWNkNDFhNjdjYTE2ZjAiLCJnaXZlbl9uYW1lIjoi4Liq4Lih4LiK4Liy4LiiIiwidG9rZW5fdHlwZSI6ImtleWNsb2FrIiwiY3VzdG9tOmRiX25hbWUiOiJhbmd0aG9uZyIsImlzX2NlbnRlciI6IlQiLCJkZXBhcnRtZW50X3BhdGgiOiJhbmd0aG9uZy9jZW50ZXIiLCJuYW1lIjoi4Liq4Lih4LiK4Liy4LiiIOC5g-C4iOC4lOC4tSIsImN1c3RvbTpyb2xlIjoicG9saWNlIiwiZW1haWwiOiI2NjI3NTQ4MzRhNWNkNDFhNjdjYTE2ZjBAdGVzdC5jb20ifQ.U903OcvpeaBDQyrxOVwcKrTm5TbqkeyanYkyrLsNXvORiNvl8xNw0efWKQRRzqwrdUwG0ITsg4DiyPJ_xxTw3qJiL-YPEH_L3yoryZkxUwTd6f5YIS2QH8OvnvTPNC00LUDcm07AguNmiafXv2L1n9s2xg3cYygzosQdL3CfOwRH44_K25BHT9plSOJ6SS0_8PEAfz3KThjjI2hq9V7gpJL5UVS5CotU2mikVboP7eoBpHFCdX4wfeDvYPlYWY9yCcz2N-onJ8m9GH5mTNBeYw9yilm42Us6bjs7xM_3PEcy99wNfXvChBZAAhn237q5io6IIw39S1vFgRsb4T3fGA',
      },
      method: 'get',
      url: '/alarm_monitoring/',
    });
  },

  getDetail: async (id) => {
    return asset({
      method: 'get',
      url: `/assets/${id}`,
    });
  },
};

export default AlarmMonitoring;
