const ContentPlaceholder = ({ message }) => (
  <div
    style={{
      height: '100%',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <span style={{ opacity: '0.4', fontWeight: 300, fontSize: 25 }}>{message}</span>
  </div>
);

export default ContentPlaceholder;
