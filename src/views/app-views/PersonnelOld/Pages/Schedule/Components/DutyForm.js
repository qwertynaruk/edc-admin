import { createContext, useContext } from 'react';
import DutyFormStep0 from './DutyFormStep0';
import DutyFormStep1 from './DutyFormStep1';
import DutyFormStep2 from './DutyFormStep2';
import DutyFormStep3 from './DutyFormStep3';

export const DutyFormContext = createContext({
  edit: false,
  step: 0,
  record: null,
  person: false,
  actionLoading: false,
});

const DutyForm = () => {
  const { step = 0, onCancel, onBack } = useContext(DutyFormContext);
  if (step === 1) return <DutyFormStep1 onCancel={onCancel} onBack={onBack} />;
  if (step === 2) return <DutyFormStep2 onCancel={onCancel} onBack={onBack} />;
  if (step === 3) return <DutyFormStep3 onBack={onBack} />;
  return <DutyFormStep0 onCancel={onCancel} />;
};

export default DutyForm;
