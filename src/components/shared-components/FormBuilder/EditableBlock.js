import { CaretDownOutlined, CaretUpOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Card, Drawer, Form, Input, Space } from 'antd';
import { useBoolean } from 'ahooks';
import Droppable from './Droppable';

export function getTitle(block = {}) {
  const { label, type, title } = block;
  return title || label || type;
}

export default function EditableBlock(props) {
  const { children, onDelete, onDom } = props;
  const [visible, { toggle, setFalse }] = useBoolean(false);

  const showDrawer = () => {
    toggle();
  };

  return (
    <>
      <Card
        title={getTitle(props) || 'Editable Block'}
        className={css`
          margin-bottom: 0;
          .ant-card-head {
            background-color: #1b2531;
          }
          .ant-card-body {
            padding: 0.5rem;
          }
          .ant-card-extra {
            padding: 0;
            .ant-btn {
              padding: 0 0.2rem;
            }
          }
        `}
        extra={
          <Space size={0}>
            <Button ghost onClick={showDrawer}>
              <SettingOutlined style={{ color: '#fff' }} />
            </Button>
            <Button ghost onClick={onDelete}>
              <DeleteOutlined style={{ color: '#fff' }} />
            </Button>
            <Space
              direction="vertical"
              size={0}
              className={css`
                .ant-btn {
                  height: 16px;
                  line-height: 0;
                }
              `}
            >
              <Button ghost>
                <CaretUpOutlined />
              </Button>
              <Button ghost>
                <CaretDownOutlined />
              </Button>
            </Space>
          </Space>
        }
      >
        <Droppable
          onDom={(data) => {
            onDom?.(data);
          }}
        >
          {children}
        </Droppable>
      </Card>
      <Drawer
        title="&nbsp;"
        placement="right"
        onClose={setFalse}
        visible={visible}
        className={css`
          .ant-drawer-content-wrapper {
            background-color: rgba(40, 49, 66, 1) !important;
            .ant-drawer-content {
              background-color: transparent;
            }
          }
          .ant-drawer-header {
            background-color: transparent;
            border-bottom: none;
          }
          .ant-drawer-footer {
            padding-left: 0;
            padding-right: 0;
          }
        `}
        footer={
          <Button
            type="primary"
            className={css`
              width: 100%;
            `}
          >
            บันทึก
          </Button>
        }
      >
        <Form layout="vertical">
          <Form.Item label="หัวข้อ">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
