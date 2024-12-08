import { Button, Card, Col, Dropdown, Form, Input, Menu, Row, Space, Typography } from 'antd';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import React, { useEffect, useRef } from 'react';
import FormPreference from 'utils/FormPreference';

const SignatureContainer = ({ form }) => {
  const componentRef = useRef(null);
  const { reportItems = {} } = ReportStore;
  const _offenseInformer = _.get(reportItems, 'offense.informer', []) || [];
  const _offenseInterpreter = _.get(reportItems, 'offense.interpreter', []) || [];

  const _eventInformer = _.get(reportItems, 'event.informer', []) || [];
  const _eventInterpreter = _.get(reportItems, 'event.interpreter', []) || [];

  const _investigator = _.get(reportItems, 'investigation.investigator', []) || [];

  const _sameInquisitor = _.get(reportItems, 'basic_information.is_inquisitor', false);
  const _recorder = _.get(reportItems, 'basic_information.recorder', '');
  const _inquisitor = _.get(reportItems, 'basic_information.inquisitor', '');

  const _offender = _.get(reportItems, 'arrest.offender', []);
  const _directedOfficer = _.get(reportItems, 'arrest.directed_officer', []);
  const _internalOfficer = _.get(reportItems, 'arrest.internal_arrest_unit.officer', []);

  const RenderPanel = ({
    parentName = '',
    title = 'ผู้แจ้ง',
    initValue = {},
    mapType = { type: 'object', mapKey: 0 },
  }) => {
    useEffect(() => {
      form.setFieldsValue({ [parentName]: initValue });

      if (mapType.type === 'array') {
        const currentIndex = form.getFieldsValue(parentName);
        currentIndex[mapType.mapKey] = initValue;
        form.setFieldsValue({ [parentName]: currentIndex });
      }
    }, []);

    const checkFromName = (fieldName) => {
      const singleDimension = [parentName, fieldName];
      const multiDimension = [parentName, mapType.mapKey, fieldName];

      return mapType.type === 'array' ? multiDimension : singleDimension;
    };

    return (
      <Card>
        <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>ลงลายมือชื่อ : {title}</Typography.Text>

        <Row className="gx-flex-row gx-mt-3" gutter={[16, 16]}>
          <Col span={5}>
            <Form.Item className="gx-mb-0" name={checkFromName('prefix')} label="คำนำหน้าหรือชั้นยศ">
              <Input placeholder="กรอกคำนำหน้าหรือชั้นยศ" />
            </Form.Item>
          </Col>

          <Col span={13}>
            <Form.Item className="gx-mb-0" name={checkFromName('fullname')} label="ลงชื่อ">
              <Input placeholder="กรอกลงชื่อ" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item className="gx-mb-0" name={checkFromName('relation')} label="ความเกี่ยวข้องกับรายงาน">
              <Input placeholder="กรอกความเกี่ยวข้องกับรายงาน" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Card title="ลงลายมือชื่อ" ref={(el) => (componentRef.current = el)}>
      {_offenseInformer.concat(_eventInformer).map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName={['informer', _index]}
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: _.get(ss, 'profile_prefix', ''),
              fullname: FormPreference.JuristicOrPerson(ss),
              relation: 'ผู้แจ้ง',
            }}
          />
        </React.Fragment>
      ))}

      {_offenseInterpreter.concat(_eventInterpreter).map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName={['interpreter', _index]}
            title="ล่าม"
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: _.get(ss, 'profile_prefix', ''),
              fullname: FormPreference.JuristicOrPerson(ss),
              relation: 'ล่าม',
            }}
          />
        </React.Fragment>
      ))}

      {_investigator.map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName={['investigator', _index]}
            title="เจ้าหน้าที่สืบสวน"
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: FormPreference.ComplexPersonnel(ss._id, 'prefix'),
              fullname: FormPreference.ComplexPersonnel(ss._id, 'shortname'),
              relation: 'เจ้าหน้าที่สืบสวน',
            }}
          />
        </React.Fragment>
      ))}

      {_offender.map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName="offender"
            title="ผู้ต้องหา"
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: _.get(ss, 'profile_prefix', ''),
              fullname: FormPreference.JuristicOrPerson(ss),
              relation: `ผู้ต้องหา ${_index + 1}`,
            }}
          />
        </React.Fragment>
      ))}

      {_directedOfficer.map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName="direct_officer"
            title="อำนวยการ"
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: FormPreference.ComplexPersonnel(ss._id, 'prefix'),
              fullname: FormPreference.ComplexPersonnel(ss._id, 'shortname'),
              relation: 'อำนวยการ',
            }}
          />
        </React.Fragment>
      ))}

      {_internalOfficer.map((ss, _index) => (
        <React.Fragment key={_index}>
          <RenderPanel
            parentName="inquiry"
            title="พนักงานสอบสวน"
            mapType={{ type: 'array', mapKey: _index }}
            initValue={{
              prefix: FormPreference.ComplexPersonnel(ss._id, 'prefix'),
              fullname: FormPreference.ComplexPersonnel(ss._id, 'shortname'),
              relation: 'พนักงานสอบสวน',
            }}
          />
        </React.Fragment>
      ))}

      {_recorder && (
        <RenderPanel
          parentName="recorder"
          title="ผู้บันทึก"
          initValue={{
            prefix: FormPreference.ComplexPersonnel(_recorder, 'prefix'),
            fullname: FormPreference.ComplexPersonnel(_recorder, 'shortname'),
            relation: 'ผู้บันทึก',
          }}
        />
      )}

      {!_sameInquisitor && _inquisitor && (
        <RenderPanel
          parentName="inquisitor"
          title="พนักงานสอบสวน"
          initValue={{
            prefix: FormPreference.ComplexPersonnel(_inquisitor, 'prefix'),
            fullname: FormPreference.ComplexPersonnel(_inquisitor, 'shortname'),
            relation: 'พนักงานสอบสวน',
          }}
        />
      )}

      <Form.List name="signature">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => {
              return (
                <Card key={key}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="delete" className="gx-py-2" onClick={() => remove(name)}>
                          ลบ
                        </Menu.Item>
                      </Menu>
                    }
                    placement="bottomRight"
                    trigger={['click']}
                    className="gx-position-absolute"
                  >
                    <i className="gx-icon-btn icon icon-ellipse-v" />
                  </Dropdown>

                  <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
                    ลงลายมือชื่อ : เพิ่มลายมือ ({key + 1})
                  </Typography.Text>

                  <Row className="gx-flex-row gx-mt-3" gutter={[16, 16]}>
                    <Col span={5}>
                      <Form.Item className="gx-mb-0" name={[name, 'prefix']} label="คำนำหน้าหรือชั้นยศ">
                        <Input placeholder="กรอกคำนำหน้าหรือชั้นยศ" />
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item className="gx-mb-0" name={[name, 'fullname']} label="ลงชื่อ">
                        <Input placeholder="กรอกลงชื่อ" />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item className="gx-mb-0" name={[name, 'relation']} label="ความเกี่ยวข้องกับรายงาน">
                        <Input placeholder="กรอกความเกี่ยวข้องกับรายงาน" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              );
            })}
            <Space className="gx-space-between">
              <Button type="primary" onClick={add}>
                เพิ่มลายมือชื่อ
              </Button>
            </Space>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default SignatureContainer;
