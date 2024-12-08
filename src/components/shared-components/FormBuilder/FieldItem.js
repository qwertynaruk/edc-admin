import Draggable from './Draggable';
import IconCustom, { PlusCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button } from 'antd';
import { IconHandleDNDNormal } from 'assets/svg/iconantdcustom';
import { getTitle } from './EditableBlock';

export default function FieldItem({ data = {} }) {
  return (
    <Draggable data={data}>
      {({ dragging, dragRef }) => {
        return (
          <div
            ref={dragRef}
            className={css`
              display: flex;
              user-select: none;
              padding: 0.5rem;
              margin: 0 0 0.5rem 0;
              align-items: center;
              align-content: flex-start;
              line-height: 1.5;
              border-radius: 3px;
              background: #1b2531;
              cursor: grab;
              transform: translate(0px, 0px);
              border-radius: 10px;
              opacity: ${dragging ? 0.5 : 1};
            `}
          >
            <IconCustom
              component={IconHandleDNDNormal}
              style={{
                transform: 'scale(.8)',
                marginRight: 5,
              }}
            />
            <div
              className={css`
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
            >
              {/* {dragging ? 'กำลังลาก...' : getTitle(data)} */}
              {getTitle(data)}
            </div>
            <Button
              ghost
              className={css`
                padding: 0 0.5rem;
              `}
            >
              <PlusCircleOutlined />
            </Button>
          </div>
        );
      }}
    </Draggable>
  );
}
