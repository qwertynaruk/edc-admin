import { Card, Checkbox, Form, Modal, Select, Tag, Typography } from 'antd';
// global google
import { useEffect, useState } from 'react';

import AlarmMonitoringService from 'services/AlarmMonitoringService';

const ShareEventModal = (props) => {
  const { detailData, openDialog, handleOk, handleCancel, onShareData } = props;
  const [form] = Form.useForm();
  const { Option } = Select;
  const [selectPersons, setSelectPersons] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [personsList, setPersonsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (values) => {
    // const findIdVaiName = values.map((value) => {
    //   return personsList.find((data) => data.objectid === value)?.full_name;
    // });

    // console.log(values)
    setSelectPersons(values);
  };

  const numberOfPerson = detailData?.department_share?.length || selectPersons.length;

  function handleCheck(id) {
    const findPerson = selectPersons.find((p) => p === id);
    if (findPerson) {
      return true;
    } else {
      return false;
    }
  }
  // console.log(selectPersons)
  const oganizationDataList = async () => {
    setLoading(true);

    try {
      const resp = await AlarmMonitoringService.getOrganizationInfo();
      if (resp?.data) {
        setLoading(false);
        setPersonsList(resp?.data);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleReadEvent = async (detailData) => {
    const id = await detailData?.objectid;
    setLoading(true);
    if (id)
      try {
        const resp = await AlarmMonitoringService.getAlarmMonitoringID(id);
        if (resp?.data) {
          setSelectPersons(
            resp?.data.department_share.map((data) => {
              return data.objectid;
            })
          );

          form.setFieldsValue({
            oganization: resp?.data.department_share.map((data) => {
              return data.objectid;
            }),
          });

          setDefaultData(
            resp?.data.department_share.map((data) => {
              return data.objectid;
            })
          );

          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
  };

  function handleDisabled(id) {
    const findPerson = defaultData.find((p) => p === id);

    if (findPerson) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    oganizationDataList();
  }, []);

  useEffect(() => {
    handleReadEvent(detailData);
    if (detailData?.department_share?.length > 0) {
      // console.log(test);
      // setDefaultData(test);

      // setDefaultData(
      //   detailData?.department_share?.map((detail) => {
      //     return detail.objectid;
      //   }),
      // );
      form.setFieldsValue({
        oganization: detailData?.department_share?.map((detail) => {
          return detail.objectid;
        }),
      });
      // setSelectPersons(
      //   detailData?.department_share?.map((detail) => {
      //     return detail.objectid;
      //   }) || [],
      // );
      // detailData?.department_share?.map((detail) => {
      //   return detail.objectid;
      // }),
    } else {
      setSelectPersons([]);
      form.setFieldsValue({
        oganization: [],
      });
      // console.log(2)
      setDefaultData([]);
    }

    // console.log(detailData?.department_share);
  }, [detailData]);
  // console.log(defaultData);

  return (
    <>
      <Modal
        title={
          <>
            <Typography>เผยแพร่เหตุฉุกเฉินให้หน่วยงานที่เกี่ยวข้อง</Typography>
          </>
        }
        forceRender
        visible={openDialog}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        centered
        bodyStyle={{
          paddingTop: '10px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
      >
        <Card
          loading={loading}
          bordered={false}
          style={{
            padding: '0px',
          }}
        >
          <Typography>เมื่อเผยแพร่แล้ว หน่วยงานดังกล่าวจะได้รับการแจ้งเตือน</Typography>
          <Typography.Title level={4} style={{ paddingTop: '0px', marginTop: '5px' }}>
            กรุณาเลือกหน่วยงานที่ต้องการแบ่งกับข้อมูล {`( ${numberOfPerson} )`}
          </Typography.Title>
          {/* <Typography>{defaultData?.[0] || "eiei"}</Typography> */}

          <Form
            form={form}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            // initialValues={{
            //   oganization: defaultData || [],
            // }}
            // onFinish={(e) => handleOk(e)}
            onValuesChange={(e) => onShareData(e)}
          >
            <Form.Item
              noStyle
              name={'oganization'}
              // initialValue={defaultData || [""]}
            >
              <Select
                mode="multiple"
                style={{
                  width: '100%',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                }}
                placeholder="select one country"
                loading={loading}
                disabled={loading}
                onChange={handleChange}
                optionLabelProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                dropdownRender={(menu) => (
                  <>
                    <Typography
                      style={{
                        padding: '10px',
                      }}
                    >
                      Department
                    </Typography>
                    {menu}
                  </>
                )}
              >
                {personsList.map((person, index) => {
                  return (
                    <Option
                      value={person?.objectid}
                      label={person?.full_name}
                      key={index}
                      disabled={handleDisabled(person?.objectid)}
                      style={{
                        padding: '5px',
                      }}
                    >
                      <div>
                        <Checkbox
                          checked={handleCheck(person?.objectid)}
                          style={{
                            paddingRight: '10px',
                          }}
                        />
                        {person?.full_name}
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>

          {selectPersons.map((person, index) => {
            return (
              <Tag
                key={index}
                style={{
                  borderRadius: '20px',
                }}
              >
                {personsList.find((persons) => persons?.objectid === person)?.full_name}
                {/* {person?.full_name} */}
              </Tag>
            );
          })}
        </Card>
      </Modal>
    </>
  );
};

export default ShareEventModal;
