import { useWindowDimensions } from 'react-native';

export default function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isDesktop: width >= 1024,
    isTablet: width >= 720 && width < 1024,
    isMobile: width < 720,
    hideTabs: width >= 900,
  };
}
