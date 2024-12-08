import { Button, Card, Layout, Space, Typography } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import { css, cx } from '@emotion/css';
import styled from '@emotion/styled';
import { EditOutlined, InfoCircleOutlined, PlusCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import useService from 'hooks/useService';
import { serviceWrapper } from 'utils/serviceHelper';
import PersonnelService from 'services/PersonelService';
import produce from 'immer';
import _ from 'lodash';
import ApprovalMemberEditor from '../../Components/Modal/ApprovalMemberEditor';
import DialogNotification from 'components/shared-components/DialogNotification';
import { MAX_API_LIMIT } from 'constants/ApiConstant';

const { Title } = Typography;

const Shadow = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
  bottom: 0;
  width: 10px;
  box-shadow: -9px 0px 7px rgba(0, 0, 0, 0.25);
`;

const base = css`
  padding: 14px;
  margin-bottom: 16px;
  display: block;
  width: 100%;
  height: auto;
  white-space: normal;
  text-align: left;
  cursor: pointer;
  .ant-space {
    justify-content: space-between;
  }
`;
const enabled = css`
  background-color: #1b2531 !important;
`;
const disabled = css`
  background-color: #5f6168 !important;
`;

function KanbanCard(props) {
  const { children, actionLoading, record, onFinish, ...otherProps } = props;
  const [visible, setVisible] = useState(false);

  const onEdit = () => {
    setVisible(true);
  };

  const _onFinish = (values) => {
    if (onFinish) {
      onFinish(values, () => setVisible(false));
    }
  };
  return (
    <>
      <div
        className={cx({ [base]: true }, { [disabled]: props.disabled }, { [enabled]: !props.disabled })}
        {...otherProps}
      >
        <Space>
          <Title level={5}>{children}</Title>
          <Button onClick={onEdit} ghost>
            <EditOutlined />
          </Button>
        </Space>
      </div>
      {visible ? (
        <ApprovalMemberEditor
          actionLoading={actionLoading}
          onFinish={_onFinish}
          record={record}
          visible={visible}
          setVisible={setVisible}
        />
      ) : null}
    </>
  );
}

function KanbanColumn({ children, actionLoading, onFinish, level, sequence = {}, loading, ...rest }) {
  const [visible, setVisible] = useState(false);

  const _onFinish = (values) => {
    if (onFinish) {
      onFinish(values, () => setVisible(false));
    }
  };

  const parent = sequence[level - 1];

  const isShowAddButton = parent || level === 1;

  return (
    <>
      <Card
        className={css`
          min-width: 230px;
          max-width: 230px;
          margin: 0;
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          .ant-card-head {
            padding: 0;
            padding-right: 16px;
            .ant-card-extra {
              color: #e0e0e0;
            }
          }
          .ant-card-body {
            padding: 8px;
            flex: 1;
            display: flex;
            flex-direction: column;
            ${children.length === 0 ? 'justify-content: center;' : ''}
            ${loading ? 'justify-content: flex-start;' : ''}
          }
        `}
        extra={<InfoCircleOutlined />}
        title={`ระดับ ${level}`}
        loading={loading}
        {...rest}
      >
        <div>{children}</div>
        {isShowAddButton ? (
          <div
            className={css`
              justify-content: center;
              height: 2.8rem;
              display: flex;
              align-items: center;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.15s ease;
            `}
            onClick={() => {
              setVisible(true);
            }}
          >
            <PlusCircleFilled className="gx-mr-2" /> เพิ่ม
          </div>
        ) : (
          <div
            className={css`
              text-align: center;
            `}
          >
            <span>กรุณาเลือกระดับ {level - 1}</span>
          </div>
        )}
        {visible ? (
          <ApprovalMemberEditor
            actionLoading={actionLoading}
            record={{
              level,
              parent_id: parent?._id,
            }}
            onFinish={_onFinish}
            visible={visible}
            setVisible={setVisible}
          />
        ) : null}
      </Card>
    </>
  );
}

function KanbanBoard(props) {
  return (
    <div
      className={css`
        position: relative;
        margin-bottom: 20px;
      `}
    >
      <Layout
        className={css`
          overflow-x: scroll;
          min-height: 70vh;
          gap: 1rem;
          display: flex;
          flex: 1 1 auto;
          flex-direction: row;
          align-items: stretch;
        `}
      >
        {props.children}
      </Layout>
      <Shadow />
    </div>
  );
}

export default function Approval() {
  const {
    data: roleLevels = [],
    mutate,
    loading,
  } = useService(serviceWrapper(PersonnelService.getAllRoleLevels), {
    params: {
      limit: MAX_API_LIMIT,
    },
  });

  const [state, setState] = useState({
    modalVisible: false,
    actionLoading: false,
    recordSequence: {},
  });

  const setActionLoading = (loading) => {
    setState(
      produce((draft) => {
        draft.actionLoading = loading;
      })
    );
  };

  const onCardClick = (record) => {
    return () => {
      console.log('on card click');
      setState(
        produce((draft) => {
          Object.keys(draft.recordSequence).forEach((key) => {
            if (key > record.level) {
              delete draft.recordSequence[key];
            }
          });
          draft.recordSequence[record.level] = record;
          // record.sub_level.forEach((item) => {
          //   draft.recordSequence[item.level] = item;
          // });
        })
      );
    };
  };

  const create = (values, close) => {
    setActionLoading(true);
    PersonnelService.createRoleLevel(values)
      .then(() => {
        mutate();
        close();
        DialogNotification('success', 'สำเร็จ', 'เพิ่มข้อมูลสำเร็จ');
      })
      .catch(() => {
        DialogNotification('error', 'ไม่สำเร็จ', 'เพิ่มข้อมูลไม่สำเร็จ');
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const update = (values, close) => {
    console.log('update', values);
    setActionLoading(true);
    const id = values._id;
    const newValues = _.omit(values, ['_id']);
    newValues.role_level_id = id;
    PersonnelService.updateRoleLevel(newValues)
      .then(() => {
        mutate();
        close();
        DialogNotification('success', 'สำเร็จ', 'แก้ไขสำเร็จ');
      })
      .catch(() => {
        DialogNotification('error', 'ไม่สำเร็จ', 'แก้ไขไม่สำเร็จ');
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const onAddFinish = (record) => {
    return (values, close) => {
      if (record._id) {
        return update(values, close);
      }
      return create(values, close);
    };
  };

  const columnFilter = (level) => {
    return (item) => {
      return item.level === level && state.recordSequence[level - 1]?._id === item.parent_id;
    };
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'การอนุมัติและเข้าถึงเอกสาร' }} />
      <Card>
        <SearchMultiverse mode="auto" />
      </Card>
      <KanbanBoard>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((level) => {
          return (
            <KanbanColumn
              loading={loading}
              key={level}
              level={level}
              onFinish={create}
              sequence={state.recordSequence}
              actionLoading={state.actionLoading}
            >
              {roleLevels.filter(columnFilter(level)).map((record) => (
                <KanbanCard
                  key={record._id}
                  onFinish={onAddFinish(record)}
                  onClick={onCardClick(record)}
                  disabled={state.recordSequence[level]?._id !== record._id}
                  actionLoading={state.actionLoading}
                  record={record}
                >
                  {record.name}
                </KanbanCard>
              ))}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </>
  );
}
