import { Card, Col, Form, Row, Select, Typography } from 'antd';
import React from 'react';
import ReportService from 'services/ReportServices';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import useFilterUserById from '../UserSelectWidget/useFilterUserById';
const { Option } = Select;
const { Title } = Typography;
const SelectAllReportWidget = (props) => {
  const { form, listReportAddAlready = [] } = props;
  const [selectDataList, setSelectDataList] = React.useState([]);
  const { getUserFormSelectWidget } = useFilterUserById();
  const getDataNames = form.getFieldValue(['to_report']) || [];
  const api = {
    async getReportAllData() {
      try {
        const resp = await ReportService.getAllReport();
        const { status, data } = resp;
        return resp;
      } catch (error) {
        return error;
      }
    },
  };
  const selectType = (id_type, typeReport) => {
    const { statusCode = 400, data = [] } = typeReport;

    if (statusCode === 400) {
      return '-';
    }

    const [type = {}] = data.filter((type) => type._id === id_type);
    return type.name;
  };

  const selectGroupTypeReport = (id_type, typeReport) => {
    const { statusCode = 400, data = [] } = typeReport;

    if (statusCode === 400) {
      return '-';
    }

    const [type = {}] = data.filter((type) => type._id === id_type);
    return type.group_type;
  };
  React.useEffect(() => {
    const callApi = async () => {
      const resp = await api.getReportAllData();
      const typeReport = await ReportService.getTypesGeneral();
      const { data = [] } = resp;
      const dataListConvertType = data.map(({ report_type_id = '', ...otherData }) => {
        return {
          ...otherData,
          ...{
            report_type_id: selectType(report_type_id, typeReport) || 'ไม่ทราบประเภท',
            report_sequence_id: otherData.report_case_number,
            report_number_id: selectGroupTypeReport(report_type_id, typeReport) || '-',
            exported_at: ThaiDateTime(otherData.updated_at, 'short-month-full'),
          },
        };
      });
      setSelectDataList(dataListConvertType);
    };
    callApi();
  }, []);
  const listOption = React.useMemo(() => {
    const filterNotSelect = selectDataList.filter(({ _id }) => {
      const checkId = [...getDataNames, ...listReportAddAlready].map(({ _id: idReport }) => {
        return idReport === _id ? _id : '';
      });
      return !checkId.includes(_id);
    });
    return filterNotSelect || [];
  }, [getDataNames, selectDataList, listReportAddAlready]);

  return (
    <Form.Item label="ค้นหารายงาน">
      <Select
        showSearch
        onChange={(value) => {
          const filterSet = selectDataList.filter(({ _id }) => _id === value);
          const to_report = [...getDataNames, ...filterSet];
          form.setFieldsValue({ to_report });
        }}
        filterOption={(input, option) => {
          const id = option.value;
          const original = listOption.find(({ _id }) => _id === id);
          if (!original) {
            return false;
          }
          return JSON.stringify(original).toLowerCase().includes(input.toLowerCase());
        }}
      >
        {listOption.map(
          (
            {
              report_type_id,
              report_record_id,
              _id,
              report_owner_id,
              report_sequence_id,
              report_number_id,
              exported_at,
            },
            index
          ) => (
            <Option value={_id} key={index}>
              <Card className="gx-mb-0">
                <Row className="gx-flex-row" gutter={[0, 16]}>
                  <Col span="24">
                    <span>
                      <Title level={4} className="gx-mb-0">
                        {report_number_id} | {report_sequence_id ? `${report_sequence_id} /` : null} {exported_at}
                      </Title>
                    </span>
                  </Col>
                  <Col span="24">
                    <p className="gx-mb-0">
                      หมายเลขรายงาน {report_record_id} {report_type_id} เจ้าของรายงาน
                      {report_owner_id && getUserFormSelectWidget(report_owner_id).name_user}
                      {!report_owner_id && 'ประชาชน'}
                    </p>
                  </Col>
                </Row>
              </Card>
            </Option>
          )
        )}
      </Select>
    </Form.Item>
  );
};

export default SelectAllReportWidget;
