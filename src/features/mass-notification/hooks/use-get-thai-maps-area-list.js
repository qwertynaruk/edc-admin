import UserStore from 'mobx/UserStore';
import { appApiSystemAdmin } from 'constants/ApiConstant';
import axios from 'axios';
import { massNotiKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetThaiMapsAreaLists(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.mapsArea(props?.queryParams).queryKey,
    enabled: !!user,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/responsible_area`,
        params: props?.queryParams,
      }),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}

export function useGetGeographiesPolygon(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.geoGraphies(props?.queryParams).queryKey,
    enabled: !!user,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/geographies/with_array`,
        params: props?.queryParams?.data,
      }),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
export function useGetProvincesPolygonJson(props) {
  const { user } = UserStore;

  const queryRequest = useQuery({
    queryKey: ['provinces-polygon'],
    enabled: !!user,
    gcTime: 'Infinity',
    queryFn: async () => await axios.get(process.env.REACT_APP_PROVINCES_POLYGON),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });
  return queryRequest;
}
export function useGetDistrictPolygonJson(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: ['district-polygon'],
    enabled: !!user,
    gcTime: 'Infinity',
    queryFn: async () => await axios.get(process.env.REACT_APP_DISTRICT_POLYGON),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });
  return queryRequest;
}
export function useGetSubdistrictPolygonJson(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: ['subdistrict-polygon'],
    enabled: !!user,
    gcTime: 'Infinity',
    queryFn: async () => await axios.get(process.env.REACT_APP_SUBDISTRICT_POLYGON),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });
  return queryRequest;
}
export function useGetPolygonOrg(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.mapPolygon(props?.queryParams).queryKey,
    enabled: !!user,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/responsible_area/${props?.queryParams?.orgId}`,
      }),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
