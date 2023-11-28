type HelperIndicatorType = 'schema' | 'portal' | 'attestation';

const getIndicatorColorClass = (type: HelperIndicatorType): string => {
  switch (type) {
    case 'schema':
      return 'bg-pink-600';
    case 'attestation':
      return 'bg-blue-700';
    case 'portal':
      return 'bg-lime-600';
    default:
      return 'bg-transparent';
  }
};

export const HelperIndicator: React.FC<{ type: HelperIndicatorType }> = ({ type }) => {
  const indicatorColorClass = getIndicatorColorClass(type);
  return <div className={`w-[3.33px] h-[13.33px] ${indicatorColorClass} rounded-full`} />;
};
