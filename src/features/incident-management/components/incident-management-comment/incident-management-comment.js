import { Card, Divider, Tabs } from 'antd';

import { CommentInput } from './components/comment-input';
import { CommentList } from './components/comment-list';
import { FallbackError } from 'components/util-components/fallback-error';
import { css } from '@emotion/css';
import { useRef } from 'react';

export const IncidentManagementComment = ({ incidentId, data, isLoading, isError }) => {
  const commentScrollRef = useRef(null);

  if (isError) {
    return <FallbackError />;
  }

  const comments = data?.comments ?? [];

  return (
    <Card
      loading={isLoading}
      className={css`
        .ant-card-body {
          padding: ${isLoading ? '24px' : '0'};
        }

        .ant-tabs {
          .ant-tabs-nav {
            padding: 0 24px;

            .ant-tabs-tab-active {
              .ant-tabs-tab-btn {
                color: #ff0000;
              }
            }
          }

          .ant-tabs-content-holder {
            padding: 0;
          }

          .ant-tabs-ink-bar {
            background-color: #ff0000;
          }
        }
      `}
    >
      <Tabs defaultActiveKey="citizen-coment" size="large">
        <Tabs.TabPane tab="ช่องทางการตอบกลับประชาชน" key="citizen-coment">
          <div
            ref={commentScrollRef}
            style={{
              padding: '18px 18px 0 18px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <CommentList comments={comments} />
          </div>
          <Divider />
          <div
            style={{
              padding: '0 18px 18px 18px',
            }}
          >
            <CommentInput
              incidentId={incidentId}
              data={data}
              isLoading={isLoading}
              onCommentTrigger={() => {
                commentScrollRef.current?.scrollTo({
                  top: commentScrollRef.current?.scrollHeight,
                  behavior: 'smooth',
                });
              }}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
