export const Badges = ({ maxWidth = 150, showCount = 1, items }) => {
  const showItems = items.slice(0, showCount);
  const hideItems = items.slice(showCount);

  if (showItems.length === 0) {
    return <>-</>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: 5,
      }}
    >
      {showItems.map((item) => (
        <div
          key={item.key}
          style={{
            maxWidth: hideItems > 0 ? maxWidth - 50 : maxWidth,
            padding: '5px 8px',
            borderRadius: 12,
            border: '1px solid #000',
            backgroundColor: '#1b2531',
            color: '#f0f0f0',
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </div>
      ))}
      {hideItems.length > 0 && (
        <div
          style={{
            padding: '5px 8px',
            borderRadius: 12,
            border: '1px solid #000',
            backgroundColor: '#1b2531',
            color: '#f0f0f0',
            fontSize: 14,
          }}
        >
          +{hideItems.length}
        </div>
      )}
    </div>
  );
};
