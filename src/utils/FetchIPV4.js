const apiConnect = async () => {
  const _tm = await fetch('https://api.ipify.org?format=json').then((res) => {
    return res.json();
  });
  const { ip } = _tm;
  return ip;
};

export { apiConnect };
