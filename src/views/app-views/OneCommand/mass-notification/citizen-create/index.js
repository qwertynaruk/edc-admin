import { Col, Form, Row, Skeleton } from 'antd';
import {
  MassNotificationCitizenBoundaryArea,
  MassNotificationCitizenBoundaryRadius,
  MassNotificationCitizenCommunication,
} from 'features/mass-notification';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DialogNotification from 'components/shared-components/DialogNotification';
import DialogPopup from 'components/shared-components/DialogPopup';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { PublishScheduleModal } from 'features/mass-notification/components/publish-schedule-modal';
import UserStore from 'mobx/UserStore';
import { toJS } from 'mobx';
import { useCreateMassNotification } from 'features/mass-notification/hooks';
import { useGetDetailMassNotification } from 'features/mass-notification/hooks/use-get-detail-mass-notification';
import { useUpdateMassNotification } from 'features/mass-notification/hooks/use-update-mass-notification';

export const refCenter = {
  lat: 13.757703,
  lng: 100.52032,
};

const CitizenCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formStatus, setFormStatus] = useState('publish');
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(undefined);
  const [radiusPosition, setRadiusPosition] = useState({
    radius: 5,
    address: '',
    locationMarker: refCenter,
  });

  const [locationMarker, setLocationMarker] = useState({
    locationMarker: refCenter,
    addressTxt: '',
  });

  const [selectedPolygon, setSelectedPolygon] = useState({
    provinceNameTh: '',
    polygonPaths: [''],
  });

  const { data, isLoading } = useGetDetailMassNotification({
    id,
  });

  const { mutate, isPending } = useCreateMassNotification({
    onSuccess: () => {
      navigate('/app/one-command/mass-notification');
      DialogNotification('success', 'สร้างรายการสำเร็จ');
      setOpen(false);
    },
    onError: () => {
      DialogNotification('error', 'ไม่สามารถทำรายการได้');
      setOpen(false);
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateMassNotification({
    onSuccess: () => {
      navigate('/app/one-command/mass-notification');
      DialogNotification('success', 'สร้างรายการสำเร็จ');
    },
    onError: () => {
      DialogNotification('error', 'ไม่สามารถทำรายการได้');
    },
  });

  const type = Form.useWatch('type', form) ?? 'radius';

  const onPreparedMutate = (payload) => {
    if (id) {
      mutateUpdate({
        payload,
        params: {
          id,
        },
      });
    } else {
      mutate(payload);
    }
  };

  const onSuccessScheduleTime = (values) => {
    onPreparedMutate({
      ...payload,
      ...values,
    });
  };

  const onSubmit = (values) => {
    const payload = {
      noti_category_id: values?.noti_category_id || '',
      location_area: {
        lat: radiusPosition.locationMarker.lat,
        lng: radiusPosition.locationMarker.lng,
        radius: radiusPosition.radius || 1,
        address: radiusPosition?.address || '',
      },
      location: {
        lat: locationMarker.locationMarker?.lat,
        lng: locationMarker.locationMarker?.lng,
      },
      detail_message: values?.detail_message || '',
      address: values?.address || '',
      status: formStatus === 'schedule' ? 'draft' : formStatus,
      channels: values?.channels || [],
      polygon_area: {
        amphures: selectedPolygon.polygonPaths,
        province: selectedPolygon.provinceNameTh,
      },
    };

    if (type === 'radius') {
      delete payload.polygon_area;
    }

    if (type === 'area') {
      delete payload.location_area;
    }

    if (formStatus === 'publish') {
      DialogPopup.confirm({
        title: 'ยืนยันการเผยแพร่',
        text: 'ข้อความนี้จะถูกแจ้งเตือนไปยังประชาชนในบริเวณพื้นที่ที่กำหนดทันที ท่านยืนยันการเผยแพร่หรือไม่?',
        confirmAction: () => {
          onPreparedMutate(payload);
        },
      });
    } else if (formStatus === 'schedule') {
      setOpen(true);
      setPayload(payload);
    } else {
      onPreparedMutate(payload);
    }
  };

  const initialFormData = () => {
    form.setFieldsValue({
      noti_category_id: data?.noti_category_id || '',
      detail_message: data?.detail_message || '',
      address: data?.address || '',
      channels: data?.channels || [],
    });

    if (data?.location_area) {
      const locationAreas = data?.location_area;
      setRadiusPosition({
        radius: locationAreas.radius,
        address: locationAreas.address,
        locationMarker: {
          lat: locationAreas.lat,
          lng: locationAreas.lng,
        },
      });
    }

    if (data?.polygon_area) {
      const polygonAreas = data?.polygon_area;
      setSelectedPolygon({
        provinceNameTh: polygonAreas.province,
        polygonPaths: polygonAreas.amphures,
      });
    }

    if (data.location) {
      setLocationMarker({
        locationMarker: data.location,
        addressTxt: data?.address || '',
      });
    }
  };

  const mapCenter = useMemo(() => {
    const locations = toJS(UserStore.organization.location);
    const hasLocations = locations.coordinates?.filter((x) => x)?.length > 1 || false;
    if (hasLocations) {
      const coordinates = locations.coordinates.reverse();
      const t = { lat: coordinates[0], lng: coordinates[1] };
      return t;
    } else {
      return refCenter;
    }
  }, []);

  useEffect(() => {
    const locations = toJS(UserStore.organization.location);
    const hasLocations = locations.coordinates?.filter((x) => x)?.length > 1 || false;
    if (hasLocations) {
      const coordinates = locations.coordinates.reverse();
      const t = { lat: coordinates[0], lng: coordinates[1] };
      setRadiusPosition({
        radius: 5,
        address: '',
        locationMarker: t,
      });
    }

    if (id && data) {
      initialFormData();
    }
  }, [id, data]);

  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          subpath: [
            {
              pathName: [`${id ? 'แก้ไข' : 'เพิ่ม'}ข้อความแจ้งเตือน`],
            },
          ],
        }}
      />
      <Skeleton loading={id ? isLoading : false}>
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={16}>
            <MassNotificationCitizenCommunication
              id={id}
              form={form}
              loading={isPending || isPendingUpdate}
              onFinish={onSubmit}
              onCancel={() => navigate('/app/one-command/mass-notification')}
              setFormStatus={setFormStatus}
              locationMarker={locationMarker}
              setLocationMarker={(e) => setLocationMarker(e)}
            />
          </Col>
          <Col
            xs={24}
            lg={8}
            style={{
              height: 500,
            }}
          >
            {type === 'radius' && (
              <MassNotificationCitizenBoundaryRadius
                radiusPosition={radiusPosition}
                setRadiusPosition={setRadiusPosition}
              />
            )}
            {type === 'area' && (
              <MassNotificationCitizenBoundaryArea mapCenter={mapCenter} setSelectedPolygon={setSelectedPolygon} />
            )}
          </Col>
        </Row>
      </Skeleton>
      <PublishScheduleModal
        methods={id ? 'update' : 'create'}
        open={open}
        setOpen={setOpen}
        onSuccess={onSuccessScheduleTime}
      />
    </>
  );
};

export default CitizenCreatePage;
