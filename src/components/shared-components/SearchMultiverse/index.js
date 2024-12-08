import { Button, Card, Col, Divider, Form, Input, Row, Space, Spin, Typography } from 'antd';
import { CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { isValidElement, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { toJS } from 'mobx';

const { Search } = Input;

const SearchMultiverse = ({
  nodeData = [],
  placeholder = 'ค้นหา',
  mode = 'normal', // auto | select-tree | normal
  onSetNodeData = null,
  filter = {
    active: false,
    form: {},
    dropHeader: 'Card Title',
    dropFooter: [],
    onFilterOpen: null,
    onFilterClose: null,
    onSubmit: () => undefined,
  },
  advanceSearch = false,
  children = null,
}) => {
  const searchRef = useRef();
  const [visibleFilterForm, setvisibleFilterForm] = useState(false);
  const [visibleSearchForm, setVisibleSearchForm] = useState(false);
  const [activeClearFilter, setActiveClearFilter] = useState(false);
  const [fieldValue, setFieldValue] = useState('');

  const onSubmitSearch = () => {
    if (mode === 'auto' && activeClearFilter) {
      onSetNodeData(toJS(nodeData), fieldValue);
      setActiveClearFilter(false);
      setFieldValue('');
    }
  };

  const onAdvanceSearchTrigger = () => {
    setVisibleSearchForm(true);
  };

  const onFilterTrigger = () => {
    if (visibleFilterForm && filter.onFilterClose) {
      filter.onFilterClose();
    }

    if (!visibleFilterForm && filter.onFilterOpen) {
      filter.onFilterOpen();
    }

    setvisibleFilterForm(!visibleFilterForm);
  };

  const onChangeInputField = (e) => {
    if (mode === 'auto') {
      const rawData = toJS(nodeData);
      const _this = e.target.value.toLowerCase();

      setActiveClearFilter(e.target.value.length > 0);
      setFieldValue(e.target.value);

      onSetNodeData(
        rawData.filter((ex) => JSON.stringify(Object.values(ex)).toLowerCase().indexOf(_this) > -1),
        e.target.value
      );
    }
  };

  const SearchMode = {
    filter: () => {
      return (
        <>
          <Typography.Text>ค้นหา</Typography.Text>

          <Row className="gx-mt-2" gutter={[8, 8]}>
            <Col span={filter.active ? 21 : 24}>
              <Search
                className="gx-full-width gx-mb-0"
                placeholder={placeholder}
                onSearch={onSubmitSearch}
                ref={searchRef}
                onChange={onChangeInputField}
                enterButton={activeClearFilter ? <CloseOutlined /> : false}
                value={fieldValue}
              />
            </Col>

            {filter.active && (
              <Col span={3}>
                <Button
                  className="gx-px-0 gx-full-width"
                  style={{ backgroundColor: '#374256' }}
                  icon={<FilterOutlined />}
                  onClick={onFilterTrigger}
                >
                  เพิ่มตัวกรอง
                </Button>
              </Col>
            )}
          </Row>

          {visibleFilterForm && (
            <Form layout="vertical" form={filter.form} onFinish={filter.onSubmit}>
              <Card
                className="gx-mt-3 gx-mb-0"
                bordered={false}
                bodyStyle={{ paddingBottom: 5 }}
                title={<div style={{ opacity: 0.5 }}>{filter.dropHeader}</div>}
              >
                {isValidElement(children) && children}
                {/* {typeof children === "function" && children({ form })} */}
              </Card>

              <Divider />
              <Space className="gx-flex-end">
                {filter.dropFooter || (
                  <>
                    <Button onClick={() => filter.form?.resetFields()}>ล้างค่า</Button>
                    <Button type="primary" htmlType="submit">
                      ค้นหา
                    </Button>
                  </>
                )}
              </Space>
            </Form>
          )}
        </>
      );
    },
    advance: () => {
      return (
        <>
          <Typography.Text>ค้นหา</Typography.Text>

          <Row className="gx-mt-2" gutter={[8, 8]}>
            <Col span={19}>
              <Search
                className="gx-full-width gx-mb-0"
                placeholder={placeholder}
                onSearch={onSubmitSearch}
                ref={searchRef}
                onChange={onChangeInputField}
                enterButton={activeClearFilter ? <CloseOutlined /> : false}
                value={fieldValue}
              />
            </Col>

            <Col span={5}>
              <Button
                className="gx-px-0 gx-full-width"
                style={{ backgroundColor: '#374256' }}
                icon={<FilterOutlined />}
                onClick={onAdvanceSearchTrigger}
              >
                ฟอร์มการค้นหาแบบละเอียด
              </Button>
            </Col>
          </Row>
        </>
      );
    },
  };

  return (
    <Spin spinning={false}>
      {visibleSearchForm ? children : !advanceSearch ? SearchMode.filter() : SearchMode.advance()}
    </Spin>
  );
};

export default observer(SearchMultiverse);
