import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useBreakpoint() {
  const [windowDimensions, setWindowDimensions] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth || Dimensions.get('window').width || 360,
        height: window.innerHeight || Dimensions.get('window').height || 740
      };
    }
    const d = Dimensions.get('window');
    return { width: d.width || 360, height: d.height || 740 };
  });

  useEffect(() => {
    const onChange = ({ window: win }) => {
      setWindowDimensions({
        width: win.width,
        height: win.height
      });
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const width = windowDimensions.width;
  const isPhone = width < 768; // < 768 is phone / mobile
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isSmallPhone = width < 380;

  return {
    width,
    height: windowDimensions.height,
    isPhone,
    isTablet,
    isDesktop,
    isSmallPhone,
    showSidebar: !isPhone,
    showBottomTabs: isPhone
  };
}

export default useBreakpoint;
