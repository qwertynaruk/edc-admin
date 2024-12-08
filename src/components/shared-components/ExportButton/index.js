import { Button } from 'antd';
import { isValidElement, useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx/xlsx.mjs';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import DataIndicesCategorySelectModal from '../DataIndicesCategorySelectModal';
import { isObservableObject, toJS } from 'mobx';
import produce from 'immer';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';

const Child = ({ column = [], dataSource = [], fileName = 'example', buttonLabel = 'ออกรายงาน' }) => {
  const btnRef = useRef();
  const [visible, setVisible] = useState(false);
  const [exportType, setExportType] = useState(null);

  const hasHeader = column.length > 0;

  const getDataSource = (dataSource) => {
    if (!hasHeader) {
      return dataSource.length === 1 ? dataSource[0] : dataSource.flat();
    }
    return dataSource;
  };

  const extractMobxData = (data) => {
    if (isObservableObject(data)) {
      return toJS(data);
    }
    return data;
  };

  const makeStaticDataSource = (dataSource) => {
    if (!dataSource) {
      return [];
    }
    if (dataSource.length === 0) {
      return [];
    }
    return extractMobxData(dataSource).map((data) => {
      const keys = Object.keys(data);
      if (keys.length === 0) return data;
      const normalize = _.mapValues(data, extractMobxData);
      return produce(normalize, (draft) => {
        keys.forEach((key) => {
          if (isValidElement(draft[key])) {
            draft[key] = ReactDOMServer.renderToString(draft[key]);
          }
        });
      });
    });
  };

  useEffect(() => {
    if (exportType === 'csv') {
      btnRef.current.click();
      setExportType(null);
    }
    if (exportType === 'excel') {
      if (hasHeader) {
        excelGenerate();
      } else {
        excelGenerateWithoutHeader();
      }
    }
  }, [exportType]);

  const excelGenerateWithoutHeader = () => {
    const wb = XLSX.utils.book_new();
    dataSource.forEach((data) => {
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, `${data?.[0]?.[0].slice(0, 31)}`);
    });
    XLSX.writeFile(wb, `${fileName}-${ThaiDateTime(null, 'now')}.xlsx`);
  };

  const excelGenerate = () => {
    const RowDataExport = [column.map((ez) => ez.label)];
    dataSource.map((ds) => {
      const unix = [];
      const _tx = Object.entries(ds);
      column.forEach((ez) => {
        if (_tx.filter((em) => em[0] === ez.key).length > 0) {
          unix.push(_tx.filter((em) => em[0] === ez.key)[0][1] || '-');
        }
      });
      RowDataExport.push(unix);
      return null;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(RowDataExport);
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, `Sheet ${fileName.slice(0, 25)}`);
    XLSX.writeFile(new_workbook, `${fileName}-${ThaiDateTime(null, 'now')}.xlsx`);
  };

  const handlesOk = (value) => {
    setExportType(value);
  };

  const handlesCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <div style={{ display: 'none' }}>
        <CSVLink
          data={makeStaticDataSource(getDataSource(dataSource))}
          headers={hasHeader ? column : null}
          filename={`${fileName}-${ThaiDateTime(null, 'now')}.csv`}
        >
          <Button ref={btnRef} type="primary">
            Export
          </Button>
        </CSVLink>
      </div>
      <Button type="primary" onClick={() => setVisible(true)}>
        {buttonLabel}
      </Button>
      <DataIndicesCategorySelectModal
        visible={visible}
        actionState="export_module"
        category={['csv', 'excel']}
        onOk={handlesOk}
        onCancel={handlesCancel}
      />
    </>
  );
};

function ExportButton(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }
  return <Child {...props} />;
}

export default ExportButton;
