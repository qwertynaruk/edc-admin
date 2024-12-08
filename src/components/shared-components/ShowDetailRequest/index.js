import React from 'react';
import { Col, Row, Space, Typography } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';

const ShowDetailRequest = (props) => {
  const { dataSource, displayInputLabel, displayInputValue, infoProfile, metaForm = [] } = props;

  const ignoreKey = [
    'IsNotEnd',
    'EventType',
    'OtherEvent',
    'subject-type-system',
    'title',
    'request-type-system',
    'GoogleMap-system',
    'UploadCustom-system',
    'name-system',
    'lastname-system',
    'OtherPlace',
    'UnknowLocation-checkbox',
    'latitude-system',
    'longitude-system',
    '_id',
  ];

  const displayHeader = (data_element_name) => {
    switch (data_element_name) {
      case 'report_detail':
        return 'ข้อมูลการแจ้ง';
      // break;
      case 'report_type_id':
        return 'หมายเลขประเภทเคส';
      // break;
      case 'reporter':
        return 'ข้อมูลผู้แจ้ง';
      case 'report_location':
        return 'สถานที่เกิดเหตุ';
      case 'location_description':
        return 'คำอธิบายสถานที่';
      default:
        return '-';
      // break;
    }
  };

  const renderReporter = () => {
    return (
      <Row gutter={[32, 10]}>
        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              ชื่อ นามสกุล :
            </Typography.Text>
            <Typography.Text>{_.get(infoProfile, 'name_th') || '-'}</Typography.Text>
          </Space>
        </Col>

        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              เลขบัตรประจำตัวประชาชน :
            </Typography.Text>
            <Typography.Text>{_.get(infoProfile, 'id_card') || '-'}</Typography.Text>
          </Space>
        </Col>

        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              เพศ :
            </Typography.Text>
            <Typography.Text>
              {['นาง', 'นางสาว', 'ด.ญ.', 'เด็กหญิง', 'น.', 'น.ส.'].includes(_.get(infoProfile, 'name_th') || '-')
                ? 'หญิง'
                : 'ชาย'}
            </Typography.Text>
          </Space>
        </Col>

        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              วัน/เดือน/ปี เกิด :
            </Typography.Text>
            <Typography.Text>{_.get(infoProfile, 'date_of_birth_th') || '-'}</Typography.Text>
          </Space>
        </Col>

        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              เบอร์โทร :
            </Typography.Text>
            <Typography.Text>{_.get(infoProfile, 'phone_number') || '-'}</Typography.Text>
          </Space>
        </Col>

        <Col>
          <Space size={10}>
            <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
              อีเมล :
            </Typography.Text>
            <Typography.Text>{_.get(infoProfile, 'email') || '-'}</Typography.Text>
          </Space>
        </Col>
      </Row>
    );
  };

  const renderDynamicField = (component) => {
    const gainFilter = component.filter((item) => {
      if (item.key === 'StartDateTime') {
        const haveData = _.find(component, (ss) => ss.key === 'start_and_end_date') || [];
        return haveData && haveData?.initialValue?.length > 0 ? null : item;
      } else {
        return item;
      }
    });

    return (
      <Row className="mb-2" gutter={[32, 10]}>
        {gainFilter
          .filter((item) => ignoreKey.indexOf(item.key) === -1)
          .filter((item) => item.initialValue)
          .map((ev2, inf) => (
            <React.Fragment key={inf}>
              {!['GoogleMap-system', 'UploadCustom-system'].includes(ev2.key) && (
                <Col>
                  <Space size={10}>
                    <Typography.Text style={{ color: '#fff', opacity: 0.4 }} className="mb-1">
                      {displayInputLabel(ev2)} :
                    </Typography.Text>
                    <Typography.Text>{displayInputValue(ev2)}</Typography.Text>
                  </Space>
                </Col>
              )}
            </React.Fragment>
          ))}
      </Row>
    );
  };

  const renderFormBySection = (sectionName, component) => {
    switch (sectionName) {
      case 'report_detail':
        if (metaForm.length > 0) {
          return metaForm.map((ss) =>
            ss?.section?.map((cc) => cc?.key !== 'location-with-map' && renderDynamicField(cc?.component))
          );
        } else {
          return renderDynamicField(component);
        }
      case 'reporter':
        return renderReporter();

      default:
        return renderDynamicField(component);
    }
  };

  return [{ name: '', section: dataSource }].map((el, ind) =>
    el.section.map(({ section_name = '', component = [] }, _index) => (
      <>
        {component.length > 0 && (
          <Space direction="vertical" className="gx-mt-4">
            <Typography.Title level={5}>{displayHeader(section_name)}</Typography.Title>

            {renderFormBySection(section_name, component)}
          </Space>
        )}
      </>
    ))
  );
};

export default ShowDetailRequest;

ShowDetailRequest.defaultProps = {
  dataSource: [],
};

ShowDetailRequest.prototype = {
  dataSource: PropTypes.array,
};
