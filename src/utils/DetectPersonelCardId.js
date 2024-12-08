const DetectPersonelCardId = (id) => {
  if (!id) return false;
  if (id.length <= 0) return true;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseFloat(id.charAt(i)) * (13 - i);
  if ((11 - (sum % 11)) % 10 !== parseFloat(id.charAt(12))) return false;
  return true;
};

export default DetectPersonelCardId;
