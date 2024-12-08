import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { apiClient } from 'lib/api-client';
import { personnelQueryKeys } from 'lib/query-keys';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

export const getPersonnelMeta = async ({ metaType, ...params }) => {
  const response = await apiClient.get(`/personnel/meta`, {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
    params: {
      page_size: 9999,
      meta_type: metaType,
      ...params,
    },
  });

  return response?.response;
};

export const useGetPersonnelMeta = ({ metaType, ...params }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      personnelQueryKeys.personnel.meta,
      {
        metaType,
        ...params,
      },
    ],
    queryFn: () =>
      getPersonnelMeta({
        metaType,
        ...params,
      }),
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export function useGetGenders() {
  const { data: genders } = useGetPersonnelMeta({
    metaType: 'gender_info',
  });

  const myGenders = useCallback(
    (genderId) => {
      try {
        const { data = [] } = genders;
        const genderName = data?.find((ss) => ss?.id === genderId)?.name_th;
        return genderName;
      } catch (error) {
        return 'ไม่ระบุ';
      }
    },
    [genders]
  );

  return {
    genders,
    myGenders,
  };
}
