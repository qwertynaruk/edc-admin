const dev = {
  API_ENDPOINT_URL: 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1',
  INCIDENT_URL: 'https://dev.incident.udoncop.com',
};

const prod = {
  API_ENDPOINT_URL: 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1',
  INCIDENT_URL: 'https://incident.udoncop.com',
};

const stg = {
  API_ENDPOINT_URL: 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1',
  INCIDENT_URL: 'https://stg.incident.udoncop.com',
};

const test = {
  API_ENDPOINT_URL: 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1',
  INCIDENT_URL: 'https://test.incident.udoncop.com',
};

export function getEnv() {
  switch (process.env.REACT_APP_SERV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    case 'staging':
      return stg;
    case 'test':
      return test;
    default:
      return dev;
  }
}
