import { useCallback, useEffect, useState } from 'react';

import { observer } from 'mobx-react';
import PersonnelStore from 'mobx/PersonelStore';
import DialogNotification from 'components/shared-components/DialogNotification';
import PersonnelEditor, { PersonnelEditorContext } from '../../Components/PersonnelEditor';
import { useNavigate, useParams } from 'react-router-dom';
import usePersonnelEditor from '../../hooks/usePersonnelEditor';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';

const EditPersonnal = (props) => {
  const [personnel, setPersonnel] = useState(null);

  const { state, updatePersonnelWithoutUser } = usePersonnelEditor();
  const navigate = useNavigate();
  const { id } = useParams();

  const onSubmit = (values) => {
    const { personnel } = values;
    if (personnel?.manager?.length <= 0) {
      delete personnel?.manager;
    }

    updatePersonnelWithoutUser(id, personnel);
  };

  const onCancel = () => {
    navigate(-1);
  };
  const getPersonnel = useCallback(() => {
    return PersonnelStore.GetById(id)
      .then(setPersonnel)
      .catch((err) => {
        DialogNotification('error', 'ไม่สามารถแก้ไขกำลังพลได้');
        navigate(-1);
        return err;
      });
  }, [id, navigate]);

  useEffect(() => {
    getPersonnel();
  }, [getPersonnel]);

  const title = 'แก้ไขข้อมูลกำลังพล';

  return (
    <PersonnelEditorContext.Provider
      value={{
        personnel,
        getPersonnel,
        actionLoading: state.actionLoading,
        userCreationError: state.error,
      }}
    >
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: title }} />
      <PersonnelEditor onSubmit={onSubmit} onCancel={onCancel} title={title} {...props} />
    </PersonnelEditorContext.Provider>
  );
};

export default observer(EditPersonnal);
