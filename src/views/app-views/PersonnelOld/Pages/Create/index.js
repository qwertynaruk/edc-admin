import PersonnelEditor, { PersonnelEditorContext } from '../../Components/PersonnelEditor';

import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import usePersonnelEditor from '../../hooks/usePersonnelEditor';

const CreatePersonnal = (props) => {
  const navigate = useNavigate();
  const { state, createUser, createPersonnelSuccess, createPersonnelFail } = usePersonnelEditor();

  const onSubmit = (values) => {
    const { personnel, user } = values;
    createUser(user, personnel).then(createPersonnelSuccess).catch(createPersonnelFail);
  };

  const onCancel = () => {
    navigate(-1);
  };

  const title = 'เพิ่มข้อมูลกำลังพล';

  return (
    <PersonnelEditorContext.Provider value={{ actionLoading: state.actionLoading, userCreationError: state.error }}>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: title }} />
      <PersonnelEditor onSubmit={onSubmit} onCancel={onCancel} title={title} {...props} />
    </PersonnelEditorContext.Provider>
  );
};

export default observer(CreatePersonnal);
