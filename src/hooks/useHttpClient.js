import { identity, omit, pickBy } from 'lodash';

import UseIgnoreUndefinedObject from './useIgnoreUndefinedObject';
import axios from 'axios';

export default function useHttpClient() {
  const { remove } = UseIgnoreUndefinedObject();
  const getParse = localStorage.getItem('user-store') || null;
  const { accessAuthen = {} } = JSON.parse(getParse);

  const https = (em) => {
    if (!em?.statusCode || em?.statusCode !== 200) {
      return Promise.reject(em?.message || 400);
    }

    return Promise.resolve(em);
  };

  const headers = {
    Authorization: accessAuthen.access_token,
    'Content-Type': 'application/json',
  };

  const urls = (url, params = null) => {
    const hostname =
      process.env.REACT_APP_SERV === 'development' ? 'https://api-edc.onelife.oneforce.ai' : 'https://api.oneforce.ai';
    // let endpoints = process.env.REACT_APP_API_HOSTNAME + url;
    let endpoints = url.startsWith('*') ? url.replace('*', '') : hostname + url;
    if (params) {
      const prs = pickBy(params, identity);
      const queryParams = new URLSearchParams(prs).toString();
      endpoints = endpoints + `?${queryParams}`;
    }
    return endpoints;
  };

  const bodies = (payload) => JSON.stringify(remove(payload));

  const get = async (options) => {
    const fn = await fetch(urls(options.url, options?.params), {
      headers,
      method: 'GET',
      ...omit(options, ['url']),
    }).then((res) => res.json());

    return https(fn);
  };

  const postPut = async (options, methods) => {
    const fn = await fetch(urls(options.url, options?.params), {
      headers,
      method: methods,
      body: bodies(options.payload),
    }).then((res) => res.json());

    return https(fn);
  };

  const deletes = async (options) => {
    const fn = await fetch(urls(options.url, options?.params), {
      headers,
      method: 'DELETE',
    }).then((res) => res.json());

    return https(fn);
  };

  const directive = async (props) => {
    const options = {
      ...props,
      data: props?.body || {},
    };

    const response = await axios(options);
    return response.data;
  };

  return {
    get,
    post: (options) => postPut(options, 'POST'),
    put: (options) => postPut(options, 'PUT'),
    deletes: (options) => deletes(options),
    directive,
    token: accessAuthen?.access_token || undefined,
    userId: accessAuthen?.auth_id || undefined,
  };
}
