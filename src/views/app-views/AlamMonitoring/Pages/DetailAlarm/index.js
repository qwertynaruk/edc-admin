import { Button, Card, Descriptions, Divider, Row, Steps, Typography } from 'antd';

import { useEffect, useState } from 'react';
// import { first } from "lodash";
// import AlarmMonitoring from "services/AlarmMonitoring";
import { css } from '@emotion/css';
import moment from 'moment';
import { useParams } from 'react-router-dom';
const lib = ['places'];

const DetailAlarmPage = () => {
  const { id } = useParams();
  const { Step } = Steps;

  const description = 'This is a description.';
  function dateTimeFormat(date) {
    if (!date) {
      return null;
    }
    try {
      const convertedTime = moment(date).format('DD MMM YYYY HH:mm');
      return convertedTime;
    } catch (error) {
      return null;
    }
  }

  const steps = [
    {
      title: 'ขั้นตอนที่1',
    },
    {
      title: 'ขั้นตอนที่2',
    },
    {
      title: 'ขั้นตอนที่3',
    },
    {
      title: 'ขั้นตอนที่4',
    },
  ];

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <>
      <Card
        bodyStyle={{
          width: '100%',
          // paddingLeft: "20px",
          paddingRight: '0px',
        }}
      >
        <Descriptions
          title={<Typography>ข้อมูลเคส : หมายเลขเคส : ชื่อเคส</Typography>}
          size={4}
          style={{
            width: '50%',
          }}
        >
          <Descriptions.Item label="ประเภทเคส" span={2}>
            <Typography>ประเภท A</Typography>
          </Descriptions.Item>
          <Descriptions.Item label="วันที่สิ้นสุด" span={1}>
            <Typography>16 มิ.ย. 2562</Typography>
          </Descriptions.Item>
          <Descriptions.Item label="สถานะเคส" span={2}>
            <Typography>รอดำเนินการ</Typography>
          </Descriptions.Item>
          <Descriptions.Item label="สถานะการอนุมัติ" span={1}>
            <Typography>รอการอนุมัติ</Typography>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        bodyStyle={{
          width: '100%',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
      >
        <Steps
          current={current}
          style={{
            padding: '10px',
          }}
          className={css`
            .ant-steps-item-process .ant-steps-item-icon {
              background-color: #fffff000;
              border-color: #ffffff;
            }
            ,
            .ant-steps-item-finish .ant-steps-item-icon {
              background-color: #fffff000;
              border-color: #ffffff;
            }
          `}
        >
          {steps.map((step, i) => {
            return <Step title={step.title} key={i} />;
          })}
        </Steps>
        <Divider />
        <Row justify="end" style={{ paddingRight: '40px', paddingTop: '10px' }}>
          <Button onClick={() => next()}>ถัดไป</Button>
        </Row>
      </Card>
    </>
  );
};

export default DetailAlarmPage;
