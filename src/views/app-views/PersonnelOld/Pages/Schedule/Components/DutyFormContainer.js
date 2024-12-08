import { Form } from 'antd';
import produce from 'immer';
import _, { clamp } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertValues } from 'utils';
import { transformPayloadIntoScheduleForm } from 'utils/dataTranformer';
import DutyForm, { DutyFormContext } from './DutyForm';
import RequestForEditReason from './Modal/RequestForEditReason';

const getStep = (edit, person) => {
  if (edit && person) return 2;
  if (edit) return 1;
  return 0;
};

const DutyFormContainer = (props) => {
  const { record, edit, person } = props;

  const navigate = useNavigate();
  const [state, setState] = useState({
    modalVisible: false,
    step: getStep(edit, person),
    formValues: {
      type: person ? 'บุคลากร' : 'ชุดปฏิบัติการ',
    },
  });

  const cancel = () => {
    navigate(-1);
  };
  const back = () => {
    setState(
      produce((draft) => {
        if (person && draft.step === 2) {
          const min = edit ? 2 : 0;
          draft.step = clamp(0, min, 2);
        } else {
          const min = edit ? 1 : 0;
          draft.step = clamp(draft.step - 1, min, 2);
        }
      })
    );
  };
  const openModal = (values) => {
    setState(
      produce((draft) => {
        draft.modalVisible = true;
        insertValues(draft.formValues, values);
      })
    );
  };
  const closeModal = () => {
    setState(
      produce((draft) => {
        draft.modalVisible = false;
      })
    );
  };
  const finish = (values) => {
    if (props.onFinish) props.onFinish(values);
  };
  const onModalOk = (text) => {
    finish(
      produce(state.formValues, (draft) => {
        draft.edit_message = text;
      })
    );
  };
  const onFinish = (name, { values }) => {
    const stripedValues = _.pickBy(values, _.identity);
    if (name === 'step0') {
      setState(
        produce((draft) => {
          if (person) {
            draft.step = 2;
          } else {
            draft.step = 1;
          }
          insertValues(draft.formValues, stripedValues);
        })
      );
    }
    if (name === 'step1') {
      setState(
        produce((draft) => {
          draft.step = 2;
          insertValues(draft.formValues, stripedValues);
        })
      );
    }
    if (name === 'step2') {
      setState(
        produce((draft) => {
          draft.step = 3;
          insertValues(draft.formValues, stripedValues);
        })
      );
    }
    if (name === 'step3') {
      const newState = produce(state, (draft) => {
        insertValues(draft.formValues, stripedValues);
      });
      if (edit) {
        openModal(newState.formValues);
      } else {
        finish(newState.formValues);
      }
    }
  };

  useEffect(() => {
    if (!record) return;
    setState(
      produce((draft) => {
        draft.formValues = transformPayloadIntoScheduleForm(record);
      })
    );
  }, [record]);
  return (
    <>
      <Form.Provider onFormFinish={onFinish}>
        <DutyFormContext.Provider
          value={{
            edit,
            person,
            step: state.step,
            record: state.formValues,
            actionLoading: props.actionLoading,
            onCancel: cancel,
            onBack: back,
          }}
        >
          <DutyForm />
        </DutyFormContext.Provider>
        <RequestForEditReason
          visible={state.modalVisible}
          onCancel={closeModal}
          onOk={onModalOk}
          actionLoading={props.actionLoading}
        />
      </Form.Provider>
    </>
  );
};

export default DutyFormContainer;
