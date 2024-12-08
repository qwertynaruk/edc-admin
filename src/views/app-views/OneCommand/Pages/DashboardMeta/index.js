import { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import OneCommandStore from 'mobx/OneCommandStore';

const DashboardMeta = () => {
  const { name, id } = useParams();
  const [isError] = useState(false);

  useEffect(() => {
    if (id) {
      const mongoChartUrl = `https://charts.mongodb.com/charts-onelife-dev-hdpivwr/embed/dashboards?id=664ebd56-bac4-45e1-81b9-31bdcc323799&theme=dark&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=true&scalingWidth=scale&scalingHeight=scale`;
      const containerDiv = document.getElementById('dashboardContainer');

      containerDiv.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = mongoChartUrl;
      iframe.frameBorder = '0';
      iframe.style.border = 'none';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      containerDiv.appendChild(iframe);
    }
  }, [id]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'Crime Intelligence', subpath: [name] }} />
      <Spin spinning={OneCommandStore.screenLoading} delay={500}>
        <div>
          <div
            id="dashboardContainer"
            style={{
              width: '100%',
              height: '100vh',
              overflow: 'auto',
              position: 'relative',
            }}
          ></div>
          {isError && <Result status="500" title="500" subTitle="Sorry, something went wrong." />}
        </div>
      </Spin>
    </>
  );
};

export default observer(DashboardMeta);
