const MiniTrend = ({ values = [22, 30, 26, 42, 38, 55, 48, 63], color = '#3b82f6' }) => {
  const width = 120;
  const height = 38;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-[120px] overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${points} ${width},${height}`} fill="rgba(59,130,246,0.08)" stroke="none" />
    </svg>
  );
};

export default MiniTrend;