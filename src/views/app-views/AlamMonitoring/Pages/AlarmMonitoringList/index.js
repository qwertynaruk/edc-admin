import { Avatar, Card, Dropdown, Menu, Row, Space, Table, Typography } from 'antd';
import { MoreOutlined, ShareAltOutlined } from '@ant-design/icons';

// import { first } from "lodash";
// import AlarmMonitoring from "services/AlarmMonitoring";
import { css } from '@emotion/css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AlarmMonitoringListPage = () => {
  const navigate = useNavigate();

  const [selectEvent, setSelectEvent] = useState(null);
  const [loading, setLoading] = useState(null);
  const [shareDetail, setShareDetail] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [markerDatas, setMarkerDatas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailDialogData, setDetailDialogData] = useState(null);

  const data = [
    {
      object_id: 'a1ae6268-185c-4e4c-90ad-a9ce72ca1a25',
      event_name: 'Kabala Airport',
      number_recipient: 3,
      expiration: '2023-09-17T13:04:09Z',
      views: 12,
      share: true,
      sender: 'Janos Corbridge',
      created_at: '2024-03-14T13:27:54Z',
    },
    {
      object_id: 'c6fd2837-e8e0-4ffc-95b0-646e74be606d',
      event_name: 'Mariscal Sucre International Airport',
      number_recipient: 16,

      expiration: '2024-01-25T15:11:23Z',
      views: 1,
      share: true,
      sender: 'Marcella Franc',
      created_at: '2024-02-19T09:02:40Z',
    },
    {
      object_id: 'e497a817-a8be-45a4-833a-d834e1ea8c88',
      event_name: 'Bremerton National Airport',
      number_recipient: 8,
      expiration: '2023-11-11T20:35:42Z',
      views: 5,
      share: false,
      sender: 'Charlene Morrow',
      created_at: '2023-06-25T21:34:39Z',
    },
    {
      object_id: 'a21daeea-13bd-4ca6-9b08-0f378d97f6f3',
      event_name: 'Ngari Gunsa Airport',
      number_recipient: 12,
      expiration: '2023-08-19T05:02:05Z',
      views: 1,
      share: false,
      sender: 'Mortie Enrique',
      created_at: '2024-04-24T23:54:32Z',
    },
    {
      object_id: 'e2a9881b-6860-43b0-9af0-238dee4b33ac',
      event_name: 'Valladolid Airport',
      number_recipient: 11,
      expiration: '2023-11-18T07:14:57Z',
      views: 10,
      share: true,
      sender: 'Hiram Hendrichs',
      created_at: '2023-05-27T02:29:25Z',
    },
    {
      object_id: 'ea363bff-f502-46a9-b598-ac0ad018908d',
      event_name: 'Mettel Field',
      number_recipient: 5,
      expiration: '2024-02-22T19:06:59Z',
      views: 9,
      share: false,
      sender: 'Rosanne Cradey',
      created_at: '2023-05-19T00:35:14Z',
    },
    {
      object_id: 'b7736f6a-0a2a-4f3d-a2ab-ce56944a31b7',
      event_name: 'Bowman Field',
      number_recipient: 8,
      expiration: '2024-03-07T01:33:01Z',
      views: 12,
      share: false,
      sender: 'Adelice Giacobo',
      created_at: '2023-12-05T12:21:45Z',
    },
    {
      object_id: '7134de98-2849-4f78-af95-d98646cb1e5f',
      event_name: 'Auxiliary Airfield',
      number_recipient: 19,
      expiration: '2023-06-23T09:19:50Z',
      views: 10,
      share: true,
      sender: 'Dinah Antonazzi',
      created_at: '2024-04-19T16:18:05Z',
    },
    {
      object_id: 'ff312c4a-74c1-4bec-a9b5-4b21b28b6783',
      event_name: 'Juancho E. Yrausquin Airport',
      number_recipient: 12,
      expiration: '2024-02-01T07:23:17Z',
      views: 1,
      share: true,
      sender: 'Christophe Tyler',
      created_at: '2023-08-21T13:27:55Z',
    },
    {
      object_id: '871a28a2-bc1f-4bd3-abd4-391bd705be84',
      event_name: 'Griffith Airport',
      number_recipient: 10,
      expiration: '2023-09-15T15:29:33Z',
      views: 1,
      share: true,
      sender: 'Amalia Grimsdyke',
      created_at: '2023-09-07T11:38:41Z',
    },
  ];

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

  function statusRender(status) {
    if (status) {
      return (
        <>
          <Row>
            <Avatar
              size={15}
              style={{
                backgroundColor: '#15B79E',
                marginRight: 5,
              }}
            />
            Active
          </Row>
        </>
      );
      // Inacetive
    } else {
      return (
        <>
          <Row>
            <Avatar
              size={15}
              style={{
                backgroundColor: '#6C737F',
                marginRight: 5,
              }}
            />
            Inacetive
          </Row>
        </>
      );
    }
  }

  const handleAction = (key, id) => {
    if (key === 'edit') {
      navigate(`/app/alarm-monitoring/detail/${id}`);
    } else {
      console.log(key, id);
    }
  };

  return (
    <>
      <Card
        bodyStyle={{
          width: '100%',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
      >
        <Typography
          style={{
            paddingBottom: '20px',
            fontSize: '20px',
            paddingLeft: '10px',
          }}
        >
          <ShareAltOutlined /> Share
        </Typography>
        <Table
          columns={[
            {
              title: 'Event Name',
              dataIndex: 'event_name',
              key: 'event_name',
              render: (event_name, record) => (
                <Typography.Link
                  style={{
                    color: ' #ff3744',
                  }}
                  onClick={() => handleAction('edit', record.object_id)}
                >
                  {event_name}
                </Typography.Link>
              ),
            },
            {
              title: 'Number of Recipient',
              dataIndex: 'number_recipient',
              key: 'number_recipient',
              align: 'center',
              render: (number_recipient) => <Typography>{number_recipient}</Typography>,
            },
            {
              title: 'Expiration',
              dataIndex: 'expiration',
              key: 'expiration',
              align: 'center',
              render: (expiration) => <Typography>{dateTimeFormat(expiration)}</Typography>,
            },
            {
              title: 'Views',
              key: 'views',
              dataIndex: 'views',
              align: 'center',
            },
            {
              title: 'Share',
              dataIndex: 'share',
              key: 'share',
              align: 'center',
              render: (share) => <>{statusRender(share)}</>,
            },
            {
              title: 'Sender',
              dataIndex: 'sender',
              key: 'sender',
            },
            {
              title: 'time Created',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (created_at) => <Typography>{dateTimeFormat(created_at)}</Typography>,
            },
            //
            {
              title: '',
              key: 'action',
              render: (_, record) => (
                <Space size="middle">
                  <Dropdown
                    overlay={
                      <Menu
                        items={[
                          {
                            key: 'edit',
                            label: 'แก้ไข',
                          },
                          {
                            key: 'delete',
                            label: 'ลบ',
                          },
                        ]}
                        onClick={(e) => handleAction(e.key, record.object_id)}
                      />
                    }
                  >
                    <MoreOutlined style={{ cursor: 'pointer' }} />
                  </Dropdown>
                </Space>
              ),
            },
          ]}
          dataSource={data}
          className={css`
            .ant-table-thead .ant-table-cell {
              background-color: #161e2b;
            }
            .ant-table-thead
              > tr
              > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
                [colspan]
              )::before {
              background-color: #000;
            }
          `}
          pagination={{
            pageSize: 10,
            total: data.length,
          }}
        />
      </Card>
    </>
  );
};

export default AlarmMonitoringListPage;
