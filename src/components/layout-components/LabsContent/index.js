import { Grid, Spin } from 'antd';
import { css, cx } from '@emotion/css';

import useDimension from 'hooks/useDimension';

const { useBreakpoint } = Grid;

const LabsContent = ({
  titleContent = null,
  sideContent = null,
  header = null,
  headerStyle = { alignItems: 'start' },
  footer = null,
  footerStyle = null,
  loading = false,
  children,
}) => {
  const screens = useBreakpoint();
  const { height } = useDimension();

  const contentHeight = screens?.xxl ? height - 470 : screens?.xl ? height - 250 : height - 100;

  return (
    <Spin spinning={loading}>
      <div className="gx-app-module">
        <div
          className="gx-module-sidenav gx-d-lg-flex"
          style={{ width: (screens?.xs || screens?.sm || screens?.md) && !screens?.lg ? '100%' : '235px' }}
        >
          <div
            className={cx(
              'gx-module-side',
              css`
                flex: 1;
                height: auto;
                background: transparent !important;
              `
            )}
          >
            <div className="gx-module-side-header">
              <div className="gx-module-logo">{titleContent}</div>
            </div>

            <div className="gx-module-side-content">{sideContent}</div>
          </div>
        </div>
        <div
          className="gx-module-box"
          style={{
            // maxWidth: 'calc(100% - 242px - 1px)',
            maxWidth: (screens?.xs || screens?.sm || screens?.md) && !screens?.lg ? '100%' : 'calc(100% - 235px - 1px)',
          }}
        >
          {header && (
            <div className="gx-module-box-header" style={headerStyle}>
              {header}
            </div>
          )}
          <div className="gx-module-box-content" style={{ height: contentHeight, overflowY: 'scroll' }}>
            {children}
          </div>
        </div>

        {footer && (
          <div
            style={{
              width: '100%',
              backgroundColor: '#1c2536',
              borderTop: '1px solid #000',
              padding: '15px 10px',
              ...footerStyle,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </Spin>
  );
};

export default LabsContent;
