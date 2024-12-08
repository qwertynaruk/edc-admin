import { css } from '@emotion/css';
import { Spin, Tree } from 'antd';
import { useCallback, useMemo } from 'react';
import { toTreeData } from './transform';

export default function OrganizationTree(props) {
  const { value = {}, manager, onNavigate } = props;
  const { data, loading } = manager;

  const navigate = useCallback(() => {
    if (onNavigate) onNavigate();
  }, [onNavigate]);

  const treeData = useMemo(() => {
    return toTreeData(data, value, { navigate });
  }, [data, navigate, value]);

  if (loading) return <Spin />;

  return (
    <Tree.DirectoryTree
      className={css`
        background: transparent !important;
        .ant-tree-list-holder-inner {
        }
        .ant-tree-switcher {
          background: transparent !important;
          &.ant-tree-switcher_open {
            display: none;
          }
          &.ant-tree-switcher_close {
            display: none;
          }
        }
        .ant-tree-treenode:hover::before {
          background: transparent !important;
        }
        .ant-tree-treenode-selected::before {
          background: transparent !important;
        }
        .ant-tree-switcher-leaf-line {
          &::before {
            border-color: rgba(58, 66, 74, 1);
          }
          &::after {
            height: calc(50% - 1px);
            border-color: rgba(58, 66, 74, 1);
          }
        }
        .ant-tree-treenode-leaf-last {
          .ant-tree-switcher-leaf-line {
            &::before {
              height: calc(50% - 1px) !important;
              border-color: rgba(58, 66, 74, 1);
            }
          }
        }
        .ant-tree-iconEle {
          display: none !important;
        }
        .ant-tree-node-content-wrapper-open {
          // margin-left: -24px;
        }
        .ant-tree-node-content-wrapper-close {
          // margin-left: -24px;
        }
        .ant-tree-indent-unit::before {
          border-color: rgba(58, 66, 74, 1) !important;
        }
      `}
      showLine={{
        showLeafIcon: false,
      }}
      switcherIcon={false}
      blockNode={true}
      defaultExpandAll={true}
      treeData={treeData}
    />
  );
}
