import { useMediaQuery } from 'react-responsive';

const useBreakpoints = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: '640px' });
  return { isSmallScreen };
};

export default useBreakpoints;
