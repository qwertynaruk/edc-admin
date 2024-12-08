import { Col, Form, Row } from 'antd';
import MultipleFileUpload from 'components/shared-components/MultipleFileUpload';

const PersonnelRelateFileForm = (props) => {
  return (
    <Row className="gx-flex-row">
      <Col>
        <Form.Item name="relate_file">
          <MultipleFileUpload fieldName="relate_file" bucketName="personnel" form={props.form} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default PersonnelRelateFileForm;
