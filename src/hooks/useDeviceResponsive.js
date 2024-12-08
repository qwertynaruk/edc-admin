import { Grid } from 'antd';
import utils from 'utils';

export const useDeviceResponsive = () => {
  const { useBreakpoint } = Grid;
  const breakeArr = utils.getBreakPoint(useBreakpoint());
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const Devices = breakeArr[breakeArr.length - 1];

  return { isMobile, Devices, breakeArr };
};
