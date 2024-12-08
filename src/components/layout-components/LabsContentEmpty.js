const LabsContentEmpty = (props) => {
  return (
    <div
      style={{
        height: '100%',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, .4)',
      }}
      {...props}
    >
      <div style={{ fontWeight: 300, fontSize: 25 }}>{props.children}</div>
    </div>
  );
};

export default LabsContentEmpty;
