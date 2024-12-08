import DialogNotification from 'components/shared-components/DialogNotification';
import produce from 'immer';
import PersonnelStore from 'mobx/PersonelStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from 'services/UserService';

const usePersonnelEditor = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    actionLoading: false,
    error: null,
  });

  const setActionLoading = () => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
        draft.error = null;
      })
    );
  };

  const stopActionLoading = () => {
    setState(
      produce((draft) => {
        draft.actionLoading = false;
      })
    );
  };

  const setError = (error) => {
    setState(
      produce((draft) => {
        if (!error) return;
        draft.error = error;
      })
    );
  };

  const createPersonnel = async (personnel) => {
    setActionLoading();
    return PersonnelStore.Create(personnel);
  };

  const updatePersonnel = async (id, personnel) => {
    setActionLoading();
    return PersonnelStore.Update(id, personnel);
  };

  const createPersonnelWithoutUser = async (personnel) => {
    return createPersonnel(personnel)
      .then(createPersonnelSuccess)
      .catch(createPersonnelFail)
      .finally(() => {
        stopActionLoading();
      });
  };

  const createPersonnelWithUser = async (personnel, user) => {
    return createPersonnel(personnel)
      .then(() => {
        return createUser(user, personnel).catch(() => {
          createUserFail();
          throw new Error('create user fail');
        });
      })
      .then(createPersonnelSuccess)
      .catch(createPersonnelFail)
      .finally(() => {
        stopActionLoading();
      });
  };

  const updatePersonnelWithoutUser = async (id, personnel) => {
    return updatePersonnel(id, personnel)
      .then(updatePersonnelSuccess)
      .catch(updatePersonnelFail)
      .finally(() => {
        stopActionLoading();
      });
  };

  const createUser = async (user, personnel) => {
    setActionLoading();
    return UserService.create({
      ...user,
      ...personnel,
      // first_name: personnel.first_name,
      // middle_name: personnel.middle_name,
      // last_name: personnel.last_name,
      // prefix_name: personnel.prefix_name,
      // person_card_id: personnel.person_card_id,
      // cover_image_file: personnel.cover_image_file,
      // s3_upload_key: personnel.s3_upload_key,
      // phone_number: personnel.phone_number || '',
      // line_id: personnel.line_id || '',
      role: 'police',
      is_active: true,
    }).finally(() => {
      stopActionLoading();
    });
  };

  const createUserFail = (error) => {
    DialogNotification('error', 'สร้างผู้ใช้งานไม่สำเร็จ');
    setError(error);
    return error;
  };

  const createPersonnelSuccess = () => {
    DialogNotification('success', 'สร้างกำลังพลสำเร็จ');
    navigate(-1);
  };

  const createPersonnelFail = (error) => {
    console.error(error);
    DialogNotification('error', 'สร้างกำลังพลไม่สำเร็จ');
    setError(error?.error);
    return error;
  };

  const updatePersonnelSuccess = () => {
    DialogNotification('success', 'แก้ไขกำลังพลสำเร็จ');
  };

  const updatePersonnelFail = (error) => {
    DialogNotification('error', 'แก้ไขกำลังพลไม่สำเร็จ');
    setError(error?.body?.message);
    return error;
  };

  return {
    state,
    setActionLoading,
    setState,
    stopActionLoading,
    createPersonnelWithoutUser,
    createPersonnelWithUser,
    createPersonnel,
    createUser,
    createUserFail,
    createPersonnelSuccess,
    createPersonnelFail,
    updatePersonnel,
    updatePersonnelSuccess,
    updatePersonnelFail,
    updatePersonnelWithoutUser,
  };
};

export default usePersonnelEditor;
